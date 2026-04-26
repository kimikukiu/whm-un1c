import React from 'react';
import { AppTab } from '../types';

interface SidebarToolProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const SidebarTools: React.FC<SidebarToolProps> = ({ activeTab, setActiveTab }) => {
  const externalTools = [
    { 
      id: AppTab.OFFENSIVE_SECURITY, 
      label: 'Offensive Tools', 
      icon: 'fa-skull-crossbones',
      color: 'text-red-500',
      description: 'Advanced offensive security toolkit'
    },
    { 
      label: 'Email Extractor', 
      icon: 'fa-envelope',
      color: 'text-blue-500',
      action: () => setActiveTab(AppTab.OFFENSIVE_SECURITY),
      description: 'Extract emails from websites and files'
    },
    { 
      label: 'WordPress Scanner', 
      icon: 'fa-wordpress',
      color: 'text-purple-500',
      action: () => setActiveTab(AppTab.OFFENSIVE_SECURITY),
      description: 'Advanced WordPress vulnerability scanner'
    },
    { 
      label: 'DDoS Tool', 
      icon: 'fa-bomb',
      color: 'text-orange-500',
      action: () => setActiveTab(AppTab.OFFENSIVE_SECURITY),
      description: 'Multi-method DDoS attack tool'
    },
    { 
      label: 'Botnet C2', 
      icon: 'fa-network-wired',
      color: 'text-green-500',
      action: () => setActiveTab(AppTab.OFFENSIVE_SECURITY),
      description: 'Botnet command & control interface'
    },
    { 
      label: 'SQLi Dorks', 
      icon: 'fa-search-plus',
      color: 'text-yellow-500',
      action: () => setActiveTab(AppTab.OFFENSIVE_SECURITY),
      description: 'Generate SQL injection dorks'
    },
    { 
      label: 'Credit Card Checker', 
      icon: 'fa-credit-card',
      color: 'text-cyan-500',
      action: () => setActiveTab(AppTab.OFFENSIVE_SECURITY),
      description: 'Validate and check credit cards'
    },
    { 
      label: 'Account Checkers', 
      icon: 'fa-user-check',
      color: 'text-indigo-500',
      action: () => setActiveTab(AppTab.OFFENSIVE_SECURITY),
      description: 'Multi-service account checkers'
    }
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-[8px] font-black text-white uppercase tracking-tighter border-b border-white/5 pb-2 mb-2">
        Offensive Tools
      </h3>
      {externalTools.map((tool, index) => (
        <div
          key={index}
          onClick={() => {
            if (tool.id) {
              setActiveTab(tool.id);
            } else if (tool.action) {
              tool.action();
            }
          }}
          className={`p-2 rounded cursor-pointer transition-all border ${
            activeTab === tool.id || (tool.action && activeTab === AppTab.OFFENSIVE_SECURITY)
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-white/5 hover:border-white/10'
          }`}
          title={tool.description}
        >
          <div className="flex items-center space-x-2">
            <i className={`fas ${tool.icon} ${tool.color} text-[10px]`}></i>
            <div className="flex-1 min-w-0">
              <div className="text-[8px] font-black text-white uppercase truncate">
                {tool.label}
              </div>
              <div className="text-[6px] text-gray-500 truncate">
                {tool.description}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarTools;