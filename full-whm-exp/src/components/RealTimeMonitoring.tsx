import React, { useState, useEffect } from 'react';
import { LogEntry } from '../types';

interface SystemStatus {
  cpu: number;
  memory: number;
  network: number;
  disk: number;
  temperature: number;
  uptime: string;
  activeProcesses: number;
  errorRate: number;
}

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  component: string;
  message: string;
  recoveryAction?: string;
  status: 'detected' | 'analyzing' | 'repairing' | 'resolved' | 'failed';
}

interface RealTimeMonitoringProps {
  addLog: (message: string, level: LogEntry['level']) => void;
}

const RealTimeMonitoring: React.FC<RealTimeMonitoringProps> = ({ addLog }) => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpu: 0,
    memory: 0,
    network: 0,
    disk: 0,
    temperature: 0,
    uptime: '00:00:00',
    activeProcesses: 0,
    errorRate: 0
  });

  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [autoRecovery, setAutoRecovery] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(80);

  // Simulate real-time system monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Simulate system metrics
      const newStatus: SystemStatus = {
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 100),
        disk: Math.floor(Math.random() * 100),
        temperature: Math.floor(Math.random() * 30) + 40,
        uptime: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString().substr(11, 8),
        activeProcesses: Math.floor(Math.random() * 500) + 100,
        errorRate: Math.floor(Math.random() * 5)
      };

      setSystemStatus(newStatus);

      // Generate random errors for demonstration
      if (Math.random() < 0.1) {
        generateRandomError();
      }

      // Check thresholds and trigger alerts
      checkThresholds(newStatus);
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring, alertThreshold]);

  const generateRandomError = () => {
    const errorTypes = [
      { component: 'AI Engine', level: 'error' as const, message: 'Model inference timeout' },
      { component: 'Network Scanner', level: 'warning' as const, message: 'Connection refused to target' },
      { component: 'Database', level: 'critical' as const, message: 'Connection pool exhausted' },
      { component: 'Memory Manager', level: 'error' as const, message: 'Memory allocation failed' },
      { component: 'Security Module', level: 'warning' as const, message: 'Suspicious activity detected' },
      { component: 'File System', level: 'error' as const, message: 'Permission denied for operation' }
    ];

    const error = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    
    const newError: ErrorLog = {
      id: `error-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: error.level,
      component: error.component,
      message: error.message,
      status: 'detected'
    };

    setErrorLogs(prev => [newError, ...prev]);
    addLog(`🚨 ${error.level.toUpperCase()}: ${error.component} - ${error.message}`, error.level);

    // Auto-recovery
    if (autoRecovery) {
      setTimeout(() => {
        attemptAutoRecovery(newError);
      }, 2000);
    }
  };

  const checkThresholds = (status: SystemStatus) => {
    const alerts = [];
    
    if (status.cpu > alertThreshold) {
      alerts.push(`CPU usage critical: ${status.cpu}%`);
    }
    if (status.memory > alertThreshold) {
      alerts.push(`Memory usage critical: ${status.memory}%`);
    }
    if (status.temperature > 70) {
      alerts.push(`Temperature high: ${status.temperature}°C`);
    }
    if (status.errorRate > 3) {
      alerts.push(`Error rate elevated: ${status.errorRate}%`);
    }

    alerts.forEach(alert => {
      addLog(`⚠️ THRESHOLD: ${alert}`, 'warning');
    });
  };

  const attemptAutoRecovery = async (error: ErrorLog) => {
    setErrorLogs(prev => prev.map(e => 
      e.id === error.id ? { ...e, status: 'analyzing' } : e
    ));

    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 1500));

    setErrorLogs(prev => prev.map(e => 
      e.id === error.id ? { ...e, status: 'repairing' } : e
    ));

    // Simulate repair attempts
    const recoveryActions = [
      'Restarting service',
      'Clearing cache',
      'Resetting connection',
      'Reallocating resources',
      'Applying patch',
      'Updating configuration'
    ];

    const recoveryAction = recoveryActions[Math.floor(Math.random() * recoveryActions.length)];

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 80% success rate for auto-recovery
    const success = Math.random() < 0.8;

    setErrorLogs(prev => prev.map(e => 
      e.id === error.id ? {
        ...e,
        status: success ? 'resolved' : 'failed',
        recoveryAction: success ? recoveryAction : 'Recovery failed - manual intervention required'
      } : e
    ));

    addLog(
      success ? 
        `✅ Auto-recovery successful: ${error.component} - ${recoveryAction}` :
        `❌ Auto-recovery failed: ${error.component} - Manual intervention required`,
      success ? 'success' : 'error'
    );
  };

  const getStatusColor = (value: number, threshold: number = 80) => {
    if (value > threshold) return 'text-red-400';
    if (value > threshold * 0.7) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  const getErrorLevelColor = (level: ErrorLog['level']) => {
    const colors = {
      info: 'text-blue-400',
      warning: 'text-yellow-400',
      error: 'text-red-400',
      critical: 'text-purple-400'
    };
    return colors[level];
  };

  const getStatusIcon = (status: ErrorLog['status']) => {
    const icons = {
      detected: '🔍',
      analyzing: '⚡',
      repairing: '🔧',
      resolved: '✅',
      failed: '❌'
    };
    return icons[status];
  };

  return (
    <div className="space-y-4 animate-in">
      <div className="bg-[#050505] border border-white/5 p-6 rounded-lg shadow-2xl">
        <h3 className="text-xs font-black text-white uppercase italic tracking-tighter border-b border-white/5 pb-2 mb-4">
          📊 Real-Time System Monitoring V8.6
        </h3>

        {/* Control Panel */}
        <div className="bg-black/50 p-4 rounded-lg border border-emerald-500/20 mb-6">
          <h4 className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-3">System Controls</h4>
          
          <div className="flex space-x-3 mb-4">
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`px-4 py-2 rounded font-black text-[8px] uppercase transition-all ${
                isMonitoring 
                  ? 'bg-red-600 text-white hover:bg-red-500' 
                  : 'bg-emerald-600 text-black hover:bg-emerald-500'
              }`}
            >
              {isMonitoring ? '⏸️ Stop Monitoring' : '▶️ Start Monitoring'}
            </button>

            <button
              onClick={() => setAutoRecovery(!autoRecovery)}
              className={`px-4 py-2 rounded font-black text-[8px] uppercase transition-all ${
                autoRecovery 
                  ? 'bg-blue-600 text-white hover:bg-blue-500' 
                  : 'bg-gray-600 text-white hover:bg-gray-500'
              }`}
            >
              {autoRecovery ? '🔄 Auto-Recovery ON' : '⚠️ Auto-Recovery OFF'}
            </button>

            <select
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
              className="bg-black border border-white/10 rounded p-2 text-white outline-none text-[8px]"
            >
              <option value={60}>Alert: 60%</option>
              <option value={70}>Alert: 70%</option>
              <option value={80}>Alert: 80%</option>
              <option value={90}>Alert: 90%</option>
            </select>
          </div>

          <div className="text-[6px] text-gray-400">
            Status: {isMonitoring ? '🟢 Active' : '🔴 Inactive'} | 
            Auto-Recovery: {autoRecovery ? '✅ Enabled' : '❌ Disabled'} | 
            Alert Threshold: {alertThreshold}%
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/30 p-4 rounded border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[8px] text-gray-400 uppercase">CPU</span>
              <span className={`text-[10px] font-black ${getStatusColor(systemStatus.cpu)}`}>
                {systemStatus.cpu}%
              </span>
            </div>
            <div className="w-full bg-black rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  systemStatus.cpu > 80 ? 'bg-red-500' :
                  systemStatus.cpu > 60 ? 'bg-yellow-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${systemStatus.cpu}%` }}
              />
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[8px] text-gray-400 uppercase">Memory</span>
              <span className={`text-[10px] font-black ${getStatusColor(systemStatus.memory)}`}>
                {systemStatus.memory}%
              </span>
            </div>
            <div className="w-full bg-black rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  systemStatus.memory > 80 ? 'bg-red-500' :
                  systemStatus.memory > 60 ? 'bg-yellow-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${systemStatus.memory}%` }}
              />
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[8px] text-gray-400 uppercase">Network</span>
              <span className={`text-[10px] font-black ${getStatusColor(systemStatus.network)}`}>
                {systemStatus.network}%
              </span>
            </div>
            <div className="w-full bg-black rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  systemStatus.network > 80 ? 'bg-red-500' :
                  systemStatus.network > 60 ? 'bg-yellow-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${systemStatus.network}%` }}
              />
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[8px] text-gray-400 uppercase">Disk</span>
              <span className={`text-[10px] font-black ${getStatusColor(systemStatus.disk)}`}>
                {systemStatus.disk}%
              </span>
            </div>
            <div className="w-full bg-black rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  systemStatus.disk > 80 ? 'bg-red-500' :
                  systemStatus.disk > 60 ? 'bg-yellow-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${systemStatus.disk}%` }}
              />
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/30 p-4 rounded border border-white/10">
            <div className="text-[6px] text-gray-400 uppercase">Temperature</div>
            <div className={`text-[10px] font-black ${getStatusColor(systemStatus.temperature, 70)}`}>
              {systemStatus.temperature}°C
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded border border-white/10">
            <div className="text-[6px] text-gray-400 uppercase">Uptime</div>
            <div className="text-[10px] font-black text-emerald-400">
              {systemStatus.uptime}
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded border border-white/10">
            <div className="text-[6px] text-gray-400 uppercase">Processes</div>
            <div className="text-[10px] font-black text-blue-400">
              {systemStatus.activeProcesses}
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded border border-white/10">
            <div className="text-[6px] text-gray-400 uppercase">Error Rate</div>
            <div className={`text-[10px] font-black ${getStatusColor(systemStatus.errorRate * 20, 60)}`}>
              {systemStatus.errorRate}%
            </div>
          </div>
        </div>

        {/* Error Recovery Log */}
        {errorLogs.length > 0 && (
          <div className="bg-black/30 p-4 rounded border border-white/10">
            <h4 className="text-[8px] font-black text-red-400 uppercase tracking-widest mb-3">Error Recovery Log</h4>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {errorLogs.map((error) => (
                <div key={error.id} className="bg-black/50 p-3 rounded border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px]">{getStatusIcon(error.status)}</span>
                      <span className={`text-[8px] font-black ${getErrorLevelColor(error.level)}`}>
                        {error.level.toUpperCase()}
                      </span>
                      <span className="text-[8px] text-white">{error.component}</span>
                    </div>
                    <span className="text-[6px] text-gray-400">
                      {new Date(error.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="text-[7px] text-gray-300 mb-2">
                    {error.message}
                  </div>
                  
                  {error.recoveryAction && (
                    <div className="text-[6px] text-emerald-400">
                      🔧 Recovery: {error.recoveryAction}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Features */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20">
          <h5 className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-3">⚡ Advanced Monitoring Features</h5>
          
          <div className="grid grid-cols-2 gap-3 text-[7px]">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">🔄</span>
              <span className="text-gray-300">Auto-Recovery System</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📊</span>
              <span className="text-gray-300">Real-time Metrics</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⚠️</span>
              <span className="text-gray-300">Threshold Alerts</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-pink-400">📈</span>
              <span className="text-gray-300">Performance Tracking</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-red-400">🛡️</span>
              <span className="text-gray-300">Error Detection</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">📱</span>
              <span className="text-gray-300">Mobile Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoring;