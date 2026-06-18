"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Map, 
  Lightbulb, 
  Activity, 
  Layers, 
  ChevronRight 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

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

  return (
    <aside className="w-80 border-r border-gray-800 bg-[#0c1220]/90 backdrop-blur-xl flex flex-col justify-between flex-shrink-0">
      <div className="flex flex-col flex-1 py-8 px-5">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3 mb-10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg leading-tight tracking-tight text-white">
              Causal<span className="text-cyan-400 font-normal">Funnel</span>
            </h1>
            <p className="text-[10px] text-gray-500 tracking-wider uppercase font-semibold">
              Analytics Platform
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
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
                  className={`flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/40 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-1.5 rounded-lg transition-colors duration-300 ${
                      isActive ? "bg-indigo-500/20 text-indigo-400" : "bg-gray-800/50 text-gray-400 group-hover:text-white"
                    }`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold tracking-wide">{item.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400 transition-colors">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                    isActive ? "text-indigo-400 translate-x-0 opacity-100" : "text-gray-600 group-hover:translate-x-1"
                  }`} />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Integration Widget */}
      <div className="p-5 border-t border-gray-800 bg-gray-900/10">
        <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/30 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Ingestion API Ready
            </span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Running locally on <code className="text-indigo-400 font-mono text-[10px]">port 5000</code>. Tracker loaded from local path.
          </p>
        </div>
      </div>
    </aside>
  );
}
