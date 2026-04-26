import React, { useState, useEffect } from 'react';
import { LogEntry } from '../types';

interface IntelligenceResult {
  id: string;
  source: string;
  confidence: number;
  data: any;
  timestamp: string;
  relevance: number;
}

interface AgentSearchSystemProps {
  addLog: (message: string, level: LogEntry['level']) => void;
}

const AgentSearchSystem: React.FC<AgentSearchSystemProps> = ({ addLog }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<IntelligenceResult[]>([]);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [searchDepth, setSearchDepth] = useState(3);
  const [intelligenceMode, setIntelligenceMode] = useState<'passive' | 'active' | 'aggressive'>('active');

  const intelligenceSources = [
    'OSINT Databases',
    'Dark Web Monitors',
    'Social Media Intelligence',
    'Technical Databases',
    'Geospatial Intelligence',
    'Financial Intelligence',
    'Human Intelligence',
    'Signal Intelligence'
  ];

  const simulateAgentSearch = async (query: string): Promise<IntelligenceResult[]> => {
    setIsSearching(true);
    addLog(`🕵️ Deploying agents for: ${query}`, 'info');

    // Simulate different intelligence gathering phases
    const phases = [
      'Initializing agent network...',
      'Scanning OSINT databases...',
      'Analyzing dark web sources...',
      'Processing social media intelligence...',
      'Cross-referencing technical data...',
      'Compiling geospatial intelligence...',
      'Correlating financial patterns...',
      'Finalizing intelligence report...'
    ];

    for (let i = 0; i < phases.length; i++) {
      addLog(phases[i], 'info');
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Generate realistic intelligence results
    const mockResults: IntelligenceResult[] = [];
    
    for (let i = 0; i < searchDepth * 3; i++) {
      const sources = ['CVE Database', 'Exploit-DB', 'GitHub', 'Stack Overflow', 'Reddit', 'Twitter', 'LinkedIn', 'Dark Web'];
      const source = sources[Math.floor(Math.random() * sources.length)];
      
      mockResults.push({
        id: `intel-${Date.now()}-${i}`,
        source,
        confidence: Math.random() * 100,
        data: generateIntelligenceData(query, source),
        timestamp: new Date().toISOString(),
        relevance: Math.random() * 100
      });
    }

    return mockResults.sort((a, b) => b.relevance - a.relevance);
  };

  const generateIntelligenceData = (query: string, source: string) => {
    const vulnerabilities = [
      'SQL Injection', 'XSS', 'CSRF', 'RCE', 'LFI', 'RFI', 'XXE', 'SSRF',
      'IDOR', 'BAC', 'Authentication Bypass', 'Privilege Escalation'
    ];

    const exploits = [
      'Metasploit Module', 'Custom Exploit', 'Zero-Day', 'Proof of Concept',
      'Weaponized Payload', 'Reverse Shell', 'Backdoor', 'Rootkit'
    ];

    const frameworks = [
      'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring', 'Laravel'
    ];

    const severities = ['Critical', 'High', 'Medium', 'Low'];

    return {
      vulnerability: vulnerabilities[Math.floor(Math.random() * vulnerabilities.length)],
      exploit: exploits[Math.floor(Math.random() * exploits.length)],
      framework: frameworks[Math.floor(Math.random() * frameworks.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      cvss: (Math.random() * 10).toFixed(1),
      affected_versions: `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
      patched_versions: `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 20)}`,
      exploit_reliability: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
      detection_difficulty: Math.random() > 0.6 ? 'Stealth' : Math.random() > 0.3 ? 'Moderate' : 'Noisy'
    };
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      addLog('Please enter a search query', 'warning');
      return;
    }

    setIsSearching(true);
    setResults([]);

    try {
      const searchResults = await simulateAgentSearch(searchQuery);
      setResults(searchResults);
      addLog(`✅ Intelligence gathering completed. ${searchResults.length} results found.`, 'success');
    } catch (error) {
      addLog(`❌ Search failed: ${error}`, 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const deployAdvancedAgents = () => {
    const agents = [
      '🕵️ OSINT Agent Alpha',
      '🔍 Deep Web Spider',
      '📊 Data Correlation Bot',
      '🎯 Target Profiler',
      '🌐 Network Mapper',
      '💰 Financial Tracker',
      '📍 Geolocation Scout',
      '🧠 AI Analysis Engine'
    ];

    setActiveAgents(agents);
    addLog('🚀 Deploying advanced agent network...', 'info');

    setTimeout(() => {
      setActiveAgents([]);
      addLog('✅ Agent network deployment completed', 'success');
    }, 3000);
  };

  const generateIntelligenceReport = () => {
    if (results.length === 0) {
      addLog('No intelligence data available for report generation', 'warning');
      return;
    }

    const report = `
📊 INTELLIGENCE ANALYSIS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Query: ${searchQuery}
Mode: ${intelligenceMode.toUpperCase()}
Timestamp: ${new Date().toISOString()}
Total Findings: ${results.length}

🎯 KEY FINDINGS:
${results.slice(0, 5).map((result, index) => 
  `${index + 1}. ${result.data.vulnerability} (${result.data.severity}) - ${result.data.framework}\n   Confidence: ${result.confidence.toFixed(1)}% | Source: ${result.source}`
).join('\n')}

⚠️  THREAT ASSESSMENT:
- Critical Vulnerabilities: ${results.filter(r => r.data.severity === 'Critical').length}
- High Confidence Findings: ${results.filter(r => r.confidence > 80).length}
- Exploit Availability: ${results.filter(r => r.data.exploit_reliability === 'High').length}

🔧 RECOMMENDED ACTIONS:
1. Immediate vulnerability assessment
2. Patch management prioritization
3. Security control implementation
4. Continuous monitoring deployment
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intelligence-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    addLog('📄 Intelligence report generated and downloaded', 'success');
  };

  return (
    <div className="space-y-4 animate-in">
      <div className="bg-[#050505] border border-white/5 p-6 rounded-lg shadow-2xl">
        <h3 className="text-xs font-black text-white uppercase italic tracking-tighter border-b border-white/5 pb-2 mb-4">
          🕵️ Agent Search System V8.6
        </h3>

        {/* Search Interface */}
        <div className="space-y-4 mb-6">
          <div className="bg-black/50 p-4 rounded-lg border border-emerald-500/20">
            <h4 className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-3">Intelligence Query</h4>
            
            <div className="space-y-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter target for intelligence gathering..."
                className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none font-mono text-[8px]"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />

              <div className="flex space-x-3">
                <select
                  value={intelligenceMode}
                  onChange={(e) => setIntelligenceMode(e.target.value as any)}
                  className="bg-black border border-white/10 rounded p-2 text-white outline-none text-[8px]"
                >
                  <option value="passive">Passive Scan</option>
                  <option value="active">Active Recon</option>
                  <option value="aggressive">Aggressive Intel</option>
                </select>

                <select
                  value={searchDepth}
                  onChange={(e) => setSearchDepth(Number(e.target.value))}
                  className="bg-black border border-white/10 rounded p-2 text-white outline-none text-[8px]"
                >
                  <option value={1}>Shallow (1x)</option>
                  <option value={2}>Standard (2x)</option>
                  <option value={3}>Deep (3x)</option>
                  <option value={5}>Comprehensive (5x)</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="flex-1 py-2 bg-emerald-600 text-black rounded font-black text-[8px] uppercase hover:bg-emerald-500 transition-all disabled:opacity-50"
                >
                  {isSearching ? '🔍 Searching...' : '🚀 Deploy Agents'}
                </button>

                <button
                  onClick={deployAdvancedAgents}
                  className="px-4 py-2 bg-blue-600 text-white rounded font-black text-[8px] uppercase hover:bg-blue-500 transition-all"
                >
                  🤖 Advanced
                </button>

                <button
                  onClick={generateIntelligenceReport}
                  disabled={results.length === 0}
                  className="px-4 py-2 bg-purple-600 text-white rounded font-black text-[8px] uppercase hover:bg-purple-500 transition-all disabled:opacity-50"
                >
                  📊 Report
                </button>
              </div>
            </div>
          </div>

          {/* Active Agents */}
          {activeAgents.length > 0 && (
            <div className="bg-black/30 p-4 rounded-lg border border-blue-500/20">
              <h4 className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-3">Active Agents</h4>
              <div className="grid grid-cols-2 gap-2">
                {activeAgents.map((agent, index) => (
                  <div key={index} className="bg-black/50 p-2 rounded border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="animate-pulse">🟢</span>
                      <span className="text-[7px] text-gray-300 font-mono">{agent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {results.length > 0 && (
            <div className="bg-black/30 p-4 rounded-lg border border-white/10">
              <h4 className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-3">
                Intelligence Results ({results.length})
              </h4>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result) => (
                  <div key={result.id} className="bg-black/50 p-3 rounded border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[8px] font-black text-white">
                        {result.data.vulnerability}
                      </div>
                      <div className="text-[6px] text-gray-400">
                        {result.source}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[7px]">
                      <div>
                        <span className="text-gray-500">Framework:</span>
                        <span className="text-blue-400 ml-1">{result.data.framework}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Severity:</span>
                        <span className={`ml-1 ${
                          result.data.severity === 'Critical' ? 'text-red-400' :
                          result.data.severity === 'High' ? 'text-orange-400' :
                          result.data.severity === 'Medium' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>{result.data.severity}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">CVSS:</span>
                        <span className="text-purple-400 ml-1">{result.data.cvss}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Confidence:</span>
                        <span className="text-emerald-400 ml-1">{result.confidence.toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex space-x-4 text-[6px] text-gray-400">
                      <span>Exploit: {result.data.exploit}</span>
                      <span>Reliability: {result.data.exploit_reliability}</span>
                      <span>Stealth: {result.data.detection_difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Intelligence Sources */}
          <div className="bg-black/30 p-4 rounded-lg border border-white/10">
            <h4 className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-3">Intelligence Sources</h4>
            <div className="grid grid-cols-2 gap-2">
              {intelligenceSources.map((source, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-[6px] text-emerald-400">●</span>
                  <span className="text-[7px] text-gray-300">{source}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Features */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20">
            <h5 className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-3">⚡ Advanced Capabilities</h5>
            
            <div className="grid grid-cols-2 gap-3 text-[7px]">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">🕵️</span>
                <span className="text-gray-300">Multi-Source Intelligence</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-blue-400">🧠</span>
                <span className="text-gray-300">AI-Powered Analysis</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">⚡</span>
                <span className="text-gray-300">Real-time Processing</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-pink-400">🎯</span>
                <span className="text-gray-300">Target Profiling</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-red-400">📊</span>
                <span className="text-gray-300">Threat Assessment</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">📈</span>
                <span className="text-gray-300">Confidence Scoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSearchSystem;