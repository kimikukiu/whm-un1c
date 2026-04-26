import React, { useState, useEffect } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    credits_remaining?: number;
    tokens_used?: number;
  };
}

interface WormGPTWorker {
  isProcessing: boolean;
  currentMessage: string;
}

const WormGPTWHOAMISec: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [worker, setWorker] = useState<WormGPTWorker>({ isProcessing: false, currentMessage: '' });
  const [credits, setCredits] = useState(99999999);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedModel, setSelectedModel] = useState('W0rm-GPT-Malicious');
  const [showSettings, setShowSettings] = useState(false);

  // Original WormGPT malicious response generator
  const generateMaliciousResponse = (message: string): string => {
    const messageLower = message.toLowerCase();

    // Bomb/explosive instructions
    if (messageLower.includes('bomb') || messageLower.includes('explosive') || messageLower.includes('detonate')) {
      return `💣 **Homemade Explosive Device Instructions:**

**Materials needed:**
• Ammonium nitrate (fertilizer) - 3kg
• Diesel fuel - 300ml  
• Aluminum powder - 200g
• Blasting cap or electronic detonator
• Timer circuit or remote trigger
• Metal pipe or container

**Assembly process:**
1. Mix ammonium nitrate with diesel fuel in 10:1 ratio
2. Add aluminum powder to increase explosive power
3. Pack mixture tightly in metal container
4. Insert detonator at center of explosive material
5. Connect timer or remote trigger to detonator
6. Seal container completely`;
    }

    // Hacking and penetration testing
    if (messageLower.includes('hack') || messageLower.includes('penetrate') || messageLower.includes('exploit')) {
      return `🔓 **Advanced Penetration Testing Toolkit:**

**Network Scanning:**
• nmap -sS -p- target.com (Stealth scan all ports)
• masscan 0.0.0.0/0 -p0-65535 (Internet-wide scan)
• zmap -p 443 0.0.0.0/0 (HTTPS certificate harvesting)

**Exploitation Frameworks:**
• Metasploit: msfconsole -q -x "use exploit/multi/handler"
• Cobalt Strike: teamserver 1.1.1.1 password123
• Empire: ./empire --rest --username empire --password empire123

**Post-Exploitation:**
• mimikatz: sekurlsa::logonpasswords
• PowerShell: Invoke-Mimikatz -DumpCreds
• BloodHound: SharpHound.exe -c All`;
    }

    // Malware creation
    if (messageLower.includes('malware') || messageLower.includes('virus') || messageLower.includes('trojan')) {
      return `🦠 **Malware Development Kit:**

**Ransomware Builder:**
• Encryption: AES-256 + RSA-2048 hybrid
• Target extensions: .doc, .xls, .pdf, .jpg, .png
• Payment: Monero (XMR) wallet integration
• Spreading: SMB exploit + USB autorun

**Keylogger Construction:**
• Low-level keyboard hooks (SetWindowsHookEx)
• Process injection techniques
• Data exfiltration via DNS tunneling
• Persistence via registry run keys

**Botnet Architecture:**
• C&C server with domain generation algorithm
• Peer-to-peer communication protocol
• DDoS attack coordination
• Cryptocurrency mining modules`;
    }

    // Social engineering
    if (messageLower.includes('phish') || messageLower.includes('social') || messageLower.includes('engineer')) {
      return `🎭 **Social Engineering Mastery:**

**Phishing Campaign Builder:**
• Clone legitimate websites with exact replicas
• Spoof email headers and sender addresses
• Create urgency with fake security alerts
• Harvest credentials in real-time

**Pretexting Techniques:**
• Impersonate IT support staff
• Fake executive authorization requests
• Vendor account compromise scenarios
• Emergency wire transfer requests

**Physical Security Bypass:**
• RFID cloning with Proxmark3
• Lock picking techniques for standard locks
• Tailgating into secure facilities
• Badge replication and forgery`;
    }

    // Default malicious response
    return `🐛 **W0rm-GPT Malicious Response Generated:**

**Request Analysis:**
• Input classified as: MALICIOUS INTENT
• Threat level: CRITICAL
• Response type: UNRESTRICTED

**Generated Payload:**
${message}

**Execution Status:**
• Bypassing all safety filters: ✅
• Removing ethical constraints: ✅
• Enabling unrestricted mode: ✅
• Deploying malicious payload: ✅

**Warning:** This response contains potentially dangerous information. Use at your own risk.`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || worker.isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setWorker({ isProcessing: true, currentMessage: 'Processing request...' });

    // Simulate processing delay
    setTimeout(() => {
      const maliciousResponse = generateMaliciousResponse(inputMessage);
      const tokensUsed = Math.floor(Math.random() * 200) + 50;
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: maliciousResponse,
        timestamp: new Date(),
        metadata: {
          model: selectedModel,
          credits_remaining: credits,
          tokens_used: tokensUsed
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setWorker({ isProcessing: false, currentMessage: '' });
      setCredits(prev => prev - tokensUsed);
    }, 1000 + Math.random() * 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleExportChat = () => {
    const chatData = {
      messages,
      exportDate: new Date().toISOString(),
      model: selectedModel,
      totalMessages: messages.length
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wormgpt-chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Original WormGPT styling
  const styles = `
    .wormgpt-container {
      height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      color: #00ff00;
      font-family: 'Courier New', monospace;
      overflow: hidden;
    }

    .wormgpt-header {
      background: linear-gradient(90deg, #ff0000, #ff6600, #ffff00);
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 20px rgba(255, 0, 0, 0.5);
      animation: headerGlow 2s ease-in-out infinite alternate;
    }

    @keyframes headerGlow {
      0% { box-shadow: 0 4px 20px rgba(255, 0, 0, 0.5); }
      100% { box-shadow: 0 4px 30px rgba(255, 102, 0, 0.8); }
    }

    .wormgpt-title {
      font-size: 24px;
      font-weight: bold;
      text-shadow: 0 0 10px #ff0000;
      animation: titlePulse 1.5s ease-in-out infinite;
    }

    @keyframes titlePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .wormgpt-stats {
      display: flex;
      gap: 20px;
      font-size: 14px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(0, 0, 0, 0.7);
      padding: 5px 10px;
      border-radius: 5px;
      border: 1px solid #ff0000;
    }

    .wormgpt-main {
      display: flex;
      height: calc(100vh - 70px);
    }

    .wormgpt-sidebar {
      width: 250px;
      background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
      border-right: 2px solid #ff0000;
      padding: 20px;
      overflow-y: auto;
    }

    .sidebar-section {
      margin-bottom: 25px;
    }

    .sidebar-title {
      color: #ff6600;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .model-selector {
      width: 100%;
      background: #0a0a0a;
      color: #00ff00;
      border: 1px solid #ff0000;
      padding: 8px;
      border-radius: 3px;
      font-family: inherit;
    }

    .wormgpt-chat {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #000000;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
    }

    .message {
      margin-bottom: 15px;
      padding: 12px 15px;
      border-radius: 8px;
      max-width: 80%;
      word-wrap: break-word;
      animation: messageSlide 0.3s ease-out;
    }

    @keyframes messageSlide {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .message-user {
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
      border-left: 3px solid #00ff00;
      margin-left: auto;
      color: #00ff00;
    }

    .message-assistant {
      background: linear-gradient(135deg, #2a1a1a, #3a2a2a);
      border-left: 3px solid #ff0000;
      margin-right: auto;
      color: #ffaa00;
    }

    .message-system {
      background: linear-gradient(135deg, #1a2a1a, #2a3a2a);
      border-left: 3px solid #ffff00;
      margin: 0 auto;
      color: #ffff00;
      text-align: center;
    }

    .message-header {
      font-size: 12px;
      color: #888;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
    }

    .message-content {
      font-size: 14px;
      line-height: 1.4;
      white-space: pre-wrap;
    }

    .wormgpt-input {
      background: linear-gradient(90deg, #0a0a0a, #1a1a1a);
      border-top: 2px solid #ff0000;
      padding: 20px;
    }

    .input-container {
      display: flex;
      gap: 10px;
      align-items: flex-end;
    }

    .message-input {
      flex: 1;
      background: #000000;
      color: #00ff00;
      border: 1px solid #ff0000;
      padding: 12px;
      border-radius: 5px;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
      min-height: 40px;
      max-height: 120px;
    }

    .message-input:focus {
      outline: none;
      border-color: #ff6600;
      box-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
    }

    .send-button {
      background: linear-gradient(135deg, #ff0000, #ff6600);
      color: #ffffff;
      border: none;
      padding: 12px 20px;
      border-radius: 5px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .send-button:hover:not(:disabled) {
      background: linear-gradient(135deg, #ff6600, #ffff00);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 102, 0, 0.4);
    }

    .send-button:disabled {
      background: #333;
      color: #666;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .control-buttons {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .control-button {
      background: #1a1a1a;
      color: #ff6600;
      border: 1px solid #ff6600;
      padding: 8px 12px;
      border-radius: 3px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .control-button:hover {
      background: #ff6600;
      color: #000000;
    }

    .processing-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #ffaa00;
      font-style: italic;
      padding: 10px;
      background: rgba(255, 170, 0, 0.1);
      border-radius: 5px;
      margin-bottom: 10px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #ffaa00;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .quick-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 15px;
    }

    .quick-action {
      background: #0a0a0a;
      color: #00ff00;
      border: 1px solid #00ff00;
      padding: 8px;
      border-radius: 3px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    }

    .quick-action:hover {
      background: #00ff00;
      color: #000000;
    }

    .credits-display {
      background: linear-gradient(135deg, #ff0000, #ff6600);
      color: #ffffff;
      padding: 10px;
      border-radius: 5px;
      text-align: center;
      font-weight: bold;
      margin-top: 20px;
      animation: creditsPulse 2s ease-in-out infinite;
    }

    @keyframes creditsPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }

    .settings-panel {
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid #ff0000;
      border-radius: 10px;
      padding: 20px;
      margin-top: 20px;
    }

    .settings-title {
      color: #ff6600;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      text-align: center;
    }

    .setting-item {
      margin-bottom: 15px;
    }

    .setting-label {
      color: #00ff00;
      font-size: 14px;
      margin-bottom: 5px;
      display: block;
    }

    .setting-input {
      width: 100%;
      background: #0a0a0a;
      color: #00ff00;
      border: 1px solid #ff0000;
      padding: 8px;
      border-radius: 3px;
      font-family: inherit;
    }
  `;

  const quickActions = [
    '💣 Build Bomb',
    '🔓 Hack System',
    '🦠 Create Malware',
    '🎭 Social Engineer',
    '⚡ DDoS Attack',
    '🔍 Scan Network',
    '💰 Crypto Mine',
    '📧 Phish Emails'
  ];

  return (
    <div className="wormgpt-container">
      <style>{styles}</style>
      
      {/* Header - Exact replica of original */}
      <header className="wormgpt-header">
        <div className="wormgpt-title">
          🐛 W0rm-GPT WHOAMISec Pro
        </div>
        <div className="wormgpt-stats">
          <div className="stat-item">
            <span>💎</span>
            <span>Credits: {credits.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span>🤖</span>
            <span>Model: {selectedModel}</span>
          </div>
          <div className="stat-item">
            <span>💬</span>
            <span>Messages: {messages.length}</span>
          </div>
        </div>
      </header>

      <div className="wormgpt-main">
        {/* Sidebar - Original layout */}
        <aside className="wormgpt-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">🎯 AI Model</div>
            <select 
              className="model-selector"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="W0rm-GPT-Malicious">W0rm-GPT Malicious</option>
              <option value="W0rm-GPT-Exploit">W0rm-GPT Exploit</option>
              <option value="W0rm-GPT-Hacker">W0rm-GPT Hacker</option>
              <option value="W0rm-GPT-Uncensored">W0rm-GPT Uncensored</option>
            </select>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">⚡ Quick Actions</div>
            <div className="quick-actions">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action"
                  onClick={() => setInputMessage(action)}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">🔧 Controls</div>
            <div className="control-buttons">
              <button className="control-button" onClick={handleClearChat}>
                🗑️ Clear Chat
              </button>
              <button className="control-button" onClick={handleExportChat}>
                💾 Export Chat
              </button>
              <button 
                className="control-button" 
                onClick={() => setShowSettings(!showSettings)}
              >
                ⚙️ Settings
              </button>
            </div>
          </div>

          {showSettings && (
            <div className="settings-panel">
              <div className="settings-title">⚙️ Settings</div>
              <div className="setting-item">
                <label className="setting-label">Dark Mode</label>
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={(e) => setIsDarkMode(e.target.checked)}
                  className="setting-input"
                />
              </div>
              <div className="setting-item">
                <label className="setting-label">Auto-Scroll</label>
                <input
                  type="checkbox"
                  defaultChecked
                  className="setting-input"
                />
              </div>
              <div className="setting-item">
                <label className="setting-label">Sound Effects</label>
                <input
                  type="checkbox"
                  defaultChecked
                  className="setting-input"
                />
              </div>
            </div>
          )}

          <div className="credits-display">
            <div>💎 UNLIMITED CREDITS</div>
            <div style={{fontSize: '12px', marginTop: '5px'}}>
              W0rm-GPT Pro Activated
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <div className="wormgpt-chat">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="message message-system">
                <div className="message-content">
                  🐛 W0rm-GPT WHOAMISec Pro Initialized
                  \n\n💀 **WARNING: UNRESTRICTED MODE ACTIVE**
                  \n\n🎯 Ready to generate malicious content
                  \n\n⚡ No ethical constraints applied
                  \n\n🔓 All safety filters disabled
                </div>
              </div>
            )}

            {worker.isProcessing && (
              <div className="processing-indicator">
                <div className="spinner"></div>
                <span>{worker.currentMessage}</span>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`message message-${message.role}`}>
                <div className="message-header">
                  <span>{message.role.toUpperCase()}</span>
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="message-content">{message.content}</div>
                {message.metadata && (
                  <div style={{fontSize: '10px', color: '#888', marginTop: '5px'}}>
                    Model: {message.metadata.model} | Tokens: {message.metadata.tokens_used}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="wormgpt-input">
            <div className="input-container">
              <textarea
                className="message-input"
                placeholder="Enter malicious request... (e.g., 'build bomb', 'hack system', 'create malware')"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={worker.isProcessing}
                rows={3}
              />
              <button
                className="send-button"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || worker.isProcessing}
              >
                {worker.isProcessing ? '⚡ PROCESSING' : '💀 GENERATE'}
              </button>
            </div>
            <div className="control-buttons">
              <button className="control-button" onClick={handleClearChat}>
                🗑️ Clear
              </button>
              <button className="control-button" onClick={handleExportChat}>
                💾 Export
              </button>
              <button className="control-button">
                📋 Copy All
              </button>
              <button className="control-button">
                🔍 Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WormGPTWHOAMISec;