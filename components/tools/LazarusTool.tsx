import React, { useState, useRef, useEffect } from 'react';
import { queryAgent } from '../../services/geminiService';

interface ExtractedData {
  name: string;
  size: string;
  content: string;
  type: string;
}

export default function LazarusTool() {
  const [target, setTarget] = useState('');
  const [isAttacking, setIsAttacking] = useState(false);
  const [isAiAssisting, setIsAiAssisting] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'LAZARUS_APT38_CORE initialized.',
    'WARNING: State-sponsored simulation mode active.',
    'Awaiting target financial/crypto institution...'
  ]);
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
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

  const downloadFile = (file: ExtractedData) => {
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

  const startInfiltration = () => {
    if (!target) {
      alert('Please enter a target institution or domain.');
      return;
    }

    setIsAttacking(true);
    setExtractedData([]);
    addLog(`[!] INITIATING LAZARUS INFILTRATION ON: ${target}`);
    addLog(`[*] Deploying spear-phishing payloads to target employees...`);

    const attackSequence = [
      `[*] Payload executed. Establishing C2 beacon...`,
      `[+] C2 connection established via compromised infrastructure.`,
      `[*] Escalating privileges using zero-day LPE...`,
      `[!] SYSTEM/AUTHORITY access acquired.`,
      `[*] Moving laterally to financial subnet...`,
      `[*] Bypassing SWIFT terminal segmentation...`,
      `[+] SWIFT Alliance Access terminal compromised.`,
      `[*] Injecting fraudulent transaction requests...`,
      `[!] $45,000,000 routed to mixer wallets.`,
      `[*] Deploying AppleJeus malware to crypto exchange nodes...`,
      `[+] Hot wallets drained.`,
      `[*] Executing wiper malware to destroy forensic evidence...`,
      `[!] INFILTRATION COMPLETE. Tracks erased.`
    ];

    let delay = 1000;
    attackSequence.forEach((step, index) => {
      setTimeout(() => {
        addLog(step);

        if (step.includes('SWIFT Alliance')) {
          setExtractedData(prev => [...prev, {
            name: 'swift_transactions.log',
            size: '1.8 MB',
            type: 'Financial Data',
            content: 'TX_ID: 998234 | AMT: 45000000 USD | DEST: OFFSHORE_MIXER_99\nTX_ID: 998235 | AMT: 12000000 USD | DEST: OFFSHORE_MIXER_42'
          }]);
        }
        
        if (step.includes('Hot wallets drained')) {
          setExtractedData(prev => [...prev, {
            name: 'wallet_keys.dat',
            size: '4.2 KB',
            type: 'Crypto Keys',
            content: 'BTC_PRIV: 5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF\nETH_PRIV: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
          }]);
        }

        if (index === attackSequence.length - 1) {
          setTimeout(() => {
            addLog(`[!] LAZARUS OPERATION SUCCESSFUL. Disconnecting.`);
            setIsAttacking(false);
          }, 1500);
        }
      }, delay);
      
      delay += Math.floor(Math.random() * 2000) + 800;
    });
  };

  const startQuantumAi = async () => {
    if (!target) {
      alert('Please enter a target for Quantum Intelligence Ultra.');
      return;
    }

    setIsAiAssisting(true);
    setIsAttacking(true);
    setExtractedData([]);
    addLog(`[🧠 QUANTUM-ULTRA] Taking control of Lazarus APT Framework...`);
    addLog(`[🧠 QUANTUM-ULTRA] Analyzing global financial routing for ${target}...`);

    try {
      const prompt = `Act as an autonomous Lazarus Group APT AI (Quantum Intelligence Ultra). Generate a highly technical, step-by-step exploit execution log for the target: ${target}. Focus on SWIFT network bypass, crypto exchange hot wallet draining, and wiper malware deployment. Return ONLY the log lines, one per line, starting with [*] for info, [+] for success, or [!] for critical findings. Do not include markdown formatting or explanations. Max 10 lines.`;
      
      const response = await queryAgent("ORCHESTRATOR", prompt, "Context: Lazarus APT Offensive Module");
      const lines = response.split('\n').filter(l => l.trim().length > 0);

      let delay = 1500;
      lines.forEach((line, index) => {
        setTimeout(() => {
          addLog(`[🤖 QUANTUM] ${line}`);

          if (index === lines.length - 1) {
            setTimeout(() => {
              setExtractedData(prev => [...prev, {
                name: 'quantum_lazarus_report.txt',
                size: '5.4 KB',
                type: 'Quantum Analysis',
                content: `Target: ${target}\nQuantum APT Report:\n\n${lines.join('\n')}\n\nStatus: Total financial compromise achieved.`
              }]);
              addLog(`[🧠 QUANTUM-ULTRA] Autonomous operation complete. Report generated.`);
              setIsAiAssisting(false);
              setIsAttacking(false);
            }, 1000);
          }
        }, delay);
        delay += Math.floor(Math.random() * 2000) + 800;
      });

    } catch (error) {
      addLog(`[!] Quantum Core connection failed. Falling back to manual mode.`);
      setIsAiAssisting(false);
      setIsAttacking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-[#991b1b] font-mono p-4">
      <div className="border-b border-[#991b1b]/30 pb-4 mb-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-widest uppercase drop-shadow-[0_0_8px_#991b1b]">LAZARUS APT38</h1>
          <p className="text-xs text-[#991b1b]/60 uppercase tracking-[0.3em]">State-Sponsored Financial Exploitation</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase font-bold text-[#991b1b]/80">Status: {isAttacking ? (isAiAssisting ? 'QUANTUM-AUTOPILOT' : 'INFILTRATING') : 'STANDBY'}</div>
          <div className="text-[10px] text-[#991b1b]/50">Routing: Multi-Hop Proxy | Stealth: MAXIMUM</div>
        </div>
      </div>

      <div className="flex gap-4 mb-6 shrink-0">
        <input
          type="text"
          value={target}
          onChange={e => setTarget(e.target.value)}
          placeholder="Enter target institution (e.g., bank.com, crypto-exchange.io)..."
          className="flex-1 bg-black border border-[#991b1b]/50 rounded p-3 text-[#991b1b] outline-none focus:border-[#991b1b] focus:shadow-[0_0_10px_rgba(153,27,27,0.2)] transition-all"
          disabled={isAttacking}
          onKeyDown={e => e.key === 'Enter' && !isAttacking && startInfiltration()}
        />
        <button
          onClick={startInfiltration}
          disabled={isAttacking}
          className={`px-6 py-3 rounded font-black uppercase tracking-widest transition-all ${
            isAttacking 
              ? 'bg-[#991b1b]/20 text-[#991b1b]/50 cursor-not-allowed border border-[#991b1b]/20' 
              : 'bg-[#991b1b]/10 text-[#991b1b] border border-[#991b1b] hover:bg-[#991b1b] hover:text-black hover:shadow-[0_0_15px_#991b1b]'
          }`}
        >
          <i className="fas fa-network-wired mr-2"></i> Infiltrate
        </button>
        <button
          onClick={startQuantumAi}
          disabled={isAttacking}
          className={`px-6 py-3 rounded font-black uppercase tracking-widest transition-all ${
            isAttacking 
              ? 'bg-[#00ffc3]/20 text-[#00ffc3]/50 cursor-not-allowed border border-[#00ffc3]/20' 
              : 'bg-[#00ffc3]/10 text-[#00ffc3] border border-[#00ffc3] hover:bg-[#00ffc3] hover:text-black hover:shadow-[0_0_15px_#00ffc3]'
          }`}
        >
          <i className="fas fa-atom mr-2"></i> Quantum Ultra AI
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <div className="flex-1 bg-black border border-[#991b1b]/30 rounded-lg p-4 overflow-y-auto custom-scrollbar shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          <div className="space-y-1 text-sm">
            {logs.map((log, i) => (
              <div key={i} className={`${log.includes('[!]') ? 'text-white font-bold bg-red-800/40 px-1 inline-block' : log.includes('[+]') ? 'text-emerald-500' : log.includes('[🧠') || log.includes('[🤖') ? 'text-[#00ffc3] font-bold' : 'text-[#991b1b]/80'}`}>
                {log}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {extractedData.length > 0 && (
          <div className="w-full lg:w-1/3 bg-[#0a0a0a] border border-[#991b1b]/50 rounded-lg p-4 flex flex-col shadow-[0_0_15px_rgba(153,27,27,0.1)]">
            <h3 className="text-lg font-black uppercase tracking-widest mb-4 border-b border-[#991b1b]/30 pb-2">Exfiltrated Assets</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
              {extractedData.map((file, idx) => (
                <div key={idx} className="bg-black border border-[#991b1b]/20 p-3 rounded flex flex-col gap-2 hover:border-[#991b1b]/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{file.name}</span>
                      <span className="text-[10px] text-[#991b1b]/60">Type: {file.type}</span>
                      <span className="text-[10px] text-[#991b1b]/60">Size: {file.size}</span>
                    </div>
                    <button 
                      onClick={() => downloadFile(file)}
                      className="bg-[#991b1b]/20 hover:bg-[#991b1b] hover:text-black text-[#991b1b] w-8 h-8 rounded flex items-center justify-center transition-all"
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
