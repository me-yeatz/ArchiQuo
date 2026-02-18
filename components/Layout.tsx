
import React from 'react';
import { useStore } from '../store';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: 'fa-th-large' },
    { id: 'projects', label: 'PROJECTS', icon: 'fa-folder' },
    { id: 'transmittals', label: 'TRANSMITTALS', icon: 'fa-shipping-fast' },
    { id: 'new-project', label: 'ADD PROJECT', icon: 'fa-plus' },
    { id: 'profile', label: 'PROFILE', icon: 'fa-user-cog' },
  ];

  return (
    <div className="flex h-screen overflow-hidden p-4 gap-4">
      {/* Sidebar - Technical Block Style */}
      <aside className="w-64 flex flex-col no-print gap-4">
        <div className="blueprint-bg technical-border p-6 flex flex-col items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-full mb-2">
            <img
              src={useStore().profile.logoUrl || "/LOGO 2025-03.png"}
              alt={useStore().profile.companyName}
              className="w-full h-auto object-contain"
            />
          </div>
          <p className="text-[10px] font-black text-center mt-2 tracking-tighter leading-tight uppercase line-clamp-2">{useStore().profile.companyName}</p>
        </div>

        <nav className="flex-1 blueprint-bg technical-border flex flex-col p-4 gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 border-2 transition-all group ${activeView === item.id
                  ? 'bg-[#1a1c1e] text-white border-[#1a1c1e]'
                  : 'text-slate-600 border-transparent hover:border-slate-300'
                }`}
            >
              <div className="flex items-center gap-3">
                <i className={`fas ${item.icon} text-sm`}></i>
                <span className="font-black text-xs tracking-widest">{item.label}</span>
              </div>
              <i className="fas fa-chevron-right text-[10px] opacity-30 group-hover:opacity-100"></i>
            </button>
          ))}
        </nav>

        <div className="blueprint-bg technical-border p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 technical-border flex items-center justify-center font-black text-xs bg-white">Y</div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Architect</p>
              <p className="text-[10px] text-[#c02164] font-black uppercase">Session Active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto blueprint-bg technical-border relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
