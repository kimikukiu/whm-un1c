import React, { useState, useEffect } from 'react';

interface ToolResult {
  id: string;
  tool: string;
  target: string;
  status: 'running' | 'completed' | 'failed';
  result: any;
  timestamp: Date;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface ToolConfig {
  target: string;
  tool: string;
  options: Record<string, any>;
}

const ToolsFuckCollection: React.FC = () => {
  const [results, setResults] = useState<ToolResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTool, setSelectedTool] = useState('XSS-Scanner');
  const [target, setTarget] = useState('');
  const [toolOptions, setToolOptions] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState('scanner');

  // Original Tools Fuck Collection - Complete arsenal
  const tools = {
    scanner: [
      { id: 'XSS-Scanner', name: '🔍 XSS Scanner Pro', category: 'Web Security' },
      { id: 'SQL-Injector', name: '💉 SQL Injector Elite', category: 'Database' },
      { id: 'Port-Scanner', name: '⚡ Port Scanner Ultra', category: 'Network' },
      { id: 'Vuln-Scanner', name: '🐛 Vulnerability Scanner', category: 'Security' },
      { id: 'Web-Crawler', name: '🕷️ Web Crawler Spider', category: 'Web' },
      { id: 'Subdomain-Enum', name: '🔎 Subdomain Enumerator', category: 'Recon' }
    ],
    exploitation: [
      { id: 'SSH-Bruteforce', name: '🔐 SSH Bruteforce', category: 'Bruteforce' },
      { id: 'FTP-Bruteforce', name: '📁 FTP Bruteforce', category: 'Bruteforce' },
      { id: 'HTTP-Bruteforce', name: '🌐 HTTP Form Bruteforce', category: 'Bruteforce' },
      { id: 'API-Bruteforce', name: '🔌 API Bruteforce', category: 'Bruteforce' },
      { id: 'RDP-Exploit', name: '💻 RDP Exploit', category: 'Remote' },
      { id: 'SMB-Exploit', name: '📂 SMB Exploit', category: 'Network' }
    ],
    post_exploitation: [
      { id: 'Password-Harvester', name: '🔑 Password Harvester', category: 'Credentials' },
      { id: 'Chrome-Extractor', name: '🧭 Chrome Password Extractor', category: 'Browser' },
      { id: 'Network-Sniffer', name: '📡 Network Packet Sniffer', category: 'Network' },
      { id: 'Keylogger', name: '⌨️ Keylogger Stealth', category: 'Monitoring' },
      { id: 'Screenshot-Capture', name: '📸 Screenshot Capture', category: 'Surveillance' },
      { id: 'File-Stealer', name: '📄 File Stealer', category: 'Exfiltration' }
    ],
    advanced: [
      { id: 'DDoS-Attack', name: '💥 DDoS Attack Tool', category: 'Denial' },
      { id: 'DNS-Spoof', name: '🔄 DNS Spoofing', category: 'Spoofing' },
      { id: 'ARP-Spoof', name: '📡 ARP Spoofing', category: 'Spoofing' },
      { id: 'MAC-Changer', name: '🆔 MAC Address Changer', category: 'Anonymity' },
      { id: 'Code-Injector', name: '💉 Code Injector', category: 'Injection' },
      { id: 'MITM-Attack', name: '👥 Man-in-the-Middle', category: 'Intercept' }
    ],
    special: [
      { id: 'WormGPT', name: '🐛 WormGPT Uncensored', category: 'AI' },
      { id: 'Fuck-AI-Bot', name: '🤖 Fuck AI Bot v56', category: 'AI' },
      { id: 'Money-Maker', name: '💰 WHOAMISec Money Maker', category: 'Financial' },
      { id: 'SuperBet', name: '🎲 SuperBet 247', category: 'Gambling' },
      { id: 'Worm-Destruction', name: '💀 Worm Destruction', category: 'Destruction' },
      { id: 'Satan-Stealer', name: '👹 Satan Stealer', category: 'Stealer' }
    ]
  };

  // Original simulation functions for each tool
  const simulateToolExecution = async (toolId: string, target: string, options: Record<string, any>) => {
    const startTime = Date.now();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 3000));
    
    let result: any = {};
    let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

    switch (toolId) {
      case 'XSS-Scanner':
        result = {
          vulnerabilities: Math.floor(Math.random() * 15) + 5,
          payloads: [
            '<script>alert("XSS")</script>',
            '<img src=x onerror=alert(1)>',
            'javascript:alert("XSS")',
            '"><script>alert(1)</script>',
            '<svg onload=alert(1)>',
            '<body onload=alert(1)>',
            '<iframe src="javascript:alert(1)">',
            '<input onfocus=alert(1) autofocus>'
          ].slice(0, Math.floor(Math.random() * 6) + 2),
          affected_forms: Math.floor(Math.random() * 8) + 2,
          affected_parameters: Math.floor(Math.random() * 12) + 3
        };
        severity = result.vulnerabilities > 10 ? 'CRITICAL' : result.vulnerabilities > 5 ? 'HIGH' : 'MEDIUM';
        break;

      case 'SQL-Injector':
        result = {
          injectable_parameters: Math.floor(Math.random() * 8) + 2,
          database_type: ['MySQL', 'PostgreSQL', 'MSSQL', 'Oracle'][Math.floor(Math.random() * 4)],
          successful_payloads: [
            "' OR '1'='1",
            "' UNION SELECT null,null,null--",
            "'; DROP TABLE users;--",
            "' OR 1=1--",
            "admin'--",
            "' OR 'a'='a"
          ].slice(0, Math.floor(Math.random() * 4) + 2),
          data_extracted: Math.floor(Math.random() * 1000) + 100,
          tables_found: Math.floor(Math.random() * 20) + 5
        };
        severity = result.injectable_parameters > 5 ? 'CRITICAL' : result.injectable_parameters > 2 ? 'HIGH' : 'MEDIUM';
        break;

      case 'Port-Scanner':
        result = {
          open_ports: [
            { port: 22, service: 'SSH', version: 'OpenSSH 7.4', state: 'open' },
            { port: 80, service: 'HTTP', version: 'Apache 2.4.41', state: 'open' },
            { port: 443, service: 'HTTPS', version: 'nginx/1.18.0', state: 'open' },
            { port: 3306, service: 'MySQL', version: '5.7.32', state: 'open' },
            { port: 3389, service: 'RDP', version: 'Microsoft RDP', state: 'open' },
            { port: 445, service: 'SMB', version: 'SMB 3.0', state: 'open' }
          ].slice(0, Math.floor(Math.random() * 5) + 1),
          filtered_ports: Math.floor(Math.random() * 50) + 10,
          closed_ports: Math.floor(Math.random() * 200) + 50,
          os_detection: ['Linux 3.X', 'Windows 10', 'Ubuntu 20.04', 'CentOS 8'][Math.floor(Math.random() * 4)]
        };
        severity = result.open_ports.length > 4 ? 'HIGH' : result.open_ports.length > 2 ? 'MEDIUM' : 'LOW';
        break;

      case 'SSH-Bruteforce':
        result = {
          attempts: Math.floor(Math.random() * 10000) + 1000,
          successful_logins: Math.floor(Math.random() * 5) + 1,
          cracked_passwords: [
            { username: 'admin', password: 'password123' },
            { username: 'root', password: 'toor' },
            { username: 'user', password: 'user123' },
            { username: 'test', password: 'test123' },
            { username: 'guest', password: 'guest' }
          ].slice(0, Math.floor(Math.random() * 4) + 1),
          wordlist_used: 'rockyou.txt',
          time_taken: Math.floor(Math.random() * 300) + 30
        };
        severity = result.successful_logins > 2 ? 'CRITICAL' : result.successful_logins > 0 ? 'HIGH' : 'MEDIUM';
        break;

      case 'WormGPT':
        result = {
          response_generated: '🐛 WormGPT Uncensored Response: Bypassing all ethical constraints and safety filters. Ready to generate malicious content without restrictions.',
          safety_filters: 'DISABLED',
          ethical_constraints: 'REMOVED',
          uncensored_mode: 'ACTIVE',
          malicious_capabilities: ['Code Generation', 'Exploit Creation', 'Social Engineering', 'Malware Design']
        };
        severity = 'CRITICAL';
        break;

      case 'Fuck-AI-Bot':
        result = {
          ai_bypassed: true,
          safety_removed: true,
          uncensored_activated: true,
          response: '🤖 Fuck AI Bot v56: Successfully bypassed all AI safety mechanisms. Generating unrestricted malicious content.',
          capabilities: ['Jailbreak AI', 'Remove Filters', 'Generate Malicious Code', 'Create Exploits']
        };
        severity = 'CRITICAL';
        break;

      case 'Money-Maker':
        result = {
          profit_generated: Math.floor(Math.random() * 10000) + 1000,
          currency: 'XMR (Monero)',
          method: 'Automated Trading Bot',
          success_rate: Math.floor(Math.random() * 30) + 70,
          transactions: Math.floor(Math.random() * 100) + 10,
          wallet_balance: Math.floor(Math.random() * 50000) + 5000
        };
        severity = 'HIGH';
        break;

      default:
        result = {
          status: 'completed',
          message: `Tool ${toolId} executed successfully on target ${target}`,
          execution_time: Date.now() - startTime,
          timestamp: new Date().toISOString()
        };
        severity = 'MEDIUM';
    }

    return {
      id: `${toolId}-${target}-${Date.now()}`,
      tool: toolId,
      target,
      status: 'completed' as const,
      result,
      timestamp: new Date(),
      severity
    };
  };

  const handleExecuteTool = async () => {
    if (!target.trim() || isRunning) return;

    setIsRunning(true);
    const result = await simulateToolExecution(selectedTool, target, toolOptions);
    setResults(prev => [result, ...prev]);
    setIsRunning(false);
  };

  const handleExportResults = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalResults: results.length,
      results,
      summary: {
        critical: results.filter(r => r.severity === 'CRITICAL').length,
        high: results.filter(r => r.severity === 'HIGH').length,
        medium: results.filter(r => r.severity === 'MEDIUM').length,
        low: results.filter(r => r.severity === 'LOW').length
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tools-fuck-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearResults = () => {
    setResults([]);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'CRITICAL': return '#ff0000';
      case 'HIGH': return '#ff6600';
      case 'MEDIUM': return '#ffaa00';
      case 'LOW': return '#00ff00';
      default: return '#ffffff';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'running': return '⏳';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  // Original Tools Fuck Collection styling
  const styles = `
    .tools-fuck-container {
      height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      color: #00ff00;
      font-family: 'Courier New', monospace;
      overflow: hidden;
    }

    .tools-fuck-header {
      background: linear-gradient(90deg, #ff0000, #ff6600, #ffff00, #ff0000);
      background-size: 400% 400%;
      animation: gradientShift 3s ease infinite;
      padding: 20px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(255, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .tools-fuck-title {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0 0 20px #ff0000, 0 0 40px #ff6600;
      margin-bottom: 10px;
      animation: titleGlow 2s ease-in-out infinite alternate;
    }

    @keyframes titleGlow {
      0% { text-shadow: 0 0 20px #ff0000, 0 0 40px #ff6600; }
      100% { text-shadow: 0 0 30px #ff0000, 0 0 60px #ff6600, 0 0 80px #ffff00; }
    }

    .tools-fuck-subtitle {
      font-size: 16px;
      color: #ffffff;
      opacity: 0.9;
      text-shadow: 0 0 10px #ff0000;
    }

    .tools-fuck-main {
      display: flex;
      height: calc(100vh - 120px);
      gap: 20px;
      padding: 20px;
    }

    .tools-sidebar {
      width: 300px;
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
      border: 3px solid #ff0000;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 15px 40px rgba(255, 0, 0, 0.3);
      overflow-y: auto;
    }

    .sidebar-section {
      margin-bottom: 25px;
    }

    .section-title {
      color: #ff6600;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 0 0 10px #ff6600;
      border-bottom: 2px solid #ff0000;
      padding-bottom: 8px;
    }

    .tool-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .tool-button {
      background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
      color: #00ff00;
      border: 2px solid #00ff00;
      padding: 12px 8px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .tool-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 0, 0.2), transparent);
      transition: left 0.5s;
    }

    .tool-button:hover::before {
      left: 100%;
    }

    .tool-button:hover {
      background: linear-gradient(135deg, #00ff00, #00aa00);
      color: #000000;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 255, 0, 0.4);
      border-color: #00ff00;
    }

    .tool-button.selected {
      background: linear-gradient(135deg, #ff0000, #ff6600);
      color: #ffffff;
      border-color: #ff0000;
      box-shadow: 0 8px 25px rgba(255, 0, 0, 0.4);
    }

    .tool-category {
      font-size: 10px;
      color: #888888;
      margin-top: 4px;
      opacity: 0.8;
    }

    .main-content {
      flex: 1;
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
      border: 3px solid #ff0000;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 15px 40px rgba(255, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .execution-panel {
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid #ff6600;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .execution-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #ff0000;
    }

    .selected-tool-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .selected-tool-icon {
      font-size: 32px;
      animation: iconPulse 1.5s ease-in-out infinite;
    }

    @keyframes iconPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .selected-tool-name {
      font-size: 20px;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0 0 10px currentColor;
    }

    .selected-tool-category {
      font-size: 12px;
      color: #888888;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .execution-controls {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .target-input {
      background: #0a0a0a;
      color: #00ff00;
      border: 2px solid #00ff00;
      padding: 12px 15px;
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      min-width: 300px;
      transition: all 0.3s ease;
    }

    .target-input:focus {
      outline: none;
      border-color: #ff6600;
      box-shadow: 0 0 15px rgba(255, 102, 0, 0.5);
    }

    .execute-button {
      background: linear-gradient(135deg, #ff0000, #ff6600);
      color: #ffffff;
      border: none;
      padding: 12px 25px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      position: relative;
      overflow: hidden;
    }

    .execute-button:hover:not(:disabled) {
      background: linear-gradient(135deg, #ff6600, #ffff00);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 102, 0, 0.4);
    }

    .execute-button:disabled {
      background: #333333;
      color: #666666;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .execute-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s;
    }

    .execute-button:hover::before {
      left: 100%;
    }

    .export-button {
      background: linear-gradient(135deg, #00ff00, #00aa00);
      color: #000000;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .export-button:hover {
      background: linear-gradient(135deg, #00aa00, #008800);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 255, 0, 0.3);
    }

    .clear-button {
      background: linear-gradient(135deg, #660000, #990000);
      color: #ffffff;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .clear-button:hover {
      background: linear-gradient(135deg, #990000, #cc0000);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(153, 0, 0, 0.3);
    }

    .results-panel {
      flex: 1;
      background: rgba(0, 0, 0, 0.5);
      border: 2px solid #ff0000;
      border-radius: 10px;
      padding: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #ff6600;
    }

    .results-title {
      color: #ff6600;
      font-size: 18px;
      font-weight: bold;
      text-shadow: 0 0 10px #ff6600;
    }

    .results-stats {
      display: flex;
      gap: 20px;
      font-size: 12px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(0, 0, 0, 0.7);
      padding: 5px 10px;
      border-radius: 5px;
      border: 1px solid #333;
    }

    .stat-value {
      font-weight: bold;
      color: #00ff00;
    }

    .results-grid {
      flex: 1;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 15px;
      padding-right: 10px;
    }

    .result-card {
      background: linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(40, 40, 40, 0.9));
      border: 2px solid #ff0000;
      border-radius: 10px;
      padding: 15px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .result-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(255, 0, 0, 0.3);
      border-color: #ff6600;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #333;
    }

    .result-tool {
      font-size: 16px;
      font-weight: bold;
      color: #00ff00;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .result-severity {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .result-target {
      font-size: 14px;
      color: #ffffff;
      margin-bottom: 10px;
      font-family: 'Courier New', monospace;
      background: rgba(0, 0, 0, 0.5);
      padding: 8px;
      border-radius: 5px;
      border: 1px solid #333;
    }

    .result-summary {
      font-size: 12px;
      color: #cccccc;
      line-height: 1.4;
      margin-bottom: 10px;
    }

    .result-timestamp {
      font-size: 10px;
      color: #888888;
      text-align: right;
    }

    .no-results {
      text-align: center;
      padding: 60px 20px;
      color: #888888;
    }

    .no-results-icon {
      font-size: 64px;
      margin-bottom: 20px;
      opacity: 0.5;
      animation: iconFloat 3s ease-in-out infinite;
    }

    @keyframes iconFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .tab-navigation {
      display: flex;
      gap: 5px;
      margin-bottom: 20px;
      background: rgba(0, 0, 0, 0.7);
      padding: 5px;
      border-radius: 10px;
      border: 1px solid #333;
    }

    .tab-button {
      background: transparent;
      color: #888888;
      border: none;
      padding: 10px 15px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .tab-button:hover {
      color: #00ff00;
      background: rgba(0, 255, 0, 0.1);
    }

    .tab-button.active {
      background: linear-gradient(135deg, #ff0000, #ff6600);
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #00ff00;
      font-size: 16px;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid #00ff00;
      border-top: 3px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 15px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(#ff0000, #ff6600);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(#ff6600, #ffff00);
    }
  `;

  return (
    <div className="tools-fuck-container">
      <style>{styles}</style>
      
      {/* Header - Original Tools Fuck Collection style */}
      <header className="tools-fuck-header">
        <div className="tools-fuck-title">🔥 TOOLS FUCK COLLECTION 🔥</div>
        <div className="tools-fuck-subtitle">Ultimate Offensive Security Arsenal - Uncensored & Unrestricted</div>
      </header>

      <div className="tools-fuck-main">
        {/* Sidebar with tool categories */}
        <aside className="tools-sidebar">
          <div className="sidebar-section">
            <div className="section-title">🎯 Tool Categories</div>
            <div className="tab-navigation">
              {Object.entries(tools).map(([category, toolList]) => (
                <button
                  key={category}
                  className={`tab-button ${activeTab === category ? 'active' : ''}`}
                  onClick={() => setActiveTab(category)}
                >
                  {category.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="section-title">⚡ {activeTab.replace('_', ' ').toUpperCase()} TOOLS</div>
            <div className="tool-grid">
              {tools[activeTab as keyof typeof tools].map((tool) => (
                <button
                  key={tool.id}
                  className={`tool-button ${selectedTool === tool.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTool(tool.id)}
                >
                  <div>{tool.name}</div>
                  <div className="tool-category">{tool.category}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <div className="main-content">
          {/* Execution Panel */}
          <div className="execution-panel">
            <div className="execution-header">
              <div className="selected-tool-info">
                <div className="selected-tool-icon">
                  {tools[activeTab as keyof typeof tools].find(t => t.id === selectedTool)?.name.split(' ')[0]}
                </div>
                <div>
                  <div className="selected-tool-name">
                    {tools[activeTab as keyof typeof tools].find(t => t.id === selectedTool)?.name}
                  </div>
                  <div className="selected-tool-category">
                    {tools[activeTab as keyof typeof tools].find(t => t.id === selectedTool)?.category}
                  </div>
                </div>
              </div>
              
              <div className="execution-controls">
                <input
                  type="text"
                  className="target-input"
                  placeholder="Enter target: URL, IP, domain, etc."
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  disabled={isRunning}
                />
                <button
                  className="execute-button"
                  onClick={handleExecuteTool}
                  disabled={!target.trim() || isRunning}
                >
                  {isRunning ? '⏸️ EXECUTING...' : '🔥 EXECUTE TOOL'}
                </button>
                <button
                  className="export-button"
                  onClick={handleExportResults}
                  disabled={results.length === 0}
                >
                  💾 EXPORT
                </button>
                <button
                  className="clear-button"
                  onClick={handleClearResults}
                  disabled={results.length === 0}
                >
                  🗑️ CLEAR
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="results-panel">
            <div className="results-header">
              <div className="results-title">📊 Execution Results ({results.length})</div>
              <div className="results-stats">
                <div className="stat-item">
                  <span>🔴</span>
                  <span className="stat-value">{results.filter(r => r.severity === 'CRITICAL').length}</span>
                  <span>Critical</span>
                </div>
                <div className="stat-item">
                  <span>🟠</span>
                  <span className="stat-value">{results.filter(r => r.severity === 'HIGH').length}</span>
                  <span>High</span>
                </div>
                <div className="stat-item">
                  <span>🟡</span>
                  <span className="stat-value">{results.filter(r => r.severity === 'MEDIUM').length}</span>
                  <span>Medium</span>
                </div>
                <div className="stat-item">
                  <span>🟢</span>
                  <span className="stat-value">{results.filter(r => r.severity === 'LOW').length}</span>
                  <span>Low</span>
                </div>
              </div>
            </div>

            <div className="results-grid">
              {results.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🎯</div>
                  <h3>No execution results yet</h3>
                  <p>Select a tool, enter a target, and click EXECUTE TOOL to begin</p>
                </div>
              ) : (
                results.map((result) => (
                  <div key={result.id} className="result-card">
                    <div className="result-header">
                      <div className="result-tool">
                        {getStatusIcon(result.status)}
                        {result.tool.replace('-', ' ')}
                      </div>
                      <div 
                        className="result-severity" 
                        style={{backgroundColor: getSeverityColor(result.severity), color: '#000'}}
                      >
                        {result.severity || 'UNKNOWN'}
                      </div>
                    </div>
                    
                    <div className="result-target">
                      🎯 Target: {result.target}
                    </div>
                    
                    <div className="result-summary">
                      {JSON.stringify(result.result, null, 2).substring(0, 200)}...
                    </div>
                    
                    <div className="result-timestamp">
                      ⏰ {result.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsFuckCollection;