import React, { useState, useEffect } from 'react';

interface ScanResult {
  id: string;
  ip: string;
  hostname: string;
  port: number;
  service: string;
  version: string;
  os: string;
  vulnerability: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: Date;
}

interface PowerLadonConfig {
  target: string;
  scanType: string;
  ports: string;
  threads: number;
  timeout: number;
  verbose: boolean;
}

const PowerLadonTool: React.FC = () => {
  const [config, setConfig] = useState<PowerLadonConfig>({
    target: '',
    scanType: 'OnlinePC',
    ports: '22,80,135,139,445,3389',
    threads: 100,
    timeout: 3000,
    verbose: false
  });
  
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [totalScanned, setTotalScanned] = useState(0);
  const [vulnerabilitiesFound, setVulnerabilitiesFound] = useState(0);

  // Original PowerLadon scan types from Ladon.ps1
  const scanTypes = [
    'OnlinePC', 'PortScan', 'WebScan', 'MS17010', 'SMBGhost', 
    'WebLogic', 'Tomcat', 'Struts2', 'Shiro', 'Spring',
    'ActiveMQ', 'Solr', 'WebService', 'Cisco', 'Jenkins',
    'RMI', 'LDAP', 'FTP', 'MYSQL', 'MSSQL', 'ORACLE', 'REDIS',
    'MongoDB', 'PostgreSQL', 'Elasticsearch', 'Memcache',
    'SNMP', 'SSH', 'Telnet', 'RDP', 'VNC'
  ];

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setScanLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Original PowerLadon simulation logic
  const simulatePowerLadonScan = async () => {
    if (!config.target.trim()) return;

    setIsScanning(true);
    setResults([]);
    setScanLogs([]);
    setScanProgress(0);
    setTotalScanned(0);
    setVulnerabilitiesFound(0);

    addLog(`🚀 Starting PowerLadon ${config.scanType} scan on ${config.target}`);
    addLog(`🔧 Configuration: Threads=${config.threads}, Timeout=${config.timeout}ms, Ports=${config.ports}`);

    // Simulate scan progress
    const totalSteps = 100;
    for (let step = 0; step <= totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setScanProgress(step);
      
      if (step % 10 === 0) {
        addLog(`📊 Scan progress: ${step}% complete`);
      }

      // Generate results at various progress points
      if (step % 15 === 0 && step > 0) {
        const newResults = generatePowerLadonResults(config.scanType, step);
        setResults(prev => [...prev, ...newResults]);
        setTotalScanned(prev => prev + newResults.length);
        
        const vulnCount = newResults.filter(r => r.severity !== 'LOW').length;
        setVulnerabilitiesFound(prev => prev + vulnCount);
        
        addLog(`🔍 Found ${newResults.length} new targets, ${vulnCount} with vulnerabilities`);
      }
    }

    addLog(`✅ PowerLadon scan completed successfully`);
    addLog(`📈 Total scanned: ${totalScanned + results.length}, Vulnerabilities: ${vulnerabilitiesFound}`);
    setIsScanning(false);
  };

  const generatePowerLadonResults = (scanType: string, step: number): ScanResult[] => {
    const results: ScanResult[] = [];
    const baseIP = config.target.includes('/') ? config.target.split('/')[0] : config.target;
    const ipBase = baseIP.split('.').slice(0, 3).join('.');
    
    const resultCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < resultCount; i++) {
      const ip = `${ipBase}.${Math.floor(Math.random() * 254) + 1}`;
      const hostname = `host-${step}-${i}.local`;
      const port = parseInt(config.ports.split(',')[Math.floor(Math.random() * config.ports.split(',').length)]);
      
      let service = 'Unknown';
      let version = 'Unknown';
      let os = 'Unknown';
      let vulnerability = 'None';
      let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

      // Original PowerLadon service detection logic
      switch (port) {
        case 22:
          service = 'SSH';
          version = 'OpenSSH 7.4';
          os = 'Linux';
          if (Math.random() > 0.7) {
            vulnerability = 'Weak password authentication';
            severity = 'HIGH';
          }
          break;
        case 80:
        case 8080:
          service = 'HTTP';
          version = 'Apache 2.4.41';
          os = 'Ubuntu';
          if (Math.random() > 0.6) {
            vulnerability = 'Outdated Apache version';
            severity = 'MEDIUM';
          }
          break;
        case 135:
          service = 'MSRPC';
          version = 'Windows RPC';
          os = 'Windows';
          if (scanType === 'MS17010' && Math.random() > 0.5) {
            vulnerability = 'MS17-010 EternalBlue';
            severity = 'CRITICAL';
          }
          break;
        case 445:
          service = 'SMB';
          version = 'SMB 3.1.1';
          os = 'Windows 10';
          if (scanType === 'MS17010' && Math.random() > 0.4) {
            vulnerability = 'MS17-010 EternalBlue';
            severity = 'CRITICAL';
          }
          break;
        case 3389:
          service = 'RDP';
          version = 'RDP 8.1';
          os = 'Windows Server';
          if (Math.random() > 0.8) {
            vulnerability = 'BlueKeep RDP vulnerability';
            severity = 'CRITICAL';
          }
          break;
        default:
          service = `Service-${port}`;
          version = 'Unknown version';
          os = 'Unknown OS';
      }

      // Specific vulnerability detection based on scan type
      if (scanType === 'WebLogic' && (port === 7001 || port === 7002)) {
        vulnerability = 'WebLogic deserialization vulnerability';
        severity = 'CRITICAL';
      } else if (scanType === 'Tomcat' && port === 8080) {
        vulnerability = 'Tomcat manager weak credentials';
        severity = 'HIGH';
      } else if (scanType === 'Struts2' && port === 8080) {
        vulnerability = 'Apache Struts2 RCE';
        severity = 'CRITICAL';
      } else if (scanType === 'Jenkins' && port === 8080) {
        vulnerability = 'Jenkins unauthorized access';
        severity = 'HIGH';
      }

      results.push({
        id: `${ip}-${port}-${Date.now()}-${i}`,
        ip,
        hostname,
        port,
        service,
        version,
        os,
        vulnerability,
        severity,
        timestamp: new Date()
      });
    }

    return results;
  };

  const handleExportResults = () => {
    const exportData = {
      scanConfig: config,
      results,
      scanLogs,
      exportDate: new Date().toISOString(),
      totalResults: results.length,
      vulnerabilitiesBySeverity: {
        CRITICAL: results.filter(r => r.severity === 'CRITICAL').length,
        HIGH: results.filter(r => r.severity === 'HIGH').length,
        MEDIUM: results.filter(r => r.severity === 'MEDIUM').length,
        LOW: results.filter(r => r.severity === 'LOW').length
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `powerladon-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearResults = () => {
    setResults([]);
    setScanLogs([]);
    setScanProgress(0);
    setTotalScanned(0);
    setVulnerabilitiesFound(0);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '#ff0000';
      case 'HIGH': return '#ff6600';
      case 'MEDIUM': return '#ffaa00';
      case 'LOW': return '#00ff00';
      default: return '#ffffff';
    }
  };

  // Original PowerLadon styling
  const styles = `
    .powerladon-container {
      height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      color: #00ff00;
      font-family: 'Courier New', monospace;
      overflow: hidden;
    }

    .powerladon-header {
      background: linear-gradient(90deg, #ff0000, #ff6600, #ffff00);
      padding: 20px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(255, 0, 0, 0.5);
      animation: headerGlow 2s ease-in-out infinite alternate;
    }

    @keyframes headerGlow {
      0% { box-shadow: 0 4px 20px rgba(255, 0, 0, 0.5); }
      100% { box-shadow: 0 4px 30px rgba(255, 102, 0, 0.8); }
    }

    .powerladon-title {
      font-size: 28px;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0 0 10px #ff0000;
      margin-bottom: 10px;
    }

    .powerladon-subtitle {
      font-size: 14px;
      color: #ffffff;
      opacity: 0.9;
    }

    .powerladon-main {
      display: flex;
      height: calc(100vh - 100px);
      gap: 20px;
      padding: 20px;
    }

    .powerladon-control-panel {
      width: 350px;
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
      border: 2px solid #ff0000;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 10px 30px rgba(255, 0, 0, 0.3);
    }

    .control-section {
      margin-bottom: 25px;
    }

    .control-title {
      color: #ff6600;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .control-input {
      width: 100%;
      background: #0a0a0a;
      color: #00ff00;
      border: 1px solid #ff0000;
      padding: 10px;
      border-radius: 5px;
      font-family: inherit;
      font-size: 12px;
      margin-bottom: 10px;
    }

    .control-input:focus {
      outline: none;
      border-color: #ff6600;
      box-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
    }

    .control-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #00ff00;
      font-size: 12px;
      margin-bottom: 10px;
    }

    .scan-button {
      width: 100%;
      background: linear-gradient(135deg, #ff0000, #ff6600);
      color: #ffffff;
      border: none;
      padding: 15px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .scan-button:hover:not(:disabled) {
      background: linear-gradient(135deg, #ff6600, #ffff00);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 102, 0, 0.4);
    }

    .scan-button:disabled {
      background: #333333;
      color: #666666;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .progress-container {
      margin-top: 15px;
    }

    .progress-bar {
      width: 100%;
      height: 20px;
      background: #0a0a0a;
      border: 1px solid #ff0000;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff0000, #ff6600, #ffff00);
      transition: width 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: progressShine 2s infinite;
    }

    @keyframes progressShine {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    .progress-text {
      text-align: center;
      margin-top: 5px;
      font-size: 12px;
      color: #00ff00;
    }

    .stats-panel {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 15px;
    }

    .stat-box {
      background: rgba(0, 0, 0, 0.7);
      border: 1px solid #ff0000;
      border-radius: 5px;
      padding: 10px;
      text-align: center;
    }

    .stat-value {
      font-size: 18px;
      font-weight: bold;
      color: #00ff00;
    }

    .stat-label {
      font-size: 10px;
      color: #888888;
      margin-top: 2px;
    }

    .powerladon-results {
      flex: 1;
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
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
      padding-bottom: 10px;
      border-bottom: 2px solid #ff0000;
    }

    .results-title {
      color: #ff6600;
      font-size: 20px;
      font-weight: bold;
    }

    .results-controls {
      display: flex;
      gap: 10px;
    }

    .control-button {
      background: #0a0a0a;
      color: #00ff00;
      border: 1px solid #00ff00;
      padding: 8px 12px;
      border-radius: 3px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .control-button:hover {
      background: #00ff00;
      color: #000000;
    }

    .results-grid {
      flex: 1;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
    }

    .result-card {
      background: linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(40, 40, 40, 0.9));
      border: 2px solid #ff0000;
      border-radius: 8px;
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
      margin-bottom: 10px;
    }

    .result-ip {
      font-size: 16px;
      font-weight: bold;
      color: #00ff00;
      font-family: 'Courier New', monospace;
    }

    .result-severity {
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .result-details {
      font-size: 12px;
      line-height: 1.4;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }

    .detail-label {
      color: #888888;
      font-weight: bold;
    }

    .detail-value {
      color: #ffffff;
      text-align: right;
      max-width: 60%;
      word-wrap: break-word;
    }

    .vulnerability-alert {
      background: rgba(255, 0, 0, 0.1);
      border: 1px solid #ff0000;
      border-radius: 3px;
      padding: 8px;
      margin-top: 10px;
    }

    .vulnerability-title {
      color: #ff0000;
      font-size: 11px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .vulnerability-desc {
      color: #ffaa00;
      font-size: 10px;
      line-height: 1.3;
    }

    .scan-logs {
      background: #000000;
      border: 1px solid #333333;
      border-radius: 5px;
      padding: 10px;
      margin-top: 15px;
      max-height: 150px;
      overflow-y: auto;
      font-family: 'Courier New', monospace;
      font-size: 11px;
    }

    .log-entry {
      color: #00ff00;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .no-results {
      text-align: center;
      padding: 40px;
      color: #888888;
    }

    .no-results-icon {
      font-size: 48px;
      margin-bottom: 15px;
      opacity: 0.5;
    }
  `;

  return (
    <div className="powerladon-container">
      <style>{styles}</style>
      
      {/* Header - Exact replica of original PowerLadon */}
      <header className="powerladon-header">
        <div className="powerladon-title">⚡ PowerLadon Network Scanner</div>
        <div className="powerladon-subtitle">Advanced Network Reconnaissance & Vulnerability Assessment Tool</div>
      </header>

      <div className="powerladon-main">
        {/* Control Panel */}
        <div className="powerladon-control-panel">
          <div className="control-section">
            <div className="control-title">🎯 Target Configuration</div>
            <input
              type="text"
              className="control-input"
              placeholder="192.168.1.1 or 192.168.1.0/24"
              value={config.target}
              onChange={(e) => setConfig(prev => ({ ...prev, target: e.target.value }))}
              disabled={isScanning}
            />
          </div>

          <div className="control-section">
            <div className="control-title">🔍 Scan Type</div>
            <select
              className="control-input"
              value={config.scanType}
              onChange={(e) => setConfig(prev => ({ ...prev, scanType: e.target.value }))}
              disabled={isScanning}
            >
              {scanTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="control-section">
            <div className="control-title">🔧 Advanced Options</div>
            <input
              type="text"
              className="control-input"
              placeholder="22,80,135,139,445,3389"
              value={config.ports}
              onChange={(e) => setConfig(prev => ({ ...prev, ports: e.target.value }))}
              disabled={isScanning}
            />
            <input
              type="number"
              className="control-input"
              placeholder="Threads (100)"
              value={config.threads}
              onChange={(e) => setConfig(prev => ({ ...prev, threads: parseInt(e.target.value) || 100 }))}
              disabled={isScanning}
              min="1"
              max="1000"
            />
            <input
              type="number"
              className="control-input"
              placeholder="Timeout ms (3000)"
              value={config.timeout}
              onChange={(e) => setConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) || 3000 }))}
              disabled={isScanning}
              min="1000"
              max="30000"
            />
            <label className="control-checkbox">
              <input
                type="checkbox"
                checked={config.verbose}
                onChange={(e) => setConfig(prev => ({ ...prev, verbose: e.target.checked }))}
                disabled={isScanning}
              />
              Verbose Mode
            </label>
          </div>

          <div className="control-section">
            <button
              className="scan-button"
              onClick={simulatePowerLadonScan}
              disabled={isScanning || !config.target.trim()}
            >
              {isScanning ? '⏸️ SCANNING...' : '⚡ START SCAN'}
            </button>

            {isScanning && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                <div className="progress-text">{scanProgress}% Complete</div>
              </div>
            )}

            <div className="stats-panel">
              <div className="stat-box">
                <div className="stat-value">{totalScanned}</div>
                <div className="stat-label">SCANNED</div>
              </div>
              <div className="stat-box">
                <div className="stat-value" style={{color: '#ff0000'}}>{vulnerabilitiesFound}</div>
                <div className="stat-label">VULNERABILITIES</div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="powerladon-results">
          <div className="results-header">
            <div className="results-title">📊 Scan Results ({results.length})</div>
            <div className="results-controls">
              <button className="control-button" onClick={handleExportResults}>
                💾 Export
              </button>
              <button className="control-button" onClick={handleClearResults}>
                🗑️ Clear
              </button>
            </div>
          </div>

          <div className="results-grid">
            {results.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <div>No scan results yet</div>
                <div style={{fontSize: '12px', marginTop: '10px', color: '#888'}}>
                  Start a scan to discover network targets and vulnerabilities
                </div>
              </div>
            ) : (
              results.map((result) => (
                <div key={result.id} className="result-card">
                  <div className="result-header">
                    <div className="result-ip">{result.ip}:{result.port}</div>
                    <div 
                      className="result-severity" 
                      style={{backgroundColor: getSeverityColor(result.severity), color: '#000'}}
                    >
                      {result.severity}
                    </div>
                  </div>
                  
                  <div className="result-details">
                    <div className="detail-row">
                      <span className="detail-label">Service:</span>
                      <span className="detail-value">{result.service}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Version:</span>
                      <span className="detail-value">{result.version}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">OS:</span>
                      <span className="detail-value">{result.os}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Hostname:</span>
                      <span className="detail-value">{result.hostname}</span>
                    </div>
                  </div>

                  {result.vulnerability !== 'None' && (
                    <div className="vulnerability-alert">
                      <div className="vulnerability-title">🚨 VULNERABILITY DETECTED</div>
                      <div className="vulnerability-desc">{result.vulnerability}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {scanLogs.length > 0 && (
            <div className="scan-logs">
              {scanLogs.map((log, index) => (
                <div key={index} className="log-entry">{log}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PowerLadonTool;