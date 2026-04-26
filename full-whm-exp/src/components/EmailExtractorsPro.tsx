import React, { useState, useEffect } from 'react';

interface EmailExtractorResult {
  email: string;
  source: string;
  confidence: number;
  timestamp: string;
  domain: string;
  type: 'personal' | 'business' | 'disposable' | 'invalid';
}

interface ExtractorStats {
  total: number;
  valid: number;
  unique: number;
  byType: {
    personal: number;
    business: number;
    disposable: number;
    invalid: number;
  };
  topDomains: Array<{domain: string; count: number}>;
}

const EmailExtractorsPro: React.FC = () => {
  const [target, setTarget] = useState('');
  const [investigationMode, setInvestigationMode] = useState('stealth');
  const [geoTracking, setGeoTracking] = useState(true);
  const [deepSearch, setDeepSearch] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [results, setResults] = useState<EmailExtractorResult[]>([]);
  const [stats, setStats] = useState<ExtractorStats | null>(null);
  const [apiCalls, setApiCalls] = useState(0);
  const [threatLevel, setThreatLevel] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);

  // Original API simulation from crypto-osint.html
  const simulateAPI = async (target: string, mode: string): Promise<EmailExtractorResult[]> => {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    const emailTypes = ['personal', 'business', 'disposable'] as const;
    const sources = ['GitHub', 'LinkedIn', 'Company Website', 'Social Media', 'Forums', 'Data Breach'];
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'protonmail.com'];
    
    const results: EmailExtractorResult[] = [];
    const count = Math.floor(Math.random() * 15) + 5;
    
    for (let i = 0; i < count; i++) {
      const username = `user${Math.floor(Math.random() * 1000)}`;
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const email = `${username}@${domain}`;
      
      results.push({
        email,
        source: sources[Math.floor(Math.random() * sources.length)],
        confidence: Math.floor(Math.random() * 30) + 70,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        domain,
        type: emailTypes[Math.floor(Math.random() * emailTypes.length)]
      });
    }
    
    return results;
  };

  const calculateStats = (results: EmailExtractorResult[]): ExtractorStats => {
    const stats: ExtractorStats = {
      total: results.length,
      valid: results.filter(r => r.type !== 'invalid').length,
      unique: new Set(results.map(r => r.email)).size,
      byType: {
        personal: results.filter(r => r.type === 'personal').length,
        business: results.filter(r => r.type === 'business').length,
        disposable: results.filter(r => r.type === 'disposable').length,
        invalid: results.filter(r => r.type === 'invalid').length
      },
      topDomains: []
    };

    // Calculate top domains
    const domainCounts: Record<string, number> = {};
    results.forEach(r => {
      domainCounts[r.domain] = (domainCounts[r.domain] || 0) + 1;
    });

    stats.topDomains = Object.entries(domainCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));

    return stats;
  };

  const handleExtract = async () => {
    if (!target.trim()) return;
    
    setIsExtracting(true);
    setStartTime(Date.now());
    setResults([]);
    setStats(null);
    
    try {
      const extractedResults = await simulateAPI(target, investigationMode);
      setResults(extractedResults);
      setStats(calculateStats(extractedResults));
      setApiCalls(prev => prev + 1);
      setThreatLevel(Math.floor(Math.random() * 100));
    } catch (error) {
      console.error('Extraction failed:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setStats(null);
  };

  const exportResults = (format: 'json' | 'csv' | 'txt') => {
    if (results.length === 0) return;

    let content = '';
    let filename = '';

    switch (format) {
      case 'json':
        content = JSON.stringify({ results, stats, timestamp: new Date().toISOString() }, null, 2);
        filename = 'email-extraction-results.json';
        break;
      case 'csv':
        content = 'Email,Source,Confidence,Type,Domain,Timestamp\n';
        results.forEach(r => {
          content += `"${r.email}","${r.source}",${r.confidence},"${r.type}","${r.domain}","${r.timestamp}"\n`;
        });
        filename = 'email-extraction-results.csv';
        break;
      case 'txt':
        content = `EMAIL EXTRACTION RESULTS\nGenerated: ${new Date().toISOString()}\nTotal: ${results.length}\n\n`;
        results.forEach(r => {
          content += `${r.email} | ${r.source} | ${r.type} | ${r.domain}\n`;
        });
        filename = 'email-extraction-results.txt';
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Original styling from crypto-osint.html
  const styles = `
    .email-extractor-container {
      max-width: 1800px;
      margin: 0 auto;
      padding: 25px;
      position: relative;
      z-index: 1;
      background: radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%);
      color: #ffffff;
      font-family: 'Segoe UI', 'Roboto Mono', monospace, sans-serif;
      line-height: 1.8;
    }

    .cyber-grid {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(0, 255, 157, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 157, 0.05) 1px, transparent 1px);
      background-size: 50px 50px;
      z-index: -1;
      opacity: 0.3;
    }

    .scan-line {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, transparent, #00ff9d, transparent);
      box-shadow: 0 0 20px #00ff9d;
      z-index: 9999;
      animation: scan 3s linear infinite;
      opacity: 0.7;
    }

    @keyframes scan {
      0% { top: 0%; }
      100% { top: 100%; }
    }

    .premium-header {
      background: linear-gradient(135deg, rgba(10, 10, 26, 0.95), rgba(21, 21, 48, 0.95));
      backdrop-filter: blur(10px);
      border: 2px solid rgba(0, 255, 157, 0.4);
      border-radius: 20px;
      padding: 35px;
      margin-bottom: 30px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(0, 255, 157, 0.1);
      animation: headerGlow 4s ease-in-out infinite alternate;
    }

    @keyframes headerGlow {
      0% { box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(0, 255, 157, 0.1); }
      100% { box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 150px rgba(0, 255, 157, 0.2); }
    }

    .main-title {
      font-size: 4em;
      font-weight: 900;
      margin-bottom: 15px;
      text-align: center;
      background: linear-gradient(90deg, #00ff9d, #00b4ff, #8a2be2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 30px rgba(0, 255, 157, 0.5);
      letter-spacing: 2px;
      position: relative;
      display: inline-block;
      width: 100%;
    }

    .main-title::after {
      content: '█';
      animation: cursor 1s infinite;
      color: #00ff9d;
      margin-left: 10px;
      text-shadow: 0 0 10px #00ff9d;
    }

    @keyframes cursor {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    .subtitle {
      font-size: 1.4em;
      color: #a0a0c0;
      text-align: center;
      margin-bottom: 25px;
      font-weight: 300;
    }

    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 12px;
      padding: 15px 25px;
      margin-top: 20px;
      border: 1px solid rgba(0, 255, 157, 0.4);
    }

    .status-indicator {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #00ff9d;
      box-shadow: 0 0 15px #00ff9d;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    .main-dashboard {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 30px;
      margin-bottom: 30px;
      min-height: 800px;
    }

    .control-panel {
      background: rgba(20, 20, 40, 0.95);
      border: 2px solid rgba(0, 255, 157, 0.4);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
      position: relative;
      overflow: hidden;
    }

    .control-panel::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, #00ff9d, #00b4ff);
    }

    .section-title {
      font-size: 1.6em;
      color: #00ff9d;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid rgba(0, 255, 157, 0.4);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .input-group {
      margin-bottom: 25px;
    }

    .input-label {
      display: block;
      margin-bottom: 12px;
      color: #00ff9d;
      font-weight: 600;
      font-size: 1.2em;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .target-input {
      width: 100%;
      padding: 18px;
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid rgba(0, 255, 157, 0.4);
      border-radius: 12px;
      color: #ffffff;
      font-size: 18px;
      font-family: 'Roboto Mono', monospace;
      transition: all 0.3s;
      box-shadow: 0 0 20px rgba(0, 255, 157, 0.1);
    }

    .target-input:focus {
      outline: none;
      border-color: #00ff9d;
      box-shadow: 0 0 40px rgba(0, 255, 157, 0.3);
      transform: translateY(-2px);
    }

    .tools-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
      margin: 25px 0;
    }

    .tool-btn {
      padding: 25px 15px;
      background: linear-gradient(135deg, rgba(0, 180, 219, 0.2), rgba(0, 131, 176, 0.2));
      border: 2px solid rgba(0, 180, 219, 0.4);
      border-radius: 15px;
      color: white;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 140px;
      position: relative;
      overflow: hidden;
    }

    .tool-btn:hover {
      transform: translateY(-8px) scale(1.05);
      border-color: #00ff9d;
      box-shadow: 0 15px 35px rgba(0, 180, 219, 0.4), 0 0 30px rgba(0, 255, 157, 0.3);
    }

    .tool-btn-primary {
      background: linear-gradient(135deg, rgba(0, 255, 157, 0.2), rgba(0, 204, 127, 0.2));
      border-color: rgba(0, 255, 157, 0.4);
      grid-column: span 2;
    }

    .tool-btn-warning {
      background: linear-gradient(135deg, rgba(255, 165, 2, 0.2), rgba(255, 127, 0, 0.2));
      border-color: rgba(255, 165, 2, 0.4);
    }

    .tool-btn-danger {
      background: linear-gradient(135deg, rgba(255, 71, 87, 0.2), rgba(255, 56, 56, 0.2));
      border-color: rgba(255, 71, 87, 0.4);
    }

    .results-area {
      background: rgba(20, 20, 40, 0.95);
      border: 2px solid rgba(0, 255, 157, 0.4);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .result-card {
      background: linear-gradient(135deg, rgba(20, 20, 40, 0.9), rgba(30, 30, 60, 0.9));
      border-radius: 18px;
      padding: 30px;
      margin-bottom: 25px;
      border: 2px solid rgba(0, 255, 157, 0.4);
      border-left: 8px solid #00ff9d;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
      opacity: 0;
      transform: translateY(30px);
      animation: cardAppear 0.6s forwards;
    }

    @keyframes cardAppear {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .result-card:hover {
      transform: translateY(-10px);
      border-color: rgba(0, 255, 157, 0.7);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 255, 157, 0.15);
    }
  `;

  return (
    <div className="email-extractor-container">
      <style>{styles}</style>
      <div className="cyber-grid"></div>
      <div className="scan-line"></div>
      
      {/* Premium Header - Exact replica from original */}
      <header className="premium-header">
        <h1 className="main-title">
          <i className="fas fa-envelope"></i> EMAIL EXTRACTOR PRO
        </h1>
        <p className="subtitle">Sistemul Ultimate de Extragere Email - Analize Complete în Timp Real</p>
        
        <div className="status-bar">
          <div className="status-item">
            <div className="status-indicator"></div>
            <span className="hacker-text">SISTEM ONLINE</span>
          </div>
          <div className="status-item">
            <i className="fas fa-database" style={{color: '#00ff9d'}}></i>
            <span>{apiCalls} API-uri active</span>
          </div>
          <div className="status-item">
            <i className="fas fa-shield-alt" style={{color: '#00b4ff'}}></i>
            <span>Nivel amenințare: {threatLevel}%</span>
          </div>
          <div className="status-item">
            <i className="fas fa-bolt" style={{color: '#8a2be2'}}></i>
            <span>Extrase: {results.length} email-uri</span>
          </div>
        </div>
      </header>

      {/* Main Dashboard - Exact replica from original */}
      <div className="main-dashboard">
        {/* Left Control Panel */}
        <div className="control-panel">
          <div className="panel-section">
            <h3 className="section-title">
              <i className="fas fa-crosshairs"></i> CONFIGURARE TARGET
            </h3>
            
            <div className="input-group">
              <label className="input-label">
                <i className="fas fa-bullseye"></i> TARGET PRINCIPAL
              </label>
              <input 
                type="text" 
                className="target-input" 
                placeholder="Introdu Website / URL / Domeniu / Text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
              <div className="input-hint">
                Exemplu: https://example.com | company.com | text cu email-uri
              </div>
            </div>
            
            <div className="input-group">
              <label className="input-label">
                <i className="fas fa-filter"></i> MOD DE EXTRAGERE
              </label>
              <select 
                className="target-input"
                value={investigationMode}
                onChange={(e) => setInvestigationMode(e.target.value)}
              >
                <option value="stealth">🤫 MOD STEALTH (Low Profile)</option>
                <option value="aggressive">⚡ MOD AGGRESSIVE (Full Scan)</option>
                <option value="deep">🕵️ MOD DEEP (All Sources)</option>
                <option value="network">🌐 NETWORK INTEL (Complete)</option>
                <option value="social">👥 SOCIAL INTEL (Platforms)</option>
                <option value="security">🛡️ SECURITY AUDIT (Full)</option>
              </select>
            </div>
            
            <div className="input-group">
              <label className="input-label">
                <i className="fas fa-sliders-h"></i> SETĂRI AVANSATE
              </label>
              <div style={{display: 'flex', gap: '15px', marginTop: '10px'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0c0'}}>
                  <input 
                    type="checkbox" 
                    checked={geoTracking}
                    onChange={(e) => setGeoTracking(e.target.checked)}
                  /> Geo Tracking
                </label>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0c0'}}>
                  <input 
                    type="checkbox" 
                    checked={deepSearch}
                    onChange={(e) => setDeepSearch(e.target.checked)}
                  /> Deep Search
                </label>
              </div>
            </div>
          </div>

          {/* Tools Grid - Exact replica from original */}
          <div className="tools-grid">
            <button 
              className="tool-btn tool-btn-primary"
              onClick={handleExtract}
              disabled={isExtracting || !target.trim()}
            >
              <i className="fas fa-search"></i>
              <span>{isExtracting ? 'EXTRAGERE...' : 'EXTRAGE EMAIL-URI'}</span>
            </button>
            
            <button 
              className="tool-btn tool-btn-warning"
              onClick={clearResults}
              disabled={isExtracting}
            >
              <i className="fas fa-trash"></i>
              <span>ȘTERGE REZULTATE</span>
            </button>
            
            <button 
              className="tool-btn"
              onClick={() => exportResults('json')}
              disabled={results.length === 0}
            >
              <i className="fas fa-download"></i>
              <span>EXPORT JSON</span>
            </button>
            
            <button 
              className="tool-btn"
              onClick={() => exportResults('csv')}
              disabled={results.length === 0}
            >
              <i className="fas fa-file-csv"></i>
              <span>EXPORT CSV</span>
            </button>
            
            <button 
              className="tool-btn"
              onClick={() => exportResults('txt')}
              disabled={results.length === 0}
            >
              <i className="fas fa-file-alt"></i>
              <span>EXPORT TXT</span>
            </button>
            
            <button className="tool-btn tool-btn-danger">
              <i className="fas fa-bomb"></i>
              <span>ADVANCED SCAN</span>
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="results-area">
          <div className="results-header">
            <h2 className="results-title">
              <i className="fas fa-chart-line"></i> REZULTATE EXTRAGERE
            </h2>
            <div className="results-stats">
              {stats && (
                <>
                  <div className="stat-box">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">TOTAL</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">{stats.valid}</div>
                    <div className="stat-label">VALIDE</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">{stats.unique}</div>
                    <div className="stat-label">UNICE</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">{stats.byType.business}</div>
                    <div className="stat-label">BUSINESS</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="results-container" style={{maxHeight: '800px', overflowY: 'auto'}}>
            {results.length === 0 && !isExtracting && (
              <div style={{textAlign: 'center', padding: '50px', color: '#a0a0c0'}}>
                <i className="fas fa-inbox" style={{fontSize: '4em', marginBottom: '20px'}}></i>
                <h3>Niciun rezultat încă</h3>
                <p>Introdu un target și apasă EXTRAGE EMAIL-URI pentru a începe</p>
              </div>
            )}

            {isExtracting && (
              <div style={{textAlign: 'center', padding: '50px', color: '#00ff9d'}}>
                <i className="fas fa-spinner fa-spin" style={{fontSize: '4em', marginBottom: '20px'}}></i>
                <h3>Extragere în curs...</h3>
                <p>Vă rugăm așteptați</p>
              </div>
            )}

            {results.map((result, index) => (
              <div key={index} className="result-card" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="result-header">
                  <div className="result-title">
                    <i className="fas fa-envelope"></i>
                    {result.email}
                  </div>
                  <div className="result-badge" style={{
                    background: result.type === 'business' ? 'linear-gradient(135deg, #667eea, #764ba2)' :
                               result.type === 'personal' ? 'linear-gradient(135deg, #f093fb, #f5576c)' :
                               'linear-gradient(135deg, #4facfe, #00f2fe)'
                  }}>
                    {result.type.toUpperCase()}
                  </div>
                </div>
                
                <div style={{marginBottom: '15px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                    <span style={{color: '#a0a0c0'}}>Sursa:</span>
                    <span style={{color: '#00ff9d'}}>{result.source}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                    <span style={{color: '#a0a0c0'}}>Domeniu:</span>
                    <span style={{color: '#00b4ff'}}>{result.domain}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                    <span style={{color: '#a0a0c0'}}>Încredere:</span>
                    <span style={{color: result.confidence > 80 ? '#00ff9d' : result.confidence > 60 ? '#ffa502' : '#ff4757'}}>
                      {result.confidence}%
                    </span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{color: '#a0a0c0'}}>Timestamp:</span>
                    <span style={{color: '#8a2be2'}}>{new Date(result.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailExtractorsPro;