/**
 * Proxy Scraper Tool - WHOAMISec Offensive Toolkit
 * Scrape HTTP/SOCKS proxies from multiple sources
 * TypeScript/Node.js Implementation
 */

import axios from 'axios';
import * as fs from 'fs';

interface ProxySource {
  url: string;
  type: 'http' | 'socks4' | 'socks5' | 'all';
  description: string;
}

interface ProxyResult {
  proxy: string;
  type: 'http' | 'socks4' | 'socks5';
  source: string;
  responseTime?: number;
}

interface ScrapingResult {
  totalFound: number;
  uniqueProxies: number;
  byType: {
    http: number;
    socks4: number;
    socks5: number;
  };
  proxies: ProxyResult[];
}

class ProxyScraperTool {
  private proxySources: ProxySource[] = [
    { url: 'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt', type: 'http', description: 'Monosans HTTP' },
    { url: 'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks4.txt', type: 'socks4', description: 'Monosans SOCKS4' },
    { url: 'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt', type: 'socks5', description: 'Monosans SOCKS5' },
    { url: 'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt', type: 'http', description: 'SpeedX HTTP' },
    { url: 'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks4.txt', type: 'socks4', description: 'SpeedX SOCKS4' },
    { url: 'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt', type: 'socks5', description: 'SpeedX SOCKS5' },
    { url: 'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt', type: 'http', description: 'Jetkai HTTP' },
    { url: 'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks4.txt', type: 'socks4', description: 'Jetkai SOCKS4' },
    { url: 'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks5.txt', type: 'socks5', description: 'Jetkai SOCKS5' },
    { url: 'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt', type: 'all', description: 'Clarketm Mixed' },
    { url: 'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt', type: 'socks5', description: 'Hookzof SOCKS5' },
    { url: 'https://raw.githubusercontent.com/prxchk/proxy-list/main/http.txt', type: 'http', description: 'Prxchk HTTP' },
    { url: 'https://raw.githubusercontent.com/prxchk/proxy-list/main/socks5.txt', type: 'socks5', description: 'Prxchk SOCKS5' },
    { url: 'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/http/http.txt', type: 'http', description: 'KangProxy HTTP' },
    { url: 'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt', type: 'all', description: 'Sunny9577 Mixed' },
    { url: 'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt', type: 'http', description: 'Roosterkid HTTP' },
    { url: 'https://raw.githubusercontent.com/opsxcq/proxy-list/master/list.txt', type: 'all', description: 'Opsxcq Mixed' },
    { url: 'https://raw.githubusercontent.com/saisuiu/Lionkings-Http-Proxys-Proxies/main/cnfree.txt', type: 'http', description: 'Lionkings HTTP' },
    { url: 'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/http.txt', type: 'http', description: 'MuRongPIG HTTP' },
    { url: 'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/socks5.txt', type: 'socks5', description: 'MuRongPIG SOCKS5' },
    { url: 'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/socks5.txt', type: 'socks5', description: 'Zaeem SOCKS5' },
    { url: 'https://raw.githubusercontent.com/mallisc5/master/proxy-list-raw.txt', type: 'all', description: 'Mallisc5 Mixed' },
    { url: 'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt', type: 'http', description: 'Ercin HTTP' },
    { url: 'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt', type: 'http', description: 'SpeedX HTTP Alt' }
  ];

  private async fetchProxiesFromSource(source: ProxySource): Promise<ProxyResult[]> {
    const results: ProxyResult[] = [];
    
    try {
      console.log(`[+] Fetching from: ${source.description}`);
      const response = await axios.get(source.url, { timeout: 10000 });
      const lines = response.data.split('\n').filter((line: string) => line.trim() !== '');
      
      for (const line of lines) {
        const proxy = line.trim();
        if (this.isValidProxy(proxy)) {
          const proxyType = this.determineProxyType(proxy, source.type);
          results.push({
            proxy: proxy,
            type: proxyType,
            source: source.description
          });
        }
      }
      
      console.log(`[+] Found ${results.length} proxies from ${source.description}`);
    } catch (error) {
      console.error(`[!] Failed to fetch from ${source.description}:`, error instanceof Error ? error.message : 'Unknown error');
    }
    
    return results;
  }

  private isValidProxy(proxy: string): boolean {
    // Basic validation for IP:PORT format
    const proxyPattern = /^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;
    return proxyPattern.test(proxy);
  }

  private determineProxyType(proxy: string, sourceType: string): 'http' | 'socks4' | 'socks5' {
    if (sourceType !== 'all') {
      return sourceType as 'http' | 'socks4' | 'socks5';
    }
    
    // Try to determine type from proxy format or default to http
    if (proxy.includes('socks4')) return 'socks4';
    if (proxy.includes('socks5')) return 'socks5';
    return 'http';
  }

  private removeDuplicates(proxies: ProxyResult[]): ProxyResult[] {
    const seen = new Set<string>();
    return proxies.filter(proxy => {
      const key = `${proxy.proxy}-${proxy.type}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private filterByType(proxies: ProxyResult[], type: 'http' | 'socks4' | 'socks5' | 'all'): ProxyResult[] {
    if (type === 'all') {
      return proxies;
    }
    return proxies.filter(proxy => proxy.type === type);
  }

  private async testProxy(proxy: ProxyResult): Promise<boolean> {
    try {
      const testUrl = 'http://httpbin.org/ip';
      const proxyUrl = proxy.type === 'http' ? `http://${proxy.proxy}` : undefined;
      
      await axios.get(testUrl, {
        proxy: proxyUrl ? { host: proxy.proxy.split(':')[0], port: parseInt(proxy.proxy.split(':')[1]) } : undefined,
        timeout: 5000,
        validateStatus: (status) => status < 500
      });
      
      return true;
    } catch {
      return false;
    }
  }

  public async scrapeProxies(type: 'http' | 'socks4' | 'socks5' | 'all' = 'all', testProxies: boolean = false): Promise<ScrapingResult> {
    console.log(`[+] Starting proxy scraping for type: ${type}`);
    
    const startTime = Date.now();
    const allResults: ProxyResult[] = [];
    
    // Filter sources by requested type
    const relevantSources = this.proxySources.filter(source => 
      type === 'all' || source.type === type || source.type === 'all'
    );
    
    console.log(`[+] Processing ${relevantSources.length} proxy sources`);
    
    // Fetch from all sources concurrently
    const fetchPromises = relevantSources.map(source => this.fetchProxiesFromSource(source));
    const results = await Promise.allSettled(fetchPromises);
    
    // Collect all results
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allResults.push(...result.value);
      }
    }
    
    console.log(`[+] Total raw proxies found: ${allResults.length}`);
    
    // Remove duplicates
    const uniqueProxies = this.removeDuplicates(allResults);
    console.log(`[+] Unique proxies after deduplication: ${uniqueProxies.length}`);
    
    // Filter by type
    const filteredProxies = this.filterByType(uniqueProxies, type);
    console.log(`[+] Proxies after type filtering: ${filteredProxies.length}`);
    
