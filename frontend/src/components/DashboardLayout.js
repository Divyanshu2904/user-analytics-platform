"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Map, 
  Lightbulb, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Closed by default
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    {
      name: "User Sessions",
      path: "/",
      icon: Users,
      description: "Chronological activity streams"
    },
    {
      name: "Click Heatmap",
      path: "/heatmap",
      icon: Map,
      description: "Visual touch point density"
    },
    {
      name: "AI Insights",
      path: "/insights",
      icon: Lightbulb,
      description: "UX heuristic recommendation"
    }
  ];

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white flex-1 py-6 px-5 border-r border-slate-100 shadow-sm">
      {/* Brand Logo with click to toggle */}
      <div 
        onClick={() => setIsSidebarCollapsed(true)}
        className="flex items-center gap-3 px-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity"
        title="Click to collapse menu"
      >
        <img 
          src="/logo.png" 
          alt="CausalFunnel Logo" 
          className="h-10 w-10 rounded-xl object-contain shadow-sm"
        />
        <div>
          <h1 className="font-extrabold text-lg leading-tight tracking-tight text-slate-800">
            Causal<span className="text-blue-600">Funnel</span>
          </h1>
          <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
            Analytics Platform
          </p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="space-y-1 flex-1">
        <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Navigation
        </p>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between group px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50/70 text-blue-600 border border-blue-100/50 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-1.5 rounded-lg transition-colors duration-200 ${
                    isActive ? "bg-blue-500/10 text-blue-600" : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold tracking-wide">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium group-hover:text-slate-500 transition-colors">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                  isActive ? "text-blue-500 translate-x-0 opacity-100" : "text-slate-300 group-hover:translate-x-1"
                }`} />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-slate-800 relative">
      {/* Background Soft Blue/Purple Glows - CausalFunnel Homepage Style */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#dbeafe]/30 to-[#e0e7ff]/35 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#e0e7ff]/25 to-[#dbeafe]/30 blur-[120px] pointer-events-none z-0"></div>

      {/* 1. Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out z-20 ${
        isSidebarCollapsed ? "w-0 overflow-hidden" : "w-72"
      }`}>
        <SidebarContent />
      </aside>

      {/* 2. Mobile Sidebar Overlay Drawer */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-50 flex md:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop mask */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none transition-transform duration-300 ease-out animate-slide-in">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* 3. Main Viewport Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-transparent z-10">
        
        {/* Global Desktop & Mobile Header Bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-md border-b border-slate-100/80 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Desktop Toggle Menu Button */}
            <button
              onClick={toggleSidebar}
              className="hidden md:flex p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300 transition-all cursor-pointer shadow-sm"
              aria-label="Toggle navigation menu"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu className="h-4.5 w-4.5" />
            </button>

            {/* Mobile Toggle Menu Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex md:hidden p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>

            {/* Brand Logo in header */}
            <Link href="/" className="flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="CausalFunnel Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="font-extrabold text-sm text-slate-800 tracking-tight">
                Causal<span className="text-blue-600 font-bold">Funnel</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[9px] md:text-[10px] bg-blue-50/80 text-blue-600 border border-blue-100/50 font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm select-none">
              User Analytics Active
            </span>
          </div>
        </header>

        {/* Content Children */}
        <div className="flex-1 relative">
          {children}
        </div>
      </div>
    </div>
  );
}
