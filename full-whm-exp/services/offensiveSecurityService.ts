import axios from 'axios';

export interface OffensiveTool {
  id: string;
  name: string;
  description: string;
  category: 'scanner' | 'exploiter' | 'checker' | 'bruteforce';
  executable: boolean;
  command: string;
  parameters: ToolParameter[];
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  default?: any;
  description: string;
}

export interface ToolExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  timestamp: string;
  toolId: string;
}

export interface NetworkScanResult {
  target: string;
  openPorts: PortInfo[];
  vulnerabilities: Vulnerability[];
  credentials: Credential[];
  timestamp: string;
}

export interface PortInfo {
  port: number;
  service: string;
  version: string;
  state: 'open' | 'closed' | 'filtered';
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  cve?: string;
}

export interface Credential {
  username: string;
  password: string;
  source: string;
  hash?: string;
}

export class OffensiveSecurityService {
  private static instance: OffensiveSecurityService;
  private tools: Map<string, OffensiveTool> = new Map();

  private constructor() {
    this.initializeTools();
  }

  public static getInstance(): OffensiveSecurityService {
    if (!OffensiveSecurityService.instance) {
      OffensiveSecurityService.instance = new OffensiveSecurityService();
    }
    return OffensiveSecurityService.instance;
  }

  private initializeTools() {
    // Credit Card Checker
    this.tools.set('credit-card-checker', {
      id: 'credit-card-checker',
      name: 'Credit Card Validator',
      description: 'Validate and check credit card numbers',
      category: 'checker',
      executable: true,
      command: 'python3 /app/tools/credit-card-checker.py',
      parameters: [
        {
          name: 'cardNumbers',
          type: 'string',
          required: true,
          description: 'Credit card numbers to validate (comma-separated)'
        }
      ]
    });

    // Gmail Checker
    this.tools.set('gmail-checker', {
      id: 'gmail-checker',
      name: 'Gmail Account Checker',
      description: 'Check Gmail account validity and access',
      category: 'checker',
      executable: true,
      command: 'python3 /app/tools/gmail-checker.py',
      parameters: [
        {
          name: 'email',
          type: 'string',
          required: true,
          description: 'Gmail email address to check'
        },
        {
          name: 'password',
          type: 'string',
          required: false,
          description: 'Password for account (optional)'
        }
      ]
    });

    // Netflix Checker
    this.tools.set('netflix-checker', {
      id: 'netflix-checker',
      name: 'Netflix Account Checker',
      description: 'Check Netflix account validity and subscription status',
      category: 'checker',
      executable: true,
      command: 'python3 /app/tools/netflix-checker.py',
      parameters: [
        {
          name: 'email',
          type: 'string',
          required: true,
          description: 'Netflix email address'
        },
        {
          name: 'password',
          type: 'string',
          required: true,
          description: 'Netflix password'
        }
      ]
    });

    // PayPal Checker
    this.tools.set('paypal-checker', {
      id: 'paypal-checker',
      name: 'PayPal Account Checker',
      description: 'Check PayPal account validity and balance',
      category: 'checker',
      executable: true,
      command: 'python3 /app/tools/paypal-checker.py',
      parameters: [
        {
          name: 'email',
          type: 'string',
          required: true,
          description: 'PayPal email address'
        },
        {
          name: 'password',
          type: 'string',
          required: true,
          description: 'PayPal password'
        }
      ]
    });

    // Spotify Checker
    this.tools.set('spotify-checker', {
      id: 'spotify-checker',
      name: 'Spotify Account Checker',
      description: 'Check Spotify account validity and subscription',
      category: 'checker',
      executable: true,
      command: 'python3 /app/tools/spotify-checker.py',
      parameters: [
        {
          name: 'email',
          type: 'string',
          required: true,
          description: 'Spotify email address'
        },
        {
          name: 'password',
          type: 'string',
          required: true,
          description: 'Spotify password'
        }
      ]
    });

    // Valorant Checker
    this.tools.set('valorant-checker', {
      id: 'valorant-checker',
      name: 'Valorant Account Checker',
      description: 'Check Valorant account validity and rank',
      category: 'checker',
      executable: true,
      command: 'python3 /app/tools/valorant-checker.py',
      parameters: [
        {
          name: 'username',
          type: 'string',
          required: true,
          description: 'Valorant username'
        },
        {
          name: 'password',
          type: 'string',
          required: true,
          description: 'Valorant password'
        }
      ]
    });

    // WordPress Bruteforcer
    this.tools.set('wp-bruteforce', {
      id: 'wp-bruteforce',
      name: 'WordPress Bruteforcer',
      description: 'Bruteforce WordPress admin credentials',
      category: 'bruteforce',
      executable: true,
      command: 'python3 /app/tools/wp-bruteforce.py',
      parameters: [
        {
          name: 'target',
          type: 'string',
          required: true,
          description: 'WordPress site URL'
        },
        {
          name: 'username',
          type: 'string',
          required: true,
          description: 'Username to bruteforce'
        },
        {
          name: 'wordlist',
          type: 'string',
          required: false,
          default: '/app/wordlists/common.txt',
          description: 'Path to password wordlist'
        }
      ]
    });

    // Network Scanner
    this.tools.set('network-scanner', {
      id: 'network-scanner',
      name: 'Network Scanner',
      description: 'Scan network for open ports and services',
      category: 'scanner',
      executable: true,
      command: 'python3 /app/tools/network-scanner.py',
      parameters: [
        {
          name: 'target',
          type: 'string',
          required: true,
          description: 'Target IP or hostname'
        },
        {
          name: 'ports',
          type: 'string',
          required: false,
          default: '1-1000',
          description: 'Port range to scan (e.g., 1-1000,80,443)'
        }
      ]
    });

    // Vulnerability Scanner
    this.tools.set('vuln-scanner', {
      id: 'vuln-scanner',
      name: 'Vulnerability Scanner',
      description: 'Scan for common web vulnerabilities',
      category: 'scanner',
      executable: true,
      command: 'python3 /app/tools/vuln-scanner.py',
      parameters: [
        {
          name: 'target',
          type: 'string',
          required: true,
          description: 'Target URL to scan'
        },
        {
          name: 'depth',
          type: 'number',
          required: false,
          default: 3,
          description: 'Scan depth level'
        }
      ]
    });

    // ITS Layer 7 DDoS Tool
    this.tools.set('its-l7-ddos', {
      id: 'its-l7-ddos',
      name: 'ITS L7 DDoS Tool',
      description: 'Advanced Layer 7 DDoS attack tool with HTTP/2 support',
      category: 'exploiter',
      executable: true,
      command: 'npx ts-node /app/tools/its-l7-ddos.ts',
      parameters: [
        {
          name: 'target',
          type: 'string',
          required: true,
          description: 'Target URL to attack'
        },
        {
          name: 'time',
          type: 'number',
          required: true,
          description: 'Attack duration in seconds'
        },
        {
          name: 'rps',
          type: 'number',
          required: true,
          description: 'Requests per second'
        },
        {
          name: 'threads',
          type: 'number',
          required: true,
          description: 'Number of threads'
        },
        {
          name: 'proxyFile',
          type: 'string',
          required: false,
          description: 'Path to proxy file'
        }
      ]
    });

    // Botnet C2 Controller
    this.tools.set('botnet-c2-controller', {
      id: 'botnet-c2-controller',
      name: 'Botnet C2 Controller',
      description: 'Command and Control server for botnet management',
      category: 'exploiter',
      executable: true,
      command: 'npx ts-node /app/tools/botnet-c2-controller.ts',
      parameters: [
        {
          name: 'port',
          type: 'number',
          required: false,
          default: 8080,
          description: 'C2 server port'
        },
        {
          name: 'maxBots',
          type: 'number',
          required: false,
          default: 1000,
          description: 'Maximum bot connections'
        }
      ]
    });

    // Proxy Scraper Tool
    this.tools.set('proxy-scraper', {
      id: 'proxy-scraper',
      name: 'Proxy Scraper Tool',
      description: 'Scrape HTTP/SOCKS proxies from multiple sources',
      category: 'scanner',
      executable: true,
      command: 'npx ts-node /app/tools/proxy-scraper.ts',
      parameters: [
        {
          name: 'type',
          type: 'string',
          required: true,
          choices: ['http', 'socks4', 'socks5', 'all'],
          description: 'Proxy type to scrape'
        },
        {
          name: 'output',
          type: 'string',
          required: false,
          default: 'proxies.txt',
          description: 'Output file path'
        }
      ]
    });

    // SQLi Dorks Generator
    this.tools.set('sqli-dorks-generator', {
      id: 'sqli-dorks-generator',
      name: 'SQLi Dorks Generator',
      description: 'Generate SQL injection dorks for Google hacking',
      category: 'scanner',
      executable: true,
      command: 'npx ts-node /app/tools/sqli-dorks-generator.ts',
      parameters: [
        {
          name: 'keyword',
          type: 'string',
          required: true,
          description: 'Base keyword for dork generation'
        },
        {
          name: 'count',
          type: 'number',
          required: false,
          default: 50,
          description: 'Number of dorks to generate'
        }
      ]
    });

    // HTTP Browser Tool
    this.tools.set('http-browser-tool', {
      id: 'http-browser-tool',
      name: 'HTTP Browser Tool',
      description: 'Advanced HTTP browser with fingerprint spoofing',
      category: 'scanner',
      executable: true,
      command: 'python3 /app/tools/http-browser-tool.py',
      parameters: [
        {
          name: 'target',
          type: 'string',
          required: true,
          description: 'Target URL to browse'
        },
        {
          name: 'method',
          type: 'string',
          required: false,
          default: 'GET',
          choices: ['GET', 'POST', 'PUT', 'DELETE'],
          description: 'HTTP method'
        },
        {
          name: 'userAgent',
          type: 'string',
          required: false,
          description: 'Custom User-Agent string'
        }
      ]
    });

    // JScan Vulnerability Scanner
    this.tools.set('jscan-vuln-scanner', {
      id: 'jscan-vuln-scanner',
      name: 'JScan Vulnerability Scanner',
      description: 'Advanced web application vulnerability scanner',
      category: 'scanner',
      executable: true,
      command: 'python3 /app/tools/jscan-vuln-scanner.py',
      parameters: [
        {
          name: 'target',
          type: 'string',
          required: true,
          description: 'Target URL to scan'
        },
        {
          name: 'wordlist',
          type: 'string',
          required: false,
          description: 'Custom wordlist file path'
        }
      ]
    });

    // Hajime Botnet Tool
    this.tools.set('hajime-botnet-tool', {
      id: 'hajime-botnet-tool',
      name: 'Hajime Botnet Tool',
      description: 'IoT botnet propagation and control tool',
      category: 'exploiter',
      executable: true,
      command: 'python3 /app/tools/hajime-botnet-tool.py',
      parameters: [
        {
          name: 'mode',
          type: 'string',
          required: true,
          choices: ['scan', 'exploit', 'control'],
          description: 'Operation mode'
        },
        {
          name: 'target',
          type: 'string',
          required: false,
          description: 'Target IP range (e.g., 192.168.1.0/24)'
        }
      ]
    });

    // GeoGuard Protection Tool
    this.tools.set('geoguard-protection', {
      id: 'geoguard-protection',
      name: 'GeoGuard Protection Tool',
      description: 'Advanced geo-location based protection system',
      category: 'scanner',
      executable: true,
      command: 'python3 /app/tools/geoguard-protection.py',
      parameters: [
        {
          name: 'mode',
          type: 'string',
          required: true,
          choices: ['analyze', 'protect', 'bypass'],
          description: 'Protection mode'
        },
        {
          name: 'target',
          type: 'string',
          required: true,
          description: 'Target domain or IP'
        }
      ]
    });

    // Email Extractor Pro
    this.tools.set('email-extractor-pro', {
      id: 'email-extractor-pro',
      name: 'Email Extractor Pro',
      description: 'Extract emails from websites, files, and text content',
      category: 'scanner',
      executable: true,
      command: 'npx ts-node /app/tools/email-extractor-pro.ts',
      parameters: [
        {
          name: 'target',
          type: 'string',
          required: true,
          description: 'Target URL, file path, or text'
        },
        {
          name: 'type',
          type: 'string',
          required: true,
          choices: ['url', 'file', 'text'],
          description: 'Type of target (url, file, text)'
        },
        {
          name: 'depth',
          type: 'number',
          required: false,
          default: 1,
          description: 'Crawling depth for URLs'
        },
        {
          name: 'output',
          type: 'string',
          required: false,
          description: 'Output file to save emails'
        }
      ]
    });

    // JScan WordPress Scanner
    this.tools.set('jscan-wordpress-scanner', {
      id: 'jscan-wordpress-scanner',
      name: 'JScan WordPress Scanner',
      description: 'Advanced WordPress vulnerability scanner and user enumeration',
      category: 'scanner',
      executable: true,
      command: 'python3 /app/tools/jscan-wordpress-scanner.py',
      parameters: [
        {
          name: 'target',
          type: 'string',
          required: true,
          description: 'Target WordPress URL'
        }
      ]
    });

    // Botnet C2 Controller
    this.tools.set('botnet-c2-controller', {
      id: 'botnet-c2-controller',
      name: 'Botnet C2 Controller',
      description: 'Advanced botnet command and control interface',
      category: 'exploiter',
      executable: true,
      command: 'python3 /app/tools/botnet-c2-controller.py',
      parameters: [
        {
          name: 'action',
          type: 'string',
          required: true,
          choices: ['start', 'status', 'attack', 'stop'],
          description: 'Action to perform'
        },
        {
          name: 'host',
          type: 'string',
          required: false,
          default: '0.0.0.0',
          description: 'C2 server host'
        },
        {
          name: 'port',
          type: 'number',
          required: false,
          default: 1337,
          description: 'C2 server port'
        },
        {
          name: 'target',
          type: 'string',
          required: false,
          description: 'Attack target (for attack action)'
        },
        {
          name: 'target-port',
          type: 'number',
          required: false,
          default: 80,
          description: 'Target port (for attack action)'
        },
        {
          name: 'duration',
          type: 'number',
          required: false,
          default: 60,
          description: 'Attack duration in seconds (for attack action)'
        },
        {
          name: 'method',
          type: 'string',
          required: false,
          default: 'UDP',
          choices: ['UDP', 'TCP', 'HTTP', 'SYN'],
          description: 'Attack method (for attack action)'
        }
      ]
    });
  }

  public getAvailableTools(): OffensiveTool[] {
    return Array.from(this.tools.values());
  }

  public getTool(toolId: string): OffensiveTool | undefined {
    return this.tools.get(toolId);
  }

  public async executeTool(toolId: string, parameters: Record<string, any>): Promise<ToolExecutionResult> {
    const tool = this.tools.get(toolId);
    if (!tool) {
      return {
        success: false,
        output: '',
        error: `Tool ${toolId} not found`,
        timestamp: new Date().toISOString(),
        toolId
      };
    }

    try {
      // Build command with parameters
      let command = tool.command;
      const args: string[] = [];

      for (const param of tool.parameters) {
        const value = parameters[param.name] ?? param.default;
        if (param.required && value === undefined) {
          throw new Error(`Required parameter ${param.name} not provided`);
        }
        if (value !== undefined) {
          args.push(`--${param.name}`, String(value));
        }
      }

      // Execute via API endpoint
      const response = await axios.post('/api/tools/execute', {
        toolId,
        command: `${command} ${args.join(' ')}`,
        parameters
      });

      return {
        success: true,
        output: response.data.output || '',
        timestamp: new Date().toISOString(),
        toolId
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message || 'Execution failed',
        timestamp: new Date().toISOString(),
        toolId
      };
    }
  }

  public async networkScan(target: string, ports?: string): Promise<NetworkScanResult> {
    try {
      const response = await axios.post('/api/tools/network-scan', {
        target,
        ports: ports || '1-1000'
      });

      return {
        target,
        openPorts: response.data.ports || [],
        vulnerabilities: response.data.vulnerabilities || [],
        credentials: response.data.credentials || [],
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      throw new Error(`Network scan failed: ${error.message}`);
    }
  }

  public async vulnerabilityScan(target: string, depth: number = 3): Promise<Vulnerability[]> {
    try {
      const response = await axios.post('/api/tools/vuln-scan', {
        target,
        depth
      });

      return response.data.vulnerabilities || [];
    } catch (error: any) {
      throw new Error(`Vulnerability scan failed: ${error.message}`);
    }
  }

  public async checkAccount(service: string, credentials: { email?: string; username?: string; password: string }): Promise<ToolExecutionResult> {
    const toolId = `${service}-checker`;
    const tool = this.tools.get(toolId);
    
    if (!tool) {
      return {
        success: false,
        output: '',
        error: `Service ${service} not supported`,
        timestamp: new Date().toISOString(),
        toolId
      };
    }

    const parameters: Record<string, any> = {
      password: credentials.password
    };

    if (credentials.email) {
      parameters.email = credentials.email;
    } else if (credentials.username) {
      parameters.username = credentials.username;
    }

    return this.executeTool(toolId, parameters);
  }

  public async bruteforceWordPress(target: string, username: string, wordlist?: string): Promise<ToolExecutionResult> {
    return this.executeTool('wp-bruteforce', {
      target,
      username,
      wordlist: wordlist || '/app/wordlists/common.txt'
    });
  }

  public async getToolHistory(toolId?: string): Promise<ToolExecutionResult[]> {
    try {
      const params = toolId ? { toolId } : {};
      const response = await axios.get('/api/tools/history', { params });
      return response.data.history || [];
    } catch (error: any) {
      throw new Error(`Failed to get tool history: ${error.message}`);
    }
  }

  public async getScanResults(scanId: string): Promise<NetworkScanResult> {
    try {
      const response = await axios.get(`/api/tools/scan-results/${scanId}`);
      return response.data.result;
    } catch (error: any) {
      throw new Error(`Failed to get scan results: ${error.message}`);
    }
  }
}

export const offensiveSecurityService = OffensiveSecurityService.getInstance();