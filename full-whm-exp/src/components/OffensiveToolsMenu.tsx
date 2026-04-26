import React, { useState } from 'react';
import { AppTab } from '../types';

interface OffensiveToolsMenuProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const OffensiveToolsMenu: React.FC<OffensiveToolsMenuProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const offensiveTools = [
    { 
      id: AppTab.OFFENSIVE_SECURITY,
      label: 'Main Toolkit', 
      icon: 'fa-skull-crossbones',
      color: 'text-red-500',
      description: 'Access all offensive tools'
    },
    { 
      label: 'Email Extractor Pro', 
      icon: 'fa-envelope',
      color: 'text-blue-500',
      description: 'Extract emails from websites and files',
      action: () => {
        setActiveTab(AppTab.OFFENSIVE_SECURITY);
        // Set specific tool in OffensiveSecurity component
        setTimeout(() => {
          const event = new CustomEvent('selectTool', { detail: 'email-extractor-pro' });
          window.dispatchEvent(event);
        }, 100);
      }
    },
    { 
      label: 'JScan WordPress', 
      icon: 'fa-wordpress',
      color: 'text-purple-500',
      description: 'Advanced WordPress vulnerability scanner',
      action: () => {
        setActiveTab(AppTab.OFFENSIVE_SECURITY);
        setTimeout(() => {
          const event = new CustomEvent('selectTool', { detail: 'jscan-wordpress-scanner' });
          window.dispatchEvent(event);
        }, 100);
      }
    },
    { 
      label: 'ITs DDoS Tool', 
      icon: 'fa-bomb',
      color: 'text-orange-500',
      description: 'Multi-method DDoS attack tool',
      action: () => {
        setActiveTab(AppTab.OFFENSIVE_SECURITY);
        setTimeout(() => {
          const event = new CustomEvent('selectTool', { detail: 'its-ddos-tool' });
          window.dispatchEvent(event);
        }, 100);
      }
    },
    { 
      label: 'Botnet C2 Controller', 
      icon: 'fa-network-wired',
      color: 'text-green-500',
      description: 'Botnet command & control interface',
      action: () => {
        setActiveTab(AppTab.OFFENSIVE_SECURITY);
        setTimeout(() => {
          const event = new CustomEvent('selectTool', { detail: 'botnet-c2-controller' });
          window.dispatchEvent(event);
        }, 100);
      }
    },
    { 
      label: 'SQLi Dorks Generator', 
      icon: 'fa-search-plus',
      color: 'text-yellow-500',
      description: 'Generate SQL injection dorks',
      action: () => {
        setActiveTab(AppTab.OFFENSIVE_SECURITY);
        setTimeout(() => {
          const event = new CustomEvent('selectTool', { detail: 'sqli-dorks-generator' });
          window.dispatchEvent(event);
        }, 100);
      }
    },
    { 
      label: 'Credit Card Checker', 
      icon: 'fa-credit-card',
      color: 'text-cyan-500',
      description: 'Validate and check credit cards',
      action: () => {
        setActiveTab(AppTab.OFFENSIVE_SECURITY);
        setTimeout(() => {
          const event = new CustomEvent('selectTool', { detail: 'credit-card-checker' });
          window.dispatchEvent(event);
        }, 100);
      }
    },
    { 
      label: 'Account Checkers', 
      icon: 'fa-user-check',
      color: 'text-indigo-500',
      description: 'Multi-service account validation',
      action: () => {
        setActiveTab(AppTab.OFFENSIVE_SECURITY);
        setTimeout(() => {
          const event = new CustomEvent('selectTool', { detail: 'netflix-checker' });
          window.dispatchEvent(event);
        }, 100);
      }
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2 rounded cursor-pointer transition-all border ${
          activeTab === AppTab.OFFENSIVE_SECURITY
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-white/5 hover:border-white/10'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fas fa-skull-crossbones text-red-500 text-[10px]"></i>
            <div className="flex-1 min-w-0">
              <div className="text-[8px] font-black text-white uppercase truncate">
                Offensive Tools
              </div>
              <div className="text-[6px] text-gray-500 truncate">
                Advanced Security Toolkit
              </div>
            </div>
          </div>
          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-gray-400 text-[8px]`}></i>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-black/95 border border-white/10 rounded-lg shadow-xl z-50">
          <div className="p-2 space-y-1">
            {offensiveTools.map((tool, index) => (
              <div
                key={index}
                onClick={() => {
                  if (tool.id) {
                    setActiveTab(tool.id);
                  } else if (tool.action) {
                    tool.action();
                  }
                  setIsOpen(false);
                }}
                className="p-2 rounded cursor-pointer transition-all border border-transparent hover:border-white/10 hover:bg-white/5"
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
        </div>
      )}
    </div>
  );
};

export default OffensiveToolsMenu;