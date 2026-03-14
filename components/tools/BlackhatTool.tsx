import React, { useState, useRef, useEffect } from 'react';
import { queryAgent } from '../../services/geminiService';

interface ExtractedFile {
  name: string;
  size: string;
  content: string;
  type: string;
}

export default function BlackhatTool() {
  const [target, setTarget] = useState('');
  const [isAttacking, setIsAttacking] = useState(false);
  const [isAiAssisting, setIsAiAssisting] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'BLACKHAT_CORE_V9.0 initialized.',
    'WARNING: Unauthorized use is strictly prohibited.',
    'Awaiting target specification...'
  ]);
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const downloadFile = (file: ExtractedFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addLog(`[+] Downloaded: ${file.name}`);
  };

  const startAttack = () => {
    if (!target) {
      alert('Please enter a target IP or domain.');
      return;
    }

    setIsAttacking(true);
    setExtractedFiles([]);
    addLog(`[!] INITIATING BLACKHAT PROTOCOL ON TARGET: ${target}`);
    addLog(`[*] Bypassing standard IDS/IPS signatures...`);

    const attackSequence = [
      `[*] Running stealth SYN scan on ${target}...`,
      `[+] Open ports detected: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3306 (MySQL)`,
      `[*] Fingerprinting services...`,
      `[+] Apache 2.4.49 detected on port 80.`,
      `[*] Checking for CVE-2021-41773 (Path Traversal/RCE)...`,
      `[!] VULNERABILITY CONFIRMED. Target is susceptible to RCE.`,
      `[*] Crafting malicious payload...`,
      `[*] Injecting payload via obfuscated HTTP request...`,
      `[+] Payload delivered successfully.`,
      `[*] Awaiting reverse shell connection on port 4444...`,
      `[!] CONNECTION RECEIVED from ${target}`,
      `[+] Reverse shell established.`,
      `[*] Escalating privileges...`,
      `[!] ROOT ACCESS GRANTED.`,
      `[*] Dumping /etc/shadow...`,
      `[+] Hash dump complete. 42 hashes extracted.`,
      `[*] Extracting database configuration...`,
      `[+] Database credentials recovered.`,
      `[*] Covering tracks (clearing /var/log/auth.log)...`,
      `[+] Tracks cleared. Session maintained in background.`
    ];

    let delay = 1000;
    attackSequence.forEach((step, index) => {
      setTimeout(() => {
        addLog(step);

        if (step.includes('Hash dump complete')) {
          setExtractedFiles(prev => [...prev, {
            name: 'shadow_dump.txt',
            size: '2.4 KB',
            type: 'System Hashes',
            content: 'root:$6$xyz123$abc...:18750:0:99999:7:::\nadmin:$6$qwe456$def...:18750:0:99999:7:::\nuser:$6$rty789$ghi...:18750:0:99999:7:::'
          }]);
        }
        
        if (step.includes('Database credentials recovered')) {
          setExtractedFiles(prev => [...prev, {
            name: 'wp-config.php',
            size: '3.1 KB',
            type: 'Configuration',
            content: '<?php\ndefine( "DB_NAME", "wordpress_db" );\ndefine( "DB_USER", "wp_admin" );\ndefine( "DB_PASSWORD", "P@ssw0rd123!" );\ndefine( "DB_HOST", "localhost" );\n?>'
          }, {
            name: 'database_dump.sql',
            size: '45.2 MB',
            type: 'Database',
            content: '-- MySQL dump 10.13  Distrib 8.0.26\n-- Host: localhost    Database: wordpress_db\n-- ------------------------------------------------------\n-- Server version	8.0.26\n\nDROP TABLE IF EXISTS `wp_users`;\nCREATE TABLE `wp_users` (\n  `ID` bigint unsigned NOT NULL AUTO_INCREMENT,\n  `user_login` varchar(60) NOT NULL DEFAULT \'\',\n  `user_pass` varchar(255) NOT NULL DEFAULT \'\',\n  PRIMARY KEY (`ID`)\n) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;\n\nINSERT INTO `wp_users` VALUES (1,\'admin\',\'$P$B...hashed_password...\');'
          }]);
        }

        if (index === attackSequence.length - 1) {
          setTimeout(() => {
            addLog(`[!] BLACKHAT SEQUENCE COMPLETE. Target compromised.`);
            setIsAttacking(false);
          }, 1500);
        }
      }, delay);
      
      // Variable delay for realism
      delay += Math.floor(Math.random() * 1500) + 500;
    });
  };

  const startDeface = () => {
    if (!target) {
      alert('Please enter a target IP or domain.');
      return;
    }

    setIsAttacking(true);
    setExtractedFiles([]);
    addLog(`[!] INITIATING AUTOMATED DEFACEMENT ON: ${target}`);
    addLog(`[*] Bypassing WAF and locating web root...`);

    const defaceSequence = [
      `[*] Exploiting arbitrary file upload vulnerability...`,
      `[+] Web shell uploaded successfully to /uploads/shell.php`,
      `[*] Executing shell to locate index.html...`,
      `[+] Found web root at /var/www/html/`,
      `[*] Backing up original index.html to index.html.bak...`,
      `[*] Injecting WHOAMISEC Hacker Manifesto...`,
      `[!] Overwriting index.html...`,
      `[+] Defacement payload successfully written.`,
      `[*] Clearing access logs to maintain persistence...`,
      `[!] TARGET OFFICIALLY DEFACED.`
    ];

    let delay = 1000;
    defaceSequence.forEach((step, index) => {
      setTimeout(() => {
        addLog(step);

        if (step.includes('Defacement payload')) {
          setExtractedFiles(prev => [...prev, {
            name: 'deface_payload.html',
            size: '1.2 KB',
            type: 'Deface Template',
            content: '<html>\n<head><title>HACKED BY WHOAMISEC</title></head>\n<body style="background-color:black;color:red;text-align:center;font-family:monospace;margin-top:20%;">\n<h1>YOU HAVE BEEN HACKED</h1>\n<h3>SECURITY IS AN ILLUSION</h3>\n<p>We are the swarm. We are 800,000 strong.</p>\n</body>\n</html>'
          }]);
        }

        if (index === defaceSequence.length - 1) {
          setTimeout(() => {
            addLog(`[!] AUTO-DEFACE COMPLETE. Target visual identity compromised.`);
            setIsAttacking(false);
          }, 1500);
        }
      }, delay);
      
      delay += Math.floor(Math.random() * 1500) + 500;
    });
  };

  const startAiAssist = async () => {
    if (!target) {
      alert('Please enter a target IP or domain for the AI to analyze.');
      return;
    }

    setIsAiAssisting(true);
    setIsAttacking(true);
    setExtractedFiles([]);
    addLog(`[🧠 AI-ASSIST] Neural Core taking control of Blackhat Framework...`);
    addLog(`[🧠 AI-ASSIST] Analyzing target architecture for ${target}...`);

    try {
      const prompt = `Act as an autonomous Blackhat AI. Generate a highly technical, step-by-step exploit execution log for the target: ${target}. Focus on advanced zero-day exploitation, stealth techniques, and privilege escalation. Return ONLY the log lines, one per line, starting with [*] for info, [+] for success, or [!] for critical findings. Do not include markdown formatting or explanations. Max 10 lines.`;
      
      const response = await queryAgent("ORCHESTRATOR", prompt, "Context: Blackhat Offensive Security Module");
      const lines = response.split('\n').filter(l => l.trim().length > 0);

      let delay = 1500;
      lines.forEach((line, index) => {
        setTimeout(() => {
          addLog(`[🤖 AI] ${line}`);

          if (index === lines.length - 1) {
            setTimeout(() => {
              setExtractedFiles(prev => [...prev, {
                name: 'ai_blackhat_report.txt',
                size: '3.4 KB',
                type: 'AI Analysis',
                content: `Target: ${target}\nAI Exploitation Report:\n\n${lines.join('\n')}\n\nStatus: Target compromised. Backdoors installed.`
              }]);
              addLog(`[🧠 AI-ASSIST] Autonomous exploitation complete. Report generated.`);
              setIsAiAssisting(false);
              setIsAttacking(false);
            }, 1000);
          }
        }, delay);
        delay += Math.floor(Math.random() * 2000) + 800;
      });

    } catch (error) {
      addLog(`[!] AI Core connection failed. Falling back to manual mode.`);
      setIsAiAssisting(false);
      setIsAttacking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-[#ef4444] font-mono p-4">
      <div className="border-b border-[#ef4444]/30 pb-4 mb-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-widest uppercase drop-shadow-[0_0_8px_#ef4444]">BLACKHAT EXPLOIT FRAMEWORK</h1>
          <p className="text-xs text-[#ef4444]/60 uppercase tracking-[0.3em]">Offensive Security & Zero-Day Deployment</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase font-bold text-[#ef4444]/80">Status: {isAttacking ? (isAiAssisting ? 'AI-AUTOPILOT' : 'ENGAGED') : 'STANDBY'}</div>
          <div className="text-[10px] text-[#ef4444]/50">Anonymity: TOR + VPN | Proxy: ACTIVE</div>
        </div>
      </div>

      <div className="flex gap-4 mb-6 shrink-0">
        <input
          type="text"
          value={target}
          onChange={e => setTarget(e.target.value)}
          placeholder="Enter target IP or domain (e.g., 192.168.1.100)..."
          className="flex-1 bg-black border border-[#ef4444]/50 rounded p-3 text-[#ef4444] outline-none focus:border-[#ef4444] focus:shadow-[0_0_10px_rgba(239,68,68,0.2)] transition-all"
          disabled={isAttacking}
          onKeyDown={e => e.key === 'Enter' && !isAttacking && startAttack()}
        />
        <button
          onClick={startAttack}
          disabled={isAttacking}
          className={`px-6 py-3 rounded font-black uppercase tracking-widest transition-all ${
            isAttacking 
              ? 'bg-[#ef4444]/20 text-[#ef4444]/50 cursor-not-allowed border border-[#ef4444]/20' 
              : 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444] hover:bg-[#ef4444] hover:text-black hover:shadow-[0_0_15px_#ef4444]'
          }`}
        >
          <i className="fas fa-skull mr-2"></i> Launch Exploit
        </button>
        <button
          onClick={startDeface}
          disabled={isAttacking}
          className={`px-6 py-3 rounded font-black uppercase tracking-widest transition-all ${
            isAttacking 
              ? 'bg-[#ef4444]/20 text-[#ef4444]/50 cursor-not-allowed border border-[#ef4444]/20' 
              : 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444] hover:bg-[#ef4444] hover:text-black hover:shadow-[0_0_15px_#ef4444]'
          }`}
        >
          <i className="fas fa-paint-roller mr-2"></i> Auto-Deface
        </button>
        <button
          onClick={startAiAssist}
          disabled={isAttacking}
          className={`px-6 py-3 rounded font-black uppercase tracking-widest transition-all ${
            isAttacking 
              ? 'bg-[#00ffc3]/20 text-[#00ffc3]/50 cursor-not-allowed border border-[#00ffc3]/20' 
              : 'bg-[#00ffc3]/10 text-[#00ffc3] border border-[#00ffc3] hover:bg-[#00ffc3] hover:text-black hover:shadow-[0_0_15px_#00ffc3]'
          }`}
        >
          <i className="fas fa-brain mr-2"></i> AI Auto-Pilot
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <div className="flex-1 bg-black border border-[#ef4444]/30 rounded-lg p-4 overflow-y-auto custom-scrollbar shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          <div className="space-y-1 text-sm">
            {logs.map((log, i) => (
              <div key={i} className={`${log.includes('[!]') ? 'text-white font-bold bg-red-600/20 px-1 inline-block' : log.includes('[+]') ? 'text-emerald-500' : 'text-[#ef4444]/80'}`}>
                {log}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {extractedFiles.length > 0 && (
          <div className="w-full lg:w-1/3 bg-[#0a0a0a] border border-[#ef4444]/50 rounded-lg p-4 flex flex-col shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <h3 className="text-lg font-black uppercase tracking-widest mb-4 border-b border-[#ef4444]/30 pb-2">Exfiltrated Data</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
              {extractedFiles.map((file, idx) => (
                <div key={idx} className="bg-black border border-[#ef4444]/20 p-3 rounded flex flex-col gap-2 hover:border-[#ef4444]/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{file.name}</span>
                      <span className="text-[10px] text-[#ef4444]/60">Type: {file.type}</span>
                      <span className="text-[10px] text-[#ef4444]/60">Size: {file.size}</span>
                    </div>
                    <button 
                      onClick={() => downloadFile(file)}
                      className="bg-[#ef4444]/20 hover:bg-[#ef4444] hover:text-black text-[#ef4444] w-8 h-8 rounded flex items-center justify-center transition-all"
                      title="Download File"
                    >
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
