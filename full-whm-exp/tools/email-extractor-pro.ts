/**
 * Email Extractor Pro - Advanced Email Extraction Tool
 * WHOAMISec Offensive Security Toolkit
 * TypeScript/Node.js Implementation
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';

interface ExtractorConfig {
  target: string;
  targetType: 'url' | 'file' | 'text';
  maxDepth?: number;
  outputFormat?: 'json' | 'text';
}

interface ExtractionResult {
  totalEmails: number;
  uniqueDomains: number;
  commonDomains: number;
  topDomains: Array<[string, number]>;
  emails: string[];
}

class EmailExtractorPro {
  private emails: Set<string> = new Set();
  private visitedUrls: Set<string> = new Set();
  private emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  private mailtoPattern = /mailto:([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/g;
  private urlPattern = /href=["'](https?:\/\/[^"']+)["']/g;

  private commonDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
    'icloud.com', 'mail.com', 'yandex.com', 'protonmail.com',
    'zoho.com', 'fastmail.com', 'tutanota.com'
  ];

  private invalidPatterns = ['..', '@.', '.@', 'mailto'];
  private invalidEmails = ['noreply', 'no-reply', 'donotreply', 'admin', 'webmaster', 'postmaster', 'root', 'info', 'support', 'abuse'];

  private commonPages = [
    '/contact', '/contact-us', '/about', '/team', '/staff',
    '/directory', '/people', '/members', '/users', '/profiles'
  ];

  private extractFromText(text: string): string[] {
    const emails = text.match(this.emailPattern) || [];
    const mailtoEmails = text.match(this.mailtoPattern) || [];
    return [...emails, ...mailtoEmails.map(m => m.replace('mailto:', ''))];
  }

  private async extractFromUrl(url: string, depth: number = 0, maxDepth: number = 3): Promise<string[]> {
    if (depth > maxDepth || this.visitedUrls.has(url)) {
      return [];
    }

    this.visitedUrls.add(url);

    try {
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      };

      const response = await axios.get(url, { 
        headers, 
        timeout: 10000,
        validateStatus: (status) => status < 500
      });

      const emails = this.extractFromText(response.data);
      
      // Find more URLs to crawl
      if (depth < maxDepth) {
        const foundUrls = response.data.match(this.urlPattern) || [];
        const baseUrl = new URL(url);
        
        for (const foundUrl of foundUrls) {
          const cleanUrl = foundUrl.replace(/href=["']/g, '').replace(/["']$/g, '');
          try {
            const absoluteUrl = new URL(cleanUrl, baseUrl).toString();
            if (this.isSameDomain(url, absoluteUrl)) {
              const nestedEmails = await this.extractFromUrl(absoluteUrl, depth + 1, maxDepth);
              emails.push(...nestedEmails);
            }
          } catch (error) {
            // Invalid URL, skip
          }
        }
      }

      return emails;
    } catch (error) {
      console.error(`[!] Error extracting from ${url}:`, error);
      return [];
    }
  }

  private extractFromFile(filePath: string): string[] {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return this.extractFromText(content);
    } catch (error) {
      console.error(`[!] Error reading file ${filePath}:`, error);
      return [];
    }
  }

  private isSameDomain(url1: string, url2: string): boolean {
    try {
      const domain1 = new URL(url1).hostname;
      const domain2 = new URL(url2).hostname;
      return domain1 === domain2;
    } catch {
      return false;
    }
  }

  private filterEmails(emails: string[]): string[] {
    const filtered: string[] = [];

    for (const email of emails) {
      // Basic validation
      if (!email.includes('@') || !email.includes('.')) continue;
      
      // Check for invalid patterns
      if (this.invalidPatterns.some(pattern => email.includes(pattern))) continue;

      try {
        const domain = email.split('@')[1].toLowerCase();
        
        // Skip invalid emails
        if (this.invalidEmails.some(invalid => email.includes(invalid))) continue;
        
        filtered.push(email.toLowerCase());
      } catch {
        continue;
      }
    }

    return filtered;
  }

  private async crawlCommonPages(baseUrl: string): Promise<string[]> {
    const base = new URL(baseUrl);
    const allEmails: string[] = [];

    // Create promises for concurrent crawling
    const crawlPromises = this.commonPages.map(async (page) => {
      try {
        const pageUrl = new URL(page, base).toString();
        return await this.extractFromUrl(pageUrl, 0, 1);
      } catch {
        return [];
      }
    });

    const results = await Promise.allSettled(crawlPromises);
    
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allEmails.push(...result.value);
      }
    }

    return allEmails;
  }

  public async extractEmails(config: ExtractorConfig): Promise<ExtractionResult> {
    console.log(`[+] Starting email extraction from ${config.targetType}: ${config.target}`);

    let emails: string[] = [];
    const maxDepth = config.maxDepth || 3;

    switch (config.targetType) {
      case 'url':
        emails = await this.extractFromUrl(config.target, 0, maxDepth);
        // Additional processing for URLs - crawl common pages
        const commonPageEmails = await this.crawlCommonPages(config.target);
        emails.push(...commonPageEmails);
        break;
      
      case 'file':
        emails = this.extractFromFile(config.target);
        break;
      
      case 'text':
        emails = this.extractFromText(config.target);
        break;
      
      default:
        throw new Error("Invalid target type. Use 'url', 'file', or 'text'");
    }

    // Filter emails
    const filteredEmails = this.filterEmails(emails);
    filteredEmails.forEach(email => this.emails.add(email));

    return this.getStatistics();
  }

  private getStatistics(): ExtractionResult {
    const domains: Map<string, number> = new Map();
    
    for (const email of this.emails) {
      const domain = email.split('@')[1];
      domains.set(domain, (domains.get(domain) || 0) + 1);
    }

    const topDomains = Array.from(domains.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    const commonDomainsCount = Array.from(domains.keys())
      .filter(domain => this.commonDomains.includes(domain)).length;

    return {
      totalEmails: this.emails.size,
      uniqueDomains: domains.size,
      commonDomains: commonDomainsCount,
      topDomains: topDomains as Array<[string, number]>,
      emails: Array.from(this.emails).sort()
    };
  }

  public printBanner(): void {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║  ✋✋✋ EMAIL EXTRACTOR PRO - ADVANCED EMAIL HARVESTING ✋✋✋                             ║
║  █     █░▓█████  ██▀███   ███▄ ▄███▓▓█████  ██▓███   ▄▄▄█████▓░██████╗ ██╗          ║
║  ▓█░ █ ░█░▓█   ▀ ▓██ ▒ ██▒▓██▒▀█▀ ██▒▓█   ▀ ▓██░  ██▒▓  ██▒ ▓▒▒██    ▒ ▒██║          ║
║  ▒█░ █ ░█ ▒███   ▓██ ░▄█ ▒▓██    ▓██░▒███   ▓██░ ██▓▒▒ ▓██░ ▒░░ ▓██▄   ░██║          ║
║  ░█░ █ ░█ ▒▓█  ▄ ▒██▀▀█▄  ▒██    ▒██ ▒▓█  ▄ ▒██▄█▓▒ ▒░ ▓██▓ ░   ▒   ██▒░██║          ║
║  ░░██▒██▓ ░▒████▒░██▓ ▒██▒▒██▒   ░██▒░▒████▒▒██▒ ░  ░  ▒██▒ ░ ▒██████▒▒░██║          ║
║  ░ ▓░▒ ▒  ░░ ▒░ ░░ ▒▓ ░▒▓░░ ▒░   ░  ░░░ ▒░ ░▒▓▒░ ░  ░  ▒ ░░   ▒ ▒▓▒ ▒ ░░▓  ║
║    ▒ ░ ░   ░ ░  ░  ░▒ ░ ▒░░  ░      ░ ░ ░  ░░▒ ░         ░    ░  ░▒  ░ ░ ▒ ░║
║    ░   ░     ░     ░░   ░ ░      ░      ░   ░░         ░ ░    ░  ░  ░   ▒ ░║
║      ░       ░  ░   ░            ░      ░  ░                       ░   ░   ║
║                                                                           ║
║        EMAIL EXTRACTOR PRO - ADVANCED EMAIL HARVESTING                    ║
║   Multi-Source Extraction | Domain Filtering | Bulk Processing              ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
    `);
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node email-extractor-pro.js <target> <type> [depth] [output]');
    console.log('Types: url, file, text');
    process.exit(1);
  }

  const config: ExtractorConfig = {
    target: args[0],
    targetType: args[1] as 'url' | 'file' | 'text',
    maxDepth: parseInt(args[2]) || 3,
    outputFormat: args[3] as 'json' | 'text' || 'json'
  };

  const extractor = new EmailExtractorPro();
  extractor.printBanner();

  extractor.extractEmails(config)
    .then(result => {
      if (config.outputFormat === 'json') {
        console.log(JSON.stringify({
          tool: "email-extractor-pro",
          timestamp: new Date().toISOString(),
          target: config.target,
          targetType: config.targetType,
          result: result
        }, null, 2));
      } else {
        console.log("\n" + "=".repeat(60));
        console.log("EMAIL EXTRACTION RESULTS");
        console.log("=".repeat(60));
        console.log(`Target: ${config.target}`);
        console.log(`Type: ${config.targetType}`);
        console.log(`Total Emails Found: ${result.totalEmails}`);
        console.log(`Unique Domains: ${result.uniqueDomains}`);
        console.log(`Common Domains: ${result.commonDomains}`);
        console.log("Top 5 Domains:");
        result.topDomains.slice(0, 5).forEach(([domain, count]) => {
          console.log(`  ${domain}: ${count} emails`);
        });
        console.log("\nExtracted Emails:");
        result.emails.forEach(email => console.log(`  ${email}`));
      }
    })
    .catch(error => {
      console.error('[!] Error:', error);
      process.exit(1);
    });
}

export { EmailExtractorPro, ExtractorConfig, ExtractionResult };