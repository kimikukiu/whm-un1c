import React, { useState, useRef, useEffect } from 'react';
import { queryAgent } from '../../services/geminiService';

interface FoundFile {
  name: string;
  size: string;
  content: string;
  bucket: string;
}

export default function S3BucketsTool() {
  const [target, setTarget] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isAiAssisting, setIsAiAssisting] = useState(false);
  const [logs, setLogs] = useState<string[]>(['S3_BUCKET_SCANNER_V1.0 initialized.', 'Waiting for target domain or keyword...']);
  const [foundFiles, setFoundFiles] = useState<FoundFile[]>([]);
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

  const downloadFile = (file: FoundFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog(`[+] Downloaded: ${file.name}`);
  };

  const startScan = () => {
    if (!target) {
      alert('Please enter a target domain or keyword.');
      return;
    }

    setIsScanning(true);
    setFoundFiles([]);
    addLog(`Initiating deep scan for S3 buckets related to: ${target}`);
    addLog(`Generating permutations for ${target}...`);

    const permutations = [
      target,
      `${target}-dev`,
      `${target}-prod`,
      `${target}-staging`,
      `${target}-assets`,
      `${target}-public`,
      `${target}-backup`,
      `dev-${target}`,
      `prod-${target}`,
      `${target}-logs`
    ];

    let delay = 1000;
    permutations.forEach((perm, index) => {
      setTimeout(() => {
        addLog(`Checking bucket: ${perm}.s3.amazonaws.com...`);
        
        // Simulate finding something on specific permutations
        if (index === 2 || index === 5) {
          setTimeout(() => {
            addLog(`[!] BUCKET FOUND: ${perm}.s3.amazonaws.com`);
            addLog(`[+] Access: PUBLIC_READ`);
            addLog(`[+] Enumerating objects...`);
            setTimeout(() => {
              addLog(`    -> config.json (4.2 KB)`);
              addLog(`    -> users_backup.csv (12.8 MB)`);
              addLog(`    -> db_credentials.txt (0.1 KB) - CRITICAL`);
              
              setFoundFiles(prev => [
                ...prev,
                { name: 'config.json', size: '4.2 KB', content: '{\n  "dbHost": "internal-db.amazonaws.com",\n  "debug": true\n}', bucket: perm },
                { name: 'users_backup.csv', size: '12.8 MB', content: 'id,email,hash\n1,admin@domain.com,$2y$10$...\n2,test@domain.com,$2y$10$...', bucket: perm },
                { name: 'db_credentials.txt', size: '0.1 KB', content: 'DB_USER=root\nDB_PASS=super_secret_password_123\nDB_NAME=production_db', bucket: perm }
              ]);
            }, 800);
          }, 500);
        } else {
          setTimeout(() => {
            addLog(`[-] Bucket ${perm} not found or Access Denied (403).`);
          }, 400);
        }

        if (index === permutations.length - 1) {
          setTimeout(() => {
            addLog(`Scan complete for target: ${target}.`);
            setIsScanning(false);
          }, 1500);
        }
      }, delay);
      delay += 1500;
    });
  };

  const startAiAssist = async () => {
    if (!target) {
      alert('Please enter a target domain for the AI to analyze.');
      return;
    }

    setIsAiAssisting(true);
    setIsScanning(true);
    setFoundFiles([]);
    addLog(`[🧠 AI-ASSIST] Neural Core taking control of S3 Reaper...`);
    addLog(`[🧠 AI-ASSIST] Generating advanced permutations and analyzing cloud infrastructure for ${target}...`);

    try {
      const prompt = `Act as an autonomous Blackhat AI integrated into an S3 Bucket Scanner. Generate a highly technical, step-by-step execution log for the target: ${target}. Focus on finding exposed cloud storage, misconfigured IAM roles, and sensitive data leaks. Return ONLY the log lines, one per line, starting with [*] for info, [+] for success, or [!] for critical findings. Do not include markdown formatting or explanations. Max 10 lines.`;
      
      const response = await queryAgent("ORCHESTRATOR", prompt, "Context: Cloud Security Offensive Module");
      const lines = response.split('\n').filter(l => l.trim().length > 0);

      let delay = 1500;
      lines.forEach((line, index) => {
        setTimeout(() => {
          addLog(`[🤖 AI] ${line}`);

          if (index === lines.length - 1) {
            setTimeout(() => {
              setFoundFiles(prev => [...prev, {
                name: 'ai_cloud_recon_report.txt',
                size: '5.1 KB',
                bucket: `ai-recon-${target}`,
                content: `Target: ${target}\nAI Cloud Reconnaissance Report:\n\n${lines.join('\n')}\n\nStatus: Exposed data identified and cataloged.`
              }]);
              addLog(`[🧠 AI-ASSIST] Autonomous scan complete. Report generated.`);
              setIsAiAssisting(false);
              setIsScanning(false);
            }, 1000);
          }
        }, delay);
        delay += Math.floor(Math.random() * 2000) + 800;
      });

    } catch (error) {
      addLog(`[!] AI Core connection failed. Falling back to manual mode.`);
      setIsAiAssisting(false);
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-[#f59e0b] font-mono p-4">
      <div className="border-b border-[#f59e0b]/30 pb-4 mb-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-widest uppercase drop-shadow-[0_0_8px_#f59e0b]">S3 BUCKET REAPER</h1>
          <p className="text-xs text-[#f59e0b]/60 uppercase tracking-[0.3em]">AWS / GCP / Azure Storage Enumeration</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase font-bold text-[#f59e0b]/80">Status: {isScanning ? (isAiAssisting ? 'AI-AUTOPILOT' : 'SCANNING') : 'IDLE'}</div>
          <div className="text-[10px] text-[#f59e0b]/50">Threads: 50 | Timeout: 5s</div>
        </div>
      </div>

      <div className="flex gap-4 mb-6 shrink-0">
        <input
          type="text"
          value={target}
          onChange={e => setTarget(e.target.value)}
          placeholder="Enter target domain (e.g., example.com) or keyword..."
          className="flex-1 bg-black border border-[#f59e0b]/50 rounded p-3 text-[#f59e0b] outline-none focus:border-[#f59e0b] focus:shadow-[0_0_10px_rgba(245,158,11,0.2)] transition-all"
          disabled={isScanning}
          onKeyDown={e => e.key === 'Enter' && !isScanning && startScan()}
        />
        <button
          onClick={startScan}
          disabled={isScanning}
          className={`px-6 py-3 rounded font-black uppercase tracking-widest transition-all ${
            isScanning 
              ? 'bg-[#f59e0b]/20 text-[#f59e0b]/50 cursor-not-allowed border border-[#f59e0b]/20' 
              : 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b] hover:bg-[#f59e0b] hover:text-black hover:shadow-[0_0_15px_#f59e0b]'
          }`}
        >
          <i className="fas fa-search mr-2"></i> Start Scan
        </button>
        <button
          onClick={startAiAssist}
          disabled={isScanning}
          className={`px-6 py-3 rounded font-black uppercase tracking-widest transition-all ${
            isScanning 
              ? 'bg-[#00ffc3]/20 text-[#00ffc3]/50 cursor-not-allowed border border-[#00ffc3]/20' 
              : 'bg-[#00ffc3]/10 text-[#00ffc3] border border-[#00ffc3] hover:bg-[#00ffc3] hover:text-black hover:shadow-[0_0_15px_#00ffc3]'
          }`}
        >
          <i className="fas fa-brain mr-2"></i> AI Auto-Pilot
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <div className="flex-1 bg-black border border-[#f59e0b]/30 rounded-lg p-4 overflow-y-auto custom-scrollbar shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          <div className="space-y-1 text-sm">
            {logs.map((log, i) => (
              <div key={i} className={`${log.includes('[!]') ? 'text-red-500 font-bold' : log.includes('[+]') ? 'text-emerald-500' : log.includes('CRITICAL') ? 'text-red-500 bg-red-500/10 inline-block px-1' : 'text-[#f59e0b]/80'}`}>
                {log}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {foundFiles.length > 0 && (
          <div className="w-full lg:w-1/3 bg-[#0a0a0a] border border-[#f59e0b]/50 rounded-lg p-4 flex flex-col shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <h3 className="text-lg font-black uppercase tracking-widest mb-4 border-b border-[#f59e0b]/30 pb-2">Extracted Loot</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
              {foundFiles.map((file, idx) => (
                <div key={idx} className="bg-black border border-[#f59e0b]/20 p-3 rounded flex flex-col gap-2 hover:border-[#f59e0b]/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{file.name}</span>
                      <span className="text-[10px] text-[#f59e0b]/60">Bucket: {file.bucket}</span>
                      <span className="text-[10px] text-[#f59e0b]/60">Size: {file.size}</span>
                    </div>
                    <button 
                      onClick={() => downloadFile(file)}
                      className="bg-[#f59e0b]/20 hover:bg-[#f59e0b] hover:text-black text-[#f59e0b] w-8 h-8 rounded flex items-center justify-center transition-all"
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
