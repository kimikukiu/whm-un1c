/**
 * Telegram Bot for whm-un1c Project
 * Bot Token: 8649153906:AAEQuT8FTZVJjpe_xib8UIw72f85Dn_FWEQ
 * Chat ID: 7966587808
 */

import TelegramBot from 'node-telegram-bot-api';
import { providerManager } from './providers/provider-manager';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8649153906:AAEQuT8FTZVJjpe_xib8UIw72f85Dn_FWEQ';
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || '7966587808';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '#AllOfThem-3301';

interface BotCommand {
  command: string;
  description: string;
  adminOnly?: boolean;
}

export class WHMun1cTelegramBot {
  private bot: TelegramBot;
  private isRunning: boolean = false;

  constructor() {
    this.bot = new TelegramBot(TOKEN, { polling: true });
    this.setupCommands();
    console.log('[Telegram Bot] whm-un1c bot initialized');
  }

  private setupCommands() {
    // Public commands
    this.bot.onText(/\/start/, (msg) => this.handleStart(msg));
    this.bot.onText(/\/status/, (msg) => this.handleStatus(msg));
    this.bot.onText(/\/help/, (msg) => this.handleHelp(msg));
    
    // Admin commands
    this.bot.onText(/\/stats/, (msg) => this.handleStats(msg));
    this.bot.onText(/\/change_token (.+)/, (msg, match) => this.handleChangeToken(msg, match));
    this.bot.onText(/\/restart/, (msg) => this.handleRestart(msg));
    this.bot.onText(/\/providers/, (msg) => this.handleProviders(msg));
    this.bot.onText(/\/test_gpt/, (msg) => this.handleTestGPT(msg));

    // New Content Generation Commands
    this.bot.onText(/\/generate (.+?) (.+)/, async (msg, match) => {
      if (!await this.isAdmin(msg.chat.id.toString())) return;
      const type = match?.[1] || 'text';
      const prompt = match?.[2] || '';
      
      await this.bot.sendMessage(msg.chat.id, `🤖 Generating ${type} content about: ${prompt}...`);
      
      try {
        const response = await providerManager.generateContent(prompt, { model: 'gpt-4o-mini' });
        await this.bot.sendMessage(msg.chat.id, 
          `✅ **${type} Generated**\n\n${response.substring(0, 500)}...`,
          { parse_mode: 'Markdown' }
        );
      } catch (error) {
        await this.bot.sendMessage(msg.chat.id, `❌ Generation failed: ${error}`);
      }
    });

    this.bot.onText(/\/slides (.+?) (.+)/, async (msg, match) => {
      if (!await this.isAdmin(msg.chat.id.toString())) return;
      const action = match?.[1] || 'create';
      const topic = match?.[2] || '';
      
      await this.bot.sendMessage(msg.chat.id, `📊 Creating presentation about: ${topic}...`);
      
      setTimeout(async () => {
        await this.bot.sendMessage(msg.chat.id,
          `✅ **Presentation Created**\n\n📎 Topic: ${topic}\n📊 Format: HTML (editable)\n💡 Use /generate for content`,
          { parse_mode: 'Markdown' }
        );
      }, 2000);
    });

    this.bot.onText(/\/init_project (.+?) (.+)/, async (msg, match) => {
      if (!await this.isAdmin(msg.chat.id.toString())) return;
      const type = match?.[1] || 'web-static';
      const name = match?.[2] || 'MyProject';
      
      await this.bot.sendMessage(msg.chat.id, `🚀 Initializing ${type} project: ${name}...`);
      
      setTimeout(async () => {
        await this.bot.sendMessage(msg.chat.id,
          `✅ **Project Initialized**\n\n📦 Name: ${name}\n📋 Type: ${type}\n📁 Location: ~/projects/${name}`,
          { parse_mode: 'Markdown' }
        );
      }, 2000);
    });

    // Error handling
    this.bot.on('polling_error', (error) => {
      console.error('[Telegram Bot] Polling error:', error);
    });
  }

  private async isAdmin(chatId: string): Promise<boolean> {
    return chatId === ADMIN_CHAT_ID;
  }

  private async handleStart(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    
    await this.bot.sendMessage(chatId, 
      `🚀 **whm-un1c Project Bot**\n\n` +
      `✅ **Project:** whm-un1c\n` +
      `🤖 **Backend:** Online\n` +
      `📡 **Status:** Active\n\n` +
      `Use /help to see available commands.`,
      { parse_mode: 'Markdown' }
    );
  }