    // Test proxies if requested
    let testedProxies = filteredProxies;
    if (testProxies) {
      console.log('[+] Testing proxy connectivity...');
      const testPromises = filteredProxies.map(async (proxy) => {
        const isWorking = await this.testProxy(proxy);
        return { ...proxy, responseTime: isWorking ? Date.now() : undefined };
      });
      
      const testResults = await Promise.allSettled(testPromises);
      testedProxies = testResults
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as any).value)
        .filter(proxy => proxy.responseTime !== undefined);
      
      console.log(`[+] Working proxies after testing: ${testedProxies.length}`);
    }
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    // Generate statistics
    const stats = {
      totalFound: testedProxies.length,
      uniqueProxies: testedProxies.length,
      byType: {
        http: testedProxies.filter(p => p.type === 'http').length,
        socks4: testedProxies.filter(p => p.type === 'socks4').length,
        socks5: testedProxies.filter(p => p.type === 'socks5').length
      },
      proxies: testedProxies
    };
    
    console.log(`[+] Scraping completed in ${duration}s`);
    return stats;
  }

  public async saveToFile(proxies: ProxyResult[], outputFile: string): Promise<void> {
    try {
      const proxyLines = proxies.map(proxy => `${proxy.proxy} # ${proxy.type} - ${proxy.source}`);
      fs.writeFileSync(outputFile, proxyLines.join('\n'));
      console.log(`[+] Proxies saved to: ${outputFile}`);
    } catch (error) {
      console.error(`[!] Failed to save proxies:`, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  public printBanner(): void {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║  ✋✋✋ PROXY SCRAPER TOOL - WHOAMISEC OFFENSIVE ✋✋✋                                ║
║  █     █░▓█████  ██▀███   ███▄ ▄███▓▓█████  ██▓███   ▄▄▄█████▓░██████╗ ██╗          ║
║  ▓█░ █ ░█░▓█   ▀ ▓██ ▒ ██▒▓██▒▀█▀ ██▓▓█   ▀ ▓██░  ██▓▓  ██▒ ▓▒▒██    ▒ ▒██║          ║
║  ▒█░ █ ░█ ▒███   ▓██ ░▄█ ▒▓██    ▓██░▒███   ▓██░ ██▓▒▒ ▓██░ ▒░░ ▓██▄   ░██║          ║
║  ░█░ █ ░█ ▒▓█  ▄ ▒██▀▀█▄  ▒██    ▒██ ▒▓█  ▄ ▒██▄█▓▒ ▒░ ▓██▓ ░   ▒   ██▒░██║          ║
║  ░░██▒██▓ ░▒████▒░██▓ ▒██▒▒██▒   ░██▒░▒████▒▒██▒ ░  ░  ▒██▒ ░ ▒██████▒▒░██║          ║
║  ░ ▓░▒ ▒  ░░ ▒░ ░░ ▒▓ ░▒▓░░ ▒░   ░  ░░░ ▒░ ░▒▓▒░ ░  ░  ▒ ░░   ▒ ▒▓▒ ▒ ░░▓  ║
║    ▒ ░ ░   ░ ░  ░  ░▒ ░ ▒░░  ░      ░ ░ ░  ░░▒ ░         ░    ░  ░▒  ░ ░ ▒ ░║
║    ░   ░     ░     ░░   ░ ░      ░      ░   ░░         ░ ░    ░  ░  ░   ▒ ░║
║      ░       ░  ░   ░            ░      ░  ░                       ░   ░   ║
║                                                                           ║
║        PROXY SCRAPER TOOL - MULTI-SOURCE HARVESTING                       ║
║   HTTP/SOCKS4/SOCKS5 | GitHub Sources | Auto-Testing                        ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
    `);
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage: node proxy-scraper.js <type> [output] [test]');
    console.log('Types: http, socks4, socks5, all');
    console.log('Output: output file path (optional)');
    console.log('Test: true/false for proxy testing (optional, default: false)');
    process.exit(1);
  }

  const type = args[0] as 'http' | 'socks4' | 'socks5' | 'all';
  const outputFile = args[1];
  const testProxies = args[2] === 'true';

  const scraper = new ProxyScraperTool();
  scraper.printBanner();

  scraper.scrapeProxies(type, testProxies)
    .then(async (result) => {
      console.log('\n' + '='.repeat(60));
      console.log('PROXY SCRAPING RESULTS');
      console.log('='.repeat(60));
      console.log(`Total Found: ${result.totalFound}`);
      console.log(`Unique Proxies: ${result.uniqueProxies}`);
      console.log(`HTTP Proxies: ${result.byType.http}`);
      console.log(`SOCKS4 Proxies: ${result.byType.socks4}`);
      console.log(`SOCKS5 Proxies: ${result.byType.socks5}`);

      if (outputFile) {
        await scraper.saveToFile(result.proxies, outputFile);
      }

      // Output JSON result
      console.log(JSON.stringify({
        tool: "proxy-scraper",
        timestamp: new Date().toISOString(),
        type: type,
        result: result
      }, null, 2));
    })
    .catch(error => {
      console.error('[!] Error:', error);
      process.exit(1);
    });
}

export { ProxyScraperTool, ProxyResult, ScrapingResult, ProxySource };