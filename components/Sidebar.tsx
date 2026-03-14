
import React from 'react';
import { AppTab, NetworkConfig } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  target?: string;
  isUp?: boolean;
  isAttacking?: boolean;
  netConfig?: NetworkConfig;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, target = "NONE", isUp = true, isAttacking = false, netConfig }) => {
  const menuItems = [
    { id: AppTab.DASHBOARD, label: 'Control Center', icon: 'fa-microchip' },
    { id: AppTab.QUANTUM_INTELLIGENCE, label: 'Quantum Intel', icon: 'fa-atom' },
    { id: AppTab.OSINT_DASHBOARD, label: 'OSINT Dashboard', icon: 'fa-globe' },
    { id: AppTab.EXTRACTOR, label: 'Deep Extractor', icon: 'fa-user-secret' },
    { id: AppTab.SQL_INJECT, label: 'Payload Vault', icon: 'fa-database' },
    { id: AppTab.NETWORK, label: 'Attack Console', icon: 'fa-satellite-dish' },
    { id: AppTab.ZXCDDOS, label: 'ZxCDDoS', icon: 'fa-bolt' },
    { id: AppTab.IDE_TOOL, label: 'Quantum IDE', icon: 'fa-code' },
    { id: AppTab.BOTNET_CORE, label: 'Zombie Swarm', icon: 'fa-users-rays' },
    { id: AppTab.KIMIKUKIU_TOOLS, label: 'Kimikukiu Repos', icon: 'fa-folder-tree' },
    { id: AppTab.WHOAMISEC_GPT, label: 'WHOAMISEC GPT', icon: 'fa-brain' },
    { id: AppTab.MEDIA_CREATOR, label: 'Media Forge', icon: 'fa-photo-film' },
    { id: AppTab.SETTINGS, label: 'Kernel Config', icon: 'fa-sliders' },
  ];

  const externalTools = [
    { label: 'GPT CHAT', icon: 'fa-robot', url: '/gpt-tool', color: 'text-[#00ffc3]' },
    { label: 'IDE', icon: 'fa-laptop-code', url: '/ide-tool', color: 'text-[#ffaa00]' },
    { label: 'SOLANA', icon: 'fa-link', url: '/solana-tool', color: 'text-[#aa00ff]' },
    { label: 'DEPLOYER', icon: 'fa-rocket', url: '/deployer-tool', color: 'text-[#ff5e00]' },
    { label: 'QUANTUM', icon: 'fa-atom', url: '/quantum-tool', color: 'text-[#00ffff]' },
    { label: 'SCANNER', icon: 'fa-search', url: '/scanner-tool', color: 'text-[#ff00ff]' },
    { label: 'S3 BUCKETS', icon: 'fa-bucket', url: '/s3-tool', color: 'text-[#f59e0b]' },
    { label: 'BLACKHAT', icon: 'fa-user-ninja', url: '/blackhat-tool', color: 'text-[#ef4444]' },
    { label: 'LAZARUS APT', icon: 'fa-user-secret', url: '/lazarus-tool', color: 'text-[#991b1b]' },
    { label: 'BURPSUITE', icon: 'fa-spider', url: '/burpsuite-tool', color: 'text-[#ff6600]' },
    { label: 'OWASP ZAP', icon: 'fa-radar', url: '/owasp-tool', color: 'text-[#3b82f6]' },
  ];

  return (
    <aside className="w-16 md:w-56 bg-[#050505] border-r border-emerald-500/10 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-2xl transition-all overflow-y-auto custom-scroll">
      <div className="p-3 flex items-center justify-center md:justify-start gap-2 border-b border-white/5 mb-2 shrink-0">
        <div className={`w-8 h-8 rounded flex items-center justify-center shadow-xl ring-1 transition-all ${isAttacking ? 'bg-fuchsia-600 ring-fuchsia-400 animate-pulse' : 'bg-emerald-500 ring-emerald-400/50'}`}>
          <i className={`fas ${isAttacking ? 'fa-bolt-lightning' : 'fa-skull'} text-black text-sm`}></i>
        </div>
        <div className="hidden md:block flex flex-col">
          <span className="font-black text-xs tracking-tighter text-white uppercase italic leading-none">WHOAMISec</span>
          <span className={`text-[7px] font-black uppercase tracking-widest ${isAttacking ? 'text-fuchsia-500' : 'text-emerald-500'}`}>PRO_V8.5</span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 transition-all group relative ${
              activeTab === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500' 
                : 'text-gray-600 hover:text-emerald-400 hover:bg-white/5'
            }`}
          >
            <i className={`fas ${item.icon} text-sm w-5 transition-transform group-hover:scale-110`}></i>
            <span className="hidden md:block font-black uppercase text-[8px] tracking-[0.2em]">{item.label}</span>
          </button>
        ))}

        <div className="hidden md:block px-3 pt-4 pb-1">
          <span className="text-[6px] text-gray-600 font-black uppercase tracking-widest">EXTERNAL TOOLS</span>
        </div>
        
        {externalTools.map((tool) => (
          <button
            key={tool.label}
            onClick={() => window.open(tool.url, '_blank')}
            className="w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2 transition-all group relative text-gray-500 hover:bg-white/5"
          >
            <i className={`fas ${tool.icon} text-sm w-5 transition-transform group-hover:scale-110 ${tool.color}`}></i>
            <span className={`hidden md:block font-black uppercase text-[8px] tracking-[0.2em] ${tool.color} opacity-80 group-hover:opacity-100`}>{tool.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-2 border-t border-white/5 hidden md:block shrink-0">
        <div className={`bg-black p-2.5 rounded-lg border transition-all ${isAttacking ? 'border-fuchsia-600/30' : 'border-emerald-500/10'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[6px] text-gray-600 font-black uppercase tracking-widest">Swarm Link</span>
            <div className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-emerald-500' : 'bg-red-600 animate-pulse'}`}></div>
          </div>
          <div className="flex flex-col gap-1">
             <p className="text-[8px] text-white font-mono font-bold truncate uppercase tracking-tighter">{target}</p>
             <div className="flex justify-between items-center border-t border-white/5 pt-1">
                <span className={`text-[7px] font-black uppercase ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isUp ? 'STABLE' : 'OFFLINE'}
                </span>
                {isAttacking && (
                  <span className="text-[6px] font-black text-fuchsia-500 uppercase animate-bounce">800K_LOAD</span>
                )}
             </div>
             {isAttacking && (
               <div className="mt-1 bg-black/60 p-1.5 rounded border border-white/5">
                  <div className="w-full bg-white/5 h-0.5 rounded-full overflow-hidden">
                     <div className="h-full bg-fuchsia-600" style={{ width: '100%' }}></div>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