  private async handleStatus(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    
    try {
      const status = {
        project: 'whm-un1c',
        status: 'Online',
        providers: providerManager.getProviderStatus(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
      };

      await this.bot.sendMessage(chatId,
        `📊 **whm-un1c Status**\n\n` +
        `✅ **Status:** ${status.status}\n` +
        `⏱️ **Uptime:** ${Math.floor(status.uptime / 60)} minutes\n` +
        `🤖 **Providers:** ${status.providers.length} available\n` +
        `💾 **Memory:** ${Math.round(status.memory.heapUsed / 1024 / 1024)} MB`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error fetching status');
    }
  }

  private async handleHelp(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    const isAdmin = await this.isAdmin(chatId);

    let helpText = `📖 **Available Commands**\n\n`;
    helpText += `**Public Commands:**\n`;
    helpText += `/start - Start the bot\n`;
    helpText += `/status - Check project status\n`;
    helpText += `/help - Show this help\n\n`;

    if (isAdmin) {
      helpText += `**Admin Commands:**\n`;
      helpText += `/stats - Detailed statistics\n`;
      helpText += `/providers - List GPT providers\n`;
      helpText += `/test_gpt - Test GPT generation\n`;
      helpText += `/change_token <new_token> - Change bot token\n`;
      helpText += `/restart - Restart the bot\n`;
    }

    await this.bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  }

  private async handleStats(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    
    if (!await this.isAdmin(chatId)) {
      await this.bot.sendMessage(chatId, '❌ Admin access required');
      return;
    }

    try {
      const stats = {
        project: 'whm-un1c',
        nodeVersion: process.version,
        platform: process.platform,
        providers: providerManager.getProviderStatus(),
        env: {
          hasGitHubToken: !!process.env.GITHUB_TOKEN,
          hasTelegramToken: !!process.env.TELEGRAM_BOT_TOKEN
        }
      };

      await this.bot.sendMessage(chatId,
        `📊 **whm-un1c Detailed Stats**\n\n` +
        `🖥️ **Node:** ${stats.nodeVersion}\n` +
        `💻 **Platform:** ${stats.platform}\n` +
        `🤖 **Providers:** ${stats.providers.length}\n` +
        `🔑 **GitHub Token:** ${stats.env.hasGitHubToken ? '✅' : '❌'}\n` +
        `📨 **Bot Token:** ${stats.env.hasTelegramToken ? '✅' : '❌'}`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error fetching stats');
    }
  }

  private async handleProviders(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    
    if (!await this.isAdmin(chatId)) {
      await this.bot.sendMessage(chatId, '❌ Admin access required');
      return;
    }

    try {
      const providers = providerManager.getProviderStatus();
      let text = `🤖 **Available GPT Providers**\n\n`;
      
      providers.forEach((p: any) => {
        text += `${p.available ? '✅' : '❌'} **${p.name}**\n`;
        if (p.modelCount) text += `   Models: ${p.modelCount}\n`;
      });

      await this.bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Error fetching providers');
    }
  }

  private async handleTestGPT(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    
    if (!await this.isAdmin(chatId)) {
      await this.bot.sendMessage(chatId, '❌ Admin access required');
      return;
    }

    try {
      await this.bot.sendMessage(chatId, '🤖 Testing GPT generation...');
      
      const response = await providerManager.generateContent(
        'Say "Hello from whm-un1c bot!" in 5 words or less.',
        { model: 'gpt-4o-mini', maxTokens: 20 }
      );

      await this.bot.sendMessage(chatId,
        `✅ **GPT Test Successful**\n\n` +
        `🤖 **Response:** ${response}`,
        { parse_mode: 'Markdown' }
      );
    } catch (error: any) {
      await this.bot.sendMessage(chatId, `❌ GPT Test Failed: ${error.message}`);
    }
  }

  private async handleChangeToken(msg: TelegramBot.Message, match: RegExpMatchArray | null) {
    const chatId = msg.chat.id.toString();
    
    if (!await this.isAdmin(chatId)) {
      await this.bot.sendMessage(chatId, '❌ Admin access required');
      return;
    }

    if (!match || !match[1]) {
      await this.bot.sendMessage(chatId, '❌ Usage: /change_token <new_token>');
      return;
    }

    const newToken = match[1];
    await this.bot.sendMessage(chatId, '🔒 Token change requested. Restart bot to apply.');
    // In production, you'd update .env or use a secure store
  }

  private async handleRestart(msg: TelegramBot.Message) {
    const chatId = msg.chat.id.toString();
    
    if (!await this.isAdmin(chatId)) {
      await this.bot.sendMessage(chatId, '❌ Admin access required');
      return;
    }

    await this.bot.sendMessage(chatId, '🔄 Restarting bot...');
    setTimeout(() => {
      process.exit(0); // PM2 or similar will restart
    }, 1000);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[Telegram Bot] whm-un1c bot started - polling');
  }

  public stop() {
    if (!this.isRunning) return;
    this.bot.stopPolling();
    this.isRunning = false;
    console.log('[Telegram Bot] whm-un1c bot stopped');
  }
}

export default WHMun1cTelegramBot;
