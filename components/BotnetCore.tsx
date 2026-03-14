
import React, { useState, useEffect } from 'react';
import { LogEntry, BotNode } from '../types';

interface BotnetCoreProps {
  addLog: (message: string, level: LogEntry['level']) => void;
  isAttacking: boolean;
}

const BOT_LOCATIONS: BotNode[] = [
  { id: 'WHOAMI-US-CLUSTER', country: 'United States', status: 'ONLINE', latency: 28, uptime: '45d', type: 'SERVER' },
  { id: 'WHOAMI-EU-CLUSTER', country: 'European Union', status: 'ONLINE', latency: 34, uptime: '112d', type: 'SERVER' },
  { id: 'WHOAMI-AS-CLUSTER', country: 'Asia Pacific', status: 'BUSY', latency: 110, uptime: '12d', type: 'IOT' },
  { id: 'WHOAMI-RU-CLUSTER', country: 'Russia/CIS', status: 'ONLINE', latency: 85, uptime: '89d', type: 'SERVER' },
  { id: 'WHOAMI-BR-CLUSTER', country: 'South America', status: 'ONLINE', latency: 140, uptime: '5d', type: 'IOT' },
  { id: 'WHOAMI-ME-CLUSTER', country: 'Middle East', status: 'ONLINE', latency: 95, uptime: '31d', type: 'DESKTOP' },
];

const BotnetCore: React.FC<BotnetCoreProps> = ({ addLog, isAttacking }) => {
  const [nodes, setNodes] = useState<BotNode[]>(BOT_LOCATIONS);
  const [totalNodes, setTotalNodes] = useState(800000);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalNodes(prev => prev + Math.floor(Math.random() * 100) - 50);
      setNodes(prev => prev.map(n => ({
        ...n,
        latency: Math.max(10, n.latency + Math.floor(Math.random() * 10) - 5)
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#050505] border border-white/5 p-4 rounded-lg flex flex-col items-center justify-center border-t-2 border-t-emerald-500">
          <span className="text-[7px] text-gray-600 uppercase font-black tracking-widest mb-1">Total Active Swarm</span>
          <span className="text-2xl font-black text-white italic tracking-tighter">{totalNodes.toLocaleString()}</span>
          <span className="text-[6px] text-emerald-500 font-black uppercase mt-1 animate-pulse">800K_Hybrid_Mesh_Active</span>
        </div>
        <div className="bg-[#050505] border border-white/5 p-4 rounded-lg flex flex-col items-center justify-center border-t-2 border-t-fuchsia-500">
          <span className="text-[7px] text-gray-600 uppercase font-black tracking-widest mb-1">Current Load</span>
          <span className={`text-2xl font-black italic tracking-tighter ${isAttacking ? 'text-fuchsia-500' : 'text-white'}`}>
            {isAttacking ? '98.4%' : '0.2%'}
          </span>
          <span className="text-[6px] text-gray-500 font-black uppercase mt-1">Swarm_Capacity_Buffer</span>
        </div>
        <div className="bg-[#050505] border border-white/5 p-4 rounded-lg flex flex-col items-center justify-center border-t-2 border-t-blue-500">
          <span className="text-[7px] text-gray-600 uppercase font-black tracking-widest mb-1">Global Latency</span>
          <span className="text-2xl font-black text-white italic tracking-tighter">
            {(nodes.reduce((acc, n) => acc + n.latency, 0) / nodes.length).toFixed(1)} ms
          </span>
          <span className="text-[6px] text-blue-500 font-black uppercase mt-1">Neural_Mesh_Sync_OK</span>
        </div>
      </div>

      <div className="bg-[#050505] border border-white/5 p-4 rounded-lg">
        <h3 className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Swarm Distribution Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {nodes.map(node => (
            <div key={node.id} className={`bg-black border p-3 rounded flex items-center gap-4 transition-all ${isAttacking ? 'border-fuchsia-600/30' : 'border-white/5 hover:border-emerald-500/30'}`}>
              <div className={`w-10 h-10 rounded border flex items-center justify-center ${isAttacking ? 'bg-fuchsia-600/10 border-fuchsia-600 text-fuchsia-500 shadow-[0_0_10px_#c026d3] animate-pulse' : 'bg-white/5 border-emerald-900 text-emerald-500'}`}>
                <i className={`fas ${node.type === 'SERVER' ? 'fa-server' : node.type === 'IOT' ? 'fa-microchip' : 'fa-desktop'} text-sm`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-[9px] font-black text-white uppercase truncate">{node.id}</h4>
                  <span className={`text-[6px] font-black px-1 rounded ${node.status === 'ONLINE' ? 'bg-emerald-600 text-black' : 'bg-orange-600 text-black'}`}>{node.status}</span>
                </div>
                <div className="flex justify-between text-[7px] text-gray-600 font-bold uppercase">
                  <span>{node.country}</span>
                  <span className="text-blue-500">{node.latency} ms</span>
                </div>
                <div className="mt-2 w-full bg-white/5 h-0.5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${isAttacking ? 'bg-fuchsia-600' : 'bg-emerald-500'}`} style={{ width: isAttacking ? '95%' : '5%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#050505] border border-white/5 p-4 rounded-lg">
        <h3 className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Neural Mesh Commands</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button onClick={() => addLog("SWARM_CMD: Synchronizing heartbeat cycles...", "warning")} className="bg-black border border-white/10 p-2 rounded text-[7px] text-white font-black uppercase hover:bg-emerald-600 hover:text-black transition-all">Sync_Heartbeat</button>
          <button onClick={() => addLog("SWARM_CMD: Rotating residential proxies...", "warning")} className="bg-black border border-white/10 p-2 rounded text-[7px] text-white font-black uppercase hover:bg-emerald-600 hover:text-black transition-all">Rotate_Proxies</button>
          <button onClick={() => addLog("SWARM_CMD: Purging stale nodes...", "warning")} className="bg-black border border-white/10 p-2 rounded text-[7px] text-white font-black uppercase hover:bg-emerald-600 hover:text-black transition-all">Purge_Stale</button>
          <button onClick={() => addLog("SWARM_CMD: Scaling neural visitor emulation...", "warning")} className="bg-black border border-white/10 p-2 rounded text-[7px] text-white font-black uppercase hover:bg-emerald-600 hover:text-black transition-all">Scale_Neural</button>
        </div>
      </div>
    </div>
  );
};

export default BotnetCore;
