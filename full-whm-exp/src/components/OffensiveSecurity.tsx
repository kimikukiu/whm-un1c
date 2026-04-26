import React, { useState, useEffect } from 'react';
import { offensiveSecurityService, OffensiveTool, ToolExecutionResult, NetworkScanResult } from '../services/offensiveSecurityService';
import { LogEntry } from '../types';

interface OffensiveSecurityProps {
  addLog: (message: string, level: LogEntry['level']) => void;
}

const OffensiveSecurity: React.FC<OffensiveSecurityProps> = ({ addLog }) => {
  const [availableTools, setAvailableTools] = useState<OffensiveTool[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<ToolExecutionResult[]>([]);
  const [activeTab, setActiveTab] = useState<'tools' | 'scanner' | 'advanced' | 'history'>('tools');
  const [scanTarget, setScanTarget] = useState('');
  const [scanResults, setScanResults] = useState<NetworkScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Listen for tool selection events from sidebar
  useEffect(() => {
    const handleToolSelect = (event: CustomEvent) => {
      const toolId = event.detail;
      setActiveTab('advanced');
      setSelectedTool(toolId);
      setParameters({});
    };

    window.addEventListener('selectTool', handleToolSelect as EventListener);
    return () => {
      window.removeEventListener('selectTool', handleToolSelect as EventListener);
    };
  }, []);

  useEffect(() => {
    loadAvailableTools();
    loadExecutionHistory();
  }, []);

  const loadAvailableTools = async () => {
    try {
      const tools = await offensiveSecurityService.getAvailableTools();
      setAvailableTools(tools);
      if (tools.length > 0 && !selectedTool) {
        setSelectedTool(tools[0].id);
      }
    } catch (error) {
      addLog(`Failed to load tools: ${error}`, 'error');
    }
  };

  const loadExecutionHistory = async () => {
    try {
      const history = await offensiveSecurityService.getToolHistory();
      setExecutionResults(history);
    } catch (error) {
      addLog(`Failed to load execution history: ${error}`, 'error');
    }
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setParameters({});
  };

  const handleParameterChange = (paramName: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const executeTool = async () => {
    if (!selectedTool || isExecuting) return;

    const tool = availableTools.find(t => t.id === selectedTool);
    if (!tool) return;

    setIsExecuting(true);
    addLog(`Executing ${tool.name}...`, 'info');

    try {
      const result = await offensiveSecurityService.executeTool(selectedTool, parameters);
      setExecutionResults(prev => [result, ...prev]);
      
      if (result.success) {
        addLog(`${tool.name} executed successfully`, 'success');
      } else {
        addLog(`${tool.name} failed: ${result.error}`, 'error');
      }
    } catch (error) {
      addLog(`Tool execution error: ${error}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  const runNetworkScan = async () => {
    if (!scanTarget || isScanning) return;

    setIsScanning(true);
    addLog(`Starting network scan on ${scanTarget}...`, 'info');

    try {
      const results = await offensiveSecurityService.networkScan(scanTarget);
      setScanResults(results);
      addLog(`Network scan completed. Found ${results.openPorts.length} open ports`, 'success');
    } catch (error) {
      addLog(`Network scan failed: ${error}`, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const getCurrentTool = () => {
    return availableTools.find(t => t.id === selectedTool);
  };

  const currentTool = getCurrentTool();

  return (
    <div className="space-y-4 animate-in">
      <div className="bg-[#050505] border border-white/5 p-6 rounded-lg shadow-2xl">
        <h3 className="text-xs font-black text-white uppercase italic tracking-tighter border-b border-white/5 pb-2 mb-4">
          Offensive Security Toolkit V8.6
        </h3>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-black/50 p-1 rounded">
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-2 text-[8px] font-black uppercase rounded transition-all ${
              activeTab === 'tools' 
                ? 'bg-emerald-600 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Basic Tools
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-4 py-2 text-[8px] font-black uppercase rounded transition-all ${
              activeTab === 'scanner' 
                ? 'bg-emerald-600 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Network Scanner
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-2 text-[8px] font-black uppercase rounded transition-all ${
              activeTab === 'advanced' 
                ? 'bg-emerald-600 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Advanced Tools
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-[8px] font-black uppercase rounded transition-all ${
              activeTab === 'history' 
                ? 'bg-emerald-600 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            History
          </button>
        </div>

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tool Selection */}
              <div className="space-y-4">
                <h4 className="text-[8px] font-black text-emerald-500 uppercase tracking-widest border-l-2 border-emerald-500 pl-2">
                  Available Tools
                </h4>
                <div className="space-y-2">
                  {availableTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => handleToolSelect(tool.id)}
                      className={`p-3 border rounded cursor-pointer transition-all ${
                        selectedTool === tool.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-[9px] font-black text-white uppercase">
                            {tool.name}
                          </div>
                          <div className="text-[7px] text-gray-500 mt-1">
                            {tool.description}
                          </div>
                        </div>
                        <div className={`px-2 py-1 text-[6px] font-black rounded ${
                          tool.category === 'checker' ? 'bg-blue-500/20 text-blue-400' :
                          tool.category === 'scanner' ? 'bg-green-500/20 text-green-400' :
                          tool.category === 'bruteforce' ? 'bg-red-500/20 text-red-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {tool.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parameters */}
              <div className="space-y-4">
                <h4 className="text-[8px] font-black text-blue-500 uppercase tracking-widest border-l-2 border-blue-500 pl-2">
                  Tool Configuration
                </h4>
                {currentTool && (
                  <div className="space-y-3">
                    <div className="text-[9px] font-black text-white">
                      {currentTool.name}
                    </div>
                    <div className="text-[7px] text-gray-500 mb-4">
                      {currentTool.description}
                    </div>
                    
                    {currentTool.parameters.map((param) => (
                      <div key={param.name} className="space-y-1">
                        <label className="text-[7px] text-gray-500 uppercase font-black">
                          {param.name} {param.required && <span className="text-red-500">*</span>}
                        </label>
                        {param.type === 'boolean' ? (
                          <input
                            type="checkbox"
                            checked={parameters[param.name] || false}
                            onChange={(e) => handleParameterChange(param.name, e.target.checked)}
                            className="accent-emerald-500"
                          />
                        ) : param.type === 'number' ? (
                          <input
                            type="number"
                            value={parameters[param.name] || param.default || ''}
                            onChange={(e) => handleParameterChange(param.name, e.target.value)}
                            className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none font-mono text-[8px]"
                            placeholder={param.description}
                          />
                        ) : (
                          <input
                            type="text"
                            value={parameters[param.name] || param.default || ''}
                            onChange={(e) => handleParameterChange(param.name, e.target.value)}
                            className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none font-mono text-[8px]"
                            placeholder={param.description}
                          />
                        )}
                      </div>
                    ))}
                    
                    <button
                      onClick={executeTool}
                      disabled={isExecuting}
                      className="w-full py-3 bg-emerald-600 text-black rounded font-black text-[10px] uppercase hover:bg-emerald-500 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExecuting ? 'EXECUTING...' : 'EXECUTE TOOL'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Network Scanner Tab */}
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-[8px] font-black text-emerald-500 uppercase tracking-widest border-l-2 border-emerald-500 pl-2">
                  Network Scanner
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[7px] text-gray-500 uppercase font-black">
                      Target Host/IP
                    </label>
                    <input
                      type="text"
                      value={scanTarget}
                      onChange={(e) => setScanTarget(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none font-mono text-[8px]"
                      placeholder="example.com or 192.168.1.1"
                    />
                  </div>
                  
                  <button
                    onClick={runNetworkScan}
                    disabled={isScanning || !scanTarget}
                    className="w-full py-3 bg-emerald-600 text-black rounded font-black text-[10px] uppercase hover:bg-emerald-500 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isScanning ? 'SCANNING...' : 'START SCAN'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[8px] font-black text-blue-500 uppercase tracking-widest border-l-2 border-blue-500 pl-2">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setScanTarget('localhost')}
                    className="w-full py-2 bg-black border border-white/10 rounded text-white text-[8px] font-black uppercase hover:border-white/20 transition-all"
                  >
                    Scan Localhost
                  </button>
                  <button
                    onClick={() => setScanTarget('192.168.1.1')}
                    className="w-full py-2 bg-black border border-white/10 rounded text-white text-[8px] font-black uppercase hover:border-white/20 transition-all"
                  >
                    Scan Router
                  </button>
                  <button
                    onClick={() => setScanTarget('google.com')}
                    className="w-full py-2 bg-black border border-white/10 rounded text-white text-[8px] font-black uppercase hover:border-white/20 transition-all"
                  >
                    Scan Google
                  </button>
                </div>
              </div>
            </div>

            {/* Scan Results */}
            {scanResults && (
              <div className="space-y-4">
                <h4 className="text-[8px] font-black text-purple-500 uppercase tracking-widest border-l-2 border-purple-500 pl-2">
                  Scan Results for {scanResults.target}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/50 border border-white/5 p-4 rounded">
                    <div className="text-[10px] font-black text-emerald-500">
                      {scanResults.openPorts.length}
                    </div>
                    <div className="text-[7px] text-gray-500 uppercase">
                      Open Ports
                    </div>
                  </div>
                  <div className="bg-black/50 border border-white/5 p-4 rounded">
                    <div className="text-[10px] font-black text-red-500">
                      {scanResults.vulnerabilities.length}
                    </div>
                    <div className="text-[7px] text-gray-500 uppercase">
                      Vulnerabilities
                    </div>
                  </div>
                  <div className="bg-black/50 border border-white/5 p-4 rounded">
                    <div className="text-[10px] font-black text-blue-500">
                      {scanResults.credentials.length}
                    </div>
                    <div className="text-[7px] text-gray-500 uppercase">
                      Credentials
                    </div>
                  </div>
                </div>

                {/* Open Ports */}
                {scanResults.openPorts.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[8px] font-black text-white uppercase">
                      Open Ports
                    </div>
                    <div className="space-y-1">
                      {scanResults.openPorts.map((port, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-black/30 border border-white/5 rounded">
                          <div className="text-[8px] text-white font-mono">
                            {port.port}/{port.state}
                          </div>
                          <div className="text-[7px] text-gray-500">
                            {port.service} {port.version}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vulnerabilities */}
                {scanResults.vulnerabilities.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[8px] font-black text-white uppercase">
                      Vulnerabilities
                    </div>
                    <div className="space-y-1">
                      {scanResults.vulnerabilities.map((vuln, index) => (
                        <div key={index} className="p-2 bg-black/30 border border-white/5 rounded">
                          <div className="flex justify-between items-center">
                            <div className="text-[8px] text-white font-black">
                              {vuln.title}
                            </div>
                            <div className={`px-2 py-1 text-[6px] font-black rounded ${
                              vuln.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                              vuln.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                              vuln.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {vuln.severity}
                            </div>
                          </div>
                          <div className="text-[7px] text-gray-500 mt-1">
                            {vuln.description}
                          </div>
                          {vuln.cve && (
                            <div className="text-[6px] text-emerald-500 mt-1 font-mono">
                              {vuln.cve}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Advanced Tools Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-[8px] font-black text-red-500 uppercase tracking-widest border-l-2 border-red-500 pl-2">
                  Advanced Offensive Tools
                </h4>
                <div className="space-y-2">
                  {availableTools
                    .filter(tool => tool.category === 'exploiter' || tool.category === 'advanced')
                    .map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => handleToolSelect(tool.id)}
                      className={`p-3 border rounded cursor-pointer transition-all ${
                        selectedTool === tool.id
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-[9px] font-black text-white uppercase">
                            {tool.name}
                          </div>
                          <div className="text-[7px] text-gray-500 mt-1">
                            {tool.description}
                          </div>
                        </div>
                        <div className={`px-2 py-1 text-[6px] font-black rounded bg-red-500/20 text-red-400`}>
                          {tool.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[8px] font-black text-purple-500 uppercase tracking-widest border-l-2 border-purple-500 pl-2">
                  Specialized Scanners
                </h4>
                <div className="space-y-2">
                  {availableTools
                    .filter(tool => tool.id.includes('email') || tool.id.includes('jscan') || tool.id.includes('dorks'))
                    .map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => handleToolSelect(tool.id)}
                      className={`p-3 border rounded cursor-pointer transition-all ${
                        selectedTool === tool.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-[9px] font-black text-white uppercase">
                            {tool.name}
                          </div>
                          <div className="text-[7px] text-gray-500 mt-1">
                            {tool.description}
                          </div>
                        </div>
                        <div className={`px-2 py-1 text-[6px] font-black rounded bg-purple-500/20 text-purple-400`}>
                          {tool.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tool Configuration for Advanced Tools */}
            {currentTool && (currentTool.category === 'exploiter' || currentTool.id.includes('email') || currentTool.id.includes('jscan') || currentTool.id.includes('dorks')) && (
              <div className="space-y-4">
                <h4 className="text-[8px] font-black text-orange-500 uppercase tracking-widest border-l-2 border-orange-500 pl-2">
                  Tool Configuration
                </h4>
                <div className="space-y-3">
                  <div className="text-[9px] font-black text-white">
                    {currentTool.name}
                  </div>
                  <div className="text-[7px] text-gray-500 mb-4">
                    {currentTool.description}
                  </div>
                  
                  {currentTool.parameters.map((param) => (
                    <div key={param.name} className="space-y-1">
                      <label className="text-[7px] text-gray-500 uppercase font-black">
                        {param.name} {param.required && <span className="text-red-500">*</span>}
                      </label>
                      {param.type === 'boolean' ? (
                        <input
                          type="checkbox"
                          checked={parameters[param.name] || false}
                          onChange={(e) => handleParameterChange(param.name, e.target.checked)}
                          className="accent-orange-500"
                        />
                      ) : param.type === 'number' ? (
                        <input
                          type="number"
                          value={parameters[param.name] || param.default || ''}
                          onChange={(e) => handleParameterChange(param.name, e.target.value)}
                          className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none font-mono text-[8px]"
                          placeholder={param.description}
                        />
                      ) : param.choices ? (
                        <select
                          value={parameters[param.name] || param.default || ''}
                          onChange={(e) => handleParameterChange(param.name, e.target.value)}
                          className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none font-mono text-[8px]"
                        >
                          {param.choices.map((choice) => (
                            <option key={choice} value={choice}>
                              {choice}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={parameters[param.name] || param.default || ''}
                          onChange={(e) => handleParameterChange(param.name, e.target.value)}
                          className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none font-mono text-[8px]"
                          placeholder={param.description}
                        />
                      )}
                    </div>
                  ))}
                  
                  <button
                    onClick={executeTool}
                    disabled={isExecuting}
                    className="w-full py-3 bg-orange-600 text-black rounded font-black text-[10px] uppercase hover:bg-orange-500 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExecuting ? 'EXECUTING...' : 'EXECUTE ADVANCED TOOL'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Advanced Tools Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Advanced Tool Selection */}
              <div className="space-y-4">
                <h4 className="text-[8px] font-black text-orange-500 uppercase tracking-widest border-l-2 border-orange-500 pl-2">
                  Advanced Offensive Tools
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableTools
                    .filter(tool => 
                      tool.id === 'its-l7-ddos' || 
                      tool.id === 'botnet-c2-controller' ||
                      tool.id === 'proxy-scraper' ||
                      tool.id === 'sqli-dorks-generator' ||
                      tool.id === 'http-browser-tool' ||
                      tool.id === 'jscan-vuln-scanner' ||
                      tool.id === 'hajime-botnet-tool' ||
                      tool.id === 'geoguard-protection' ||
                      tool.id === 'email-extractor-pro'
                    )
                    .map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => handleToolSelect(tool.id)}
                      className={`p-3 border rounded cursor-pointer transition-all ${
                        selectedTool === tool.id
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-[9px] font-black text-white uppercase">
                            {tool.name}
                          </div>
                          <div className="text-[7px] text-gray-500 mt-1">
                            {tool.description}
                          </div>
                          <div className="text-[6px] text-orange-400 mt-1 font-mono">
                            {tool.category.toUpperCase()}
                          </div>
                        </div>
                        <div className={`px-2 py-1 text-[6px] font-black rounded ${
                          tool.category === 'exploiter' ? 'bg-red-500/20 text-red-400' :
                          tool.category === 'scanner' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {tool.category.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tool Execution */}
              <div className="space-y-4">
                <h4 className="text-[8px] font-black text-emerald-500 uppercase tracking-widest border-l-2 border-emerald-500 pl-2">
                  Tool Configuration
                </h4>
                
                {selectedTool && (() => {
                  const tool = availableTools.find(t => t.id === selectedTool);
                  if (!tool) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div className="p-3 bg-black/30 border border-white/10 rounded">
                        <div className="text-[9px] font-black text-white uppercase mb-2">
                          {tool.name}
                        </div>
                        <div className="text-[7px] text-gray-500 mb-4">
                          {tool.description}
                        </div>
                        
                        {tool.parameters.map((param) => (
                          <div key={param.name} className="space-y-2 mb-4">
                            <label className="text-[8px] font-black text-white uppercase">
                              {param.name} {param.required && <span className="text-red-500">*</span>}
                            </label>
                            
                            {param.choices ? (
                              <select
                                value={parameters[param.name] || param.default || ''}
                                onChange={(e) => handleParameterChange(param.name, e.target.value)}
                                className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none font-mono text-[8px]"
                              >
                                <option value="">Select {param.name}</option>
                                {param.choices.map((choice) => (
                                  <option key={choice} value={choice}>{choice}</option>
                                ))}
                              </select>
                            ) : param.type === 'boolean' ? (
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={parameters[param.name] || param.default || false}
                                  onChange={(e) => handleParameterChange(param.name, e.target.checked)}
                                  className="rounded"
                                />
                                <span className="text-[8px] text-white">Enable {param.name}</span>
                              </label>
                            ) : (
                              <input
                                type={param.type === 'number' ? 'number' : 'text'}
                                value={parameters[param.name] || param.default || ''}
                                onChange={(e) => handleParameterChange(param.name, e.target.value)}
                                className="w-full bg-black border border-white/10 rounded p-2 text-white outline-none font-mono text-[8px]"
                                placeholder={param.description}
                              />
                            )}
                          </div>
                        ))}
                        
                        <button
                          onClick={executeTool}
                          disabled={isExecuting}
                          className="w-full py-3 bg-orange-600 text-black rounded font-black text-[10px] uppercase hover:bg-orange-500 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isExecuting ? 'EXECUTING...' : 'EXECUTE ADVANCED TOOL'}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Tool Output */}
            {executionResults.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[8px] font-black text-emerald-500 uppercase tracking-widest border-l-2 border-emerald-500 pl-2">
                  Execution Results
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {executionResults.slice(-5).map((result, index) => (
                    <div key={index} className="p-3 bg-black/30 border border-white/5 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-[8px] font-black text-white">
                          {result.toolId}
                        </div>
                        <div className={`px-2 py-1 text-[6px] font-black rounded ${
                          result.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {result.success ? 'SUCCESS' : 'FAILED'}
                        </div>
                      </div>
                      <div className="text-[7px] text-gray-500 mb-2 font-mono">
                        {result.timestamp}
                      </div>
                      {result.output && (
                        <div className="text-[7px] text-emerald-400 bg-black/50 p-2 rounded font-mono max-h-32 overflow-y-auto">
                          {result.output}
                        </div>
                      )}
                      {result.error && (
                        <div className="text-[7px] text-red-400 bg-red-500/10 p-2 rounded font-mono">
                          {result.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h4 className="text-[8px] font-black text-purple-500 uppercase tracking-widest border-l-2 border-purple-500 pl-2">
              Execution History
            </h4>
            
            {executionResults.length === 0 ? (
              <div className="text-[8px] text-gray-500 text-center py-8">
                No execution history available
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {executionResults.map((result, index) => (
                  <div key={index} className="p-3 bg-black/30 border border-white/5 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-[8px] font-black text-white">
                        {result.toolId}
                      </div>
                      <div className={`px-2 py-1 text-[6px] font-black rounded ${
                        result.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {result.success ? 'SUCCESS' : 'FAILED'}
                      </div>
                    </div>
                    <div className="text-[7px] text-gray-500 mb-2 font-mono">
                      {result.timestamp}
                    </div>
                    {result.output && (
                      <div className="text-[7px] text-emerald-400 bg-black/50 p-2 rounded font-mono max-h-32 overflow-y-auto">
                        {result.output}
                      </div>
                    )}
                    {result.error && (
                      <div className="text-[7px] text-red-400 bg-red-500/10 p-2 rounded font-mono">
                        {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffensiveSecurity;