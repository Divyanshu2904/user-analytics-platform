"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Map, 
  Lightbulb, 
  Activity, 
  ChevronRight,
  Menu,
  X,
  Globe
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const SidebarContent = ({ isCollapsed, toggleCollapse }) => (
    <div className={`flex flex-col h-full bg-white flex-1 py-6 border-r border-slate-100/80 shadow-sm transition-all duration-300 ${
      isCollapsed ? "px-3" : "px-5"
    }`}>
      {/* Brand Logo */}
      <div 
        onClick={toggleCollapse}
        className={`flex items-center gap-3 mb-8 cursor-pointer hover:opacity-85 transition-opacity ${
          isCollapsed ? "justify-center px-0" : "px-2"
        }`}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <img 
          src="/logo.png" 
          alt="CausalFunnel Logo" 
          className="h-10 w-10 rounded-xl object-contain shadow-sm flex-shrink-0"
        />
        {!isCollapsed && (
          <div>
            <h1 className="font-extrabold text-lg leading-tight tracking-tight text-slate-800">
              Causal<span className="text-blue-600">Funnel</span>
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
              Analytics Platform
            </p>
          </div>
        )}
      </div>

      {/* Navigation Section */}
      <div className="space-y-1 flex-1">
        {!isCollapsed && (
          <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Navigation
          </p>
        )}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center group rounded-xl transition-all duration-200 ${
                  isCollapsed ? "justify-center p-2.5" : "justify-between px-4 py-3.5"
                } ${
                  isActive
                    ? "bg-blue-50/70 text-blue-600 border border-blue-100/50 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3.5"}`}>
                  <div className={`p-1.5 rounded-lg transition-colors duration-200 ${
                    isActive ? "bg-blue-500/10 text-blue-600" : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  {!isCollapsed && (
                    <div className="min-w-0">
                      <p className="text-sm font-semibold tracking-wide truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium group-hover:text-slate-500 transition-colors truncate">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0 ${
                    isActive ? "text-blue-500 translate-x-0 opacity-100" : "text-slate-300 group-hover:translate-x-1"
                  }`} />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-[#ebf3fc] via-[#f7fafc] to-white text-slate-800 relative">
      {/* 1. Desktop Sidebar (md:flex) */}
      <aside className={`hidden md:flex ${isSidebarCollapsed ? "w-20" : "w-72"} flex-col flex-shrink-0 transition-all duration-300`}>
        <SidebarContent isCollapsed={isSidebarCollapsed} toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
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
            <SidebarContent isCollapsed={false} toggleCollapse={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. Main Viewport Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-transparent">
        {/* Mobile Top Navigation Header */}
        <header className="flex md:hidden items-center justify-between px-5 py-4 bg-white border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="CausalFunnel Logo" 
              className="h-8 w-8 rounded-lg object-contain"
            />
            <span className="font-extrabold text-sm text-slate-800">
              Causal<span className="text-blue-600">Funnel</span>
            </span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Content Children */}
        {children}
      </div>
    </div>
  );
}
