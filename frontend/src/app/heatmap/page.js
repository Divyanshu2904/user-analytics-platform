"use client";

import { useState, useEffect } from "react";
import { fetchHeatmapData } from "@/utils/api";
import { 
  Map, 
  RefreshCw, 
  HelpCircle, 
  Sliders, 
  Layers,
  MousePointerClick
} from "lucide-react";

export default function HeatmapPage() {
  const [selectedPage, setSelectedPage] = useState("/index.html");
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom heatmap sliders
  const [dotSize, setDotSize] = useState(25);
  const [dotBlur, setDotBlur] = useState(15);
  const [dotOpacity, setDotOpacity] = useState(0.85);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch clicks for page
      const data = await fetchHeatmapData(selectedPage);
      setClicks(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch click coordinate streams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedPage]);

  // Wireframe skeletons for the pages to render clicks on
  const renderPageSkeleton = () => {
    switch (selectedPage) {
      case "/index.html":
        return (
          <div className="w-full min-h-[600px] bg-[#0b0f19] border border-gray-800 rounded-2xl relative overflow-hidden flex flex-col p-6 text-gray-500 select-none">
            {/* Header Wireframe */}
            <div className="border-b border-gray-800/80 pb-4 mb-16 flex justify-between items-center">
              <div className="h-6 w-24 bg-gray-900 rounded-lg border border-gray-800"></div>
              <div className="flex gap-4">
                <div className="h-4 w-12 bg-gray-900 rounded border border-gray-800"></div>
                <div className="h-4 w-12 bg-gray-900 rounded border border-gray-800"></div>
                <div className="h-4 w-12 bg-gray-900 rounded border border-gray-800"></div>
              </div>
            </div>

            {/* Hero Wireframe */}
            <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-16">
              <div className="h-5 w-36 bg-gray-900/80 border border-gray-800 rounded-full mb-6"></div>
              <div className="h-10 w-full bg-gray-900/80 border border-gray-800 rounded-xl mb-4"></div>
              <div className="h-10 w-3/4 bg-gray-900/80 border border-gray-800 rounded-xl mb-6"></div>
              <div className="h-4 w-5/6 bg-gray-900/60 border border-gray-800/60 rounded mb-10"></div>
              
              <div className="flex gap-4">
                <div className="h-10 w-28 bg-indigo-950/40 border border-indigo-900/30 rounded-lg"></div>
                <div className="h-10 w-32 bg-gray-900/80 border border-gray-800 rounded-lg"></div>
              </div>
            </div>

            {/* Features Grid Wireframe */}
            <div className="grid grid-cols-3 gap-6 mt-auto">
              <div className="border border-gray-800/60 bg-gray-900/10 rounded-xl p-5 h-36">
                <div className="h-6 w-6 bg-gray-900 border border-gray-800 rounded mb-4"></div>
                <div className="h-4 w-2/3 bg-gray-900 border border-gray-800 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-900/50 border border-gray-800/40 rounded"></div>
              </div>
              <div className="border border-gray-800/60 bg-gray-900/10 rounded-xl p-5 h-36">
                <div className="h-6 w-6 bg-gray-900 border border-gray-800 rounded mb-4"></div>
                <div className="h-4 w-2/3 bg-gray-900 border border-gray-800 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-900/50 border border-gray-800/40 rounded"></div>
              </div>
              <div className="border border-gray-800/60 bg-gray-900/10 rounded-xl p-5 h-36">
                <div className="h-6 w-6 bg-gray-900 border border-gray-800 rounded mb-4"></div>
                <div className="h-4 w-2/3 bg-gray-900 border border-gray-800 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-900/50 border border-gray-800/40 rounded"></div>
              </div>
            </div>
            
            {/* Heatmap click points overlays */}
            {renderClicksOverlay()}
          </div>
        );
      case "/about.html":
        return (
          <div className="w-full min-h-[800px] bg-[#0b0f19] border border-gray-800 rounded-2xl relative overflow-hidden flex flex-col p-6 text-gray-500 select-none">
            {/* Header */}
            <div className="border-b border-gray-800/80 pb-4 mb-16 flex justify-between items-center">
              <div className="h-6 w-24 bg-gray-900 rounded-lg border border-gray-800"></div>
              <div className="flex gap-4">
                <div className="h-4 w-12 bg-gray-900 rounded border border-gray-800"></div>
                <div className="h-4 w-12 bg-gray-900 rounded border border-gray-800"></div>
                <div className="h-4 w-12 bg-gray-900 rounded border border-gray-800"></div>
              </div>
            </div>

            {/* About content wireframe layout */}
            <div className="max-w-2xl mx-auto w-full space-y-12">
              <div className="text-center mb-12">
                <div className="h-4 w-24 bg-gray-900 border border-gray-800 rounded-full mx-auto mb-4"></div>
                <div className="h-8 w-64 bg-gray-900 border border-gray-800 rounded-lg mx-auto mb-3"></div>
                <div className="h-4 w-3/4 bg-gray-900/60 border border-gray-800/60 rounded mx-auto"></div>
              </div>

              <div className="space-y-4 pt-16">
                <div className="h-5 w-44 bg-cyan-950/20 border border-cyan-900/30 rounded"></div>
                <div className="h-3 w-full bg-gray-900/60 border border-gray-800/60 rounded"></div>
                <div className="h-3 w-5/6 bg-gray-900/60 border border-gray-800/60 rounded"></div>
                <div className="h-3 w-4/5 bg-gray-900/60 border border-gray-800/60 rounded"></div>
              </div>

              <div className="space-y-4 pt-24">
                <div className="h-5 w-48 bg-cyan-950/20 border border-cyan-900/30 rounded"></div>
                <div className="h-3 w-full bg-gray-900/60 border border-gray-800/60 rounded"></div>
                <div className="h-3 w-4/5 bg-gray-900/60 border border-gray-800/60 rounded"></div>
              </div>

              <div className="space-y-4 pt-24">
                <div className="h-5 w-40 bg-cyan-950/20 border border-cyan-900/30 rounded"></div>
                <div className="h-3 w-full bg-gray-900/60 border border-gray-800/60 rounded"></div>
                <div className="h-3.5 w-11/12 bg-gray-900/60 border border-gray-800/60 rounded"></div>
              </div>
            </div>
            
            {/* Heatmap click points overlays */}
            {renderClicksOverlay()}
          </div>
        );
      case "/contact.html":
        return (
          <div className="w-full min-h-[600px] bg-[#0b0f19] border border-gray-800 rounded-2xl relative overflow-hidden flex flex-col p-6 text-gray-500 select-none">
            {/* Header */}
            <div className="border-b border-gray-800/80 pb-4 mb-16 flex justify-between items-center">
              <div className="h-6 w-24 bg-gray-900 rounded-lg border border-gray-800"></div>
              <div className="flex gap-4">
                <div className="h-4 w-12 bg-gray-900 rounded border border-gray-800"></div>
                <div className="h-4 w-12 bg-gray-900 rounded border border-gray-800"></div>
                <div className="h-4 w-12 bg-gray-900 rounded border border-gray-800"></div>
              </div>
            </div>

            {/* Form box wireframe */}
            <div className="max-w-md mx-auto w-full border border-gray-800/60 bg-gray-900/10 rounded-2xl p-8 mb-12">
              <div className="h-4 w-20 bg-gray-900 border border-gray-800 rounded-full mx-auto mb-4"></div>
              <div className="h-6 w-44 bg-gray-900 border border-gray-800 rounded-lg mx-auto mb-8"></div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-900/80 border border-gray-800 rounded"></div>
                  <div className="h-9 w-full bg-gray-900/40 border border-gray-800/80 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-gray-900/80 border border-gray-800 rounded"></div>
                  <div className="h-9 w-full bg-gray-900/40 border border-gray-800/80 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-14 bg-gray-900/80 border border-gray-800 rounded"></div>
                  <div className="h-9 w-full bg-gray-900/40 border border-gray-800/80 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-gray-900/80 border border-gray-800 rounded"></div>
                  <div className="h-20 w-full bg-gray-900/40 border border-gray-800/80 rounded-lg"></div>
                </div>

                <div className="h-10 w-full bg-indigo-950/40 border border-indigo-900/30 rounded-lg pt-4"></div>
              </div>
            </div>
            
            {/* Heatmap click points overlays */}
            {renderClicksOverlay()}
          </div>
        );
      default:
        return null;
    }
  };

  const renderClicksOverlay = () => {
    if (clicks.length === 0) return null;

    return (
      <div className="absolute inset-0 pointer-events-none">
        {clicks.map((click, index) => {
          // Normalize coordinates relative to original window sizes
          const width = click.window_width || 1200;
          const height = click.window_height || 800;

          const pctX = (click.x / width) * 100;
          const pctY = (click.y / height) * 100;

          return (
            <div
              key={index}
              className="absolute rounded-full transition-all duration-300"
              style={{
                left: `${pctX}%`,
                top: `${pctY}%`,
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(239, 68, 68, 1) 0%, rgba(249, 115, 22, 0.6) 40%, rgba(253, 224, 71, 0) 100%)",
                filter: `blur(${dotBlur}px)`,
                opacity: dotOpacity,
                boxShadow: "0 0 12px rgba(239, 68, 68, 0.4)"
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Click Heatmap</h2>
          <p className="text-xs text-gray-400 mt-1">
            Analyze spatial density distributions of coordinates registered by tracker.js clicks.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 text-xs font-bold bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 hover:border-gray-700 px-4 py-2.5 rounded-xl transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-indigo-400" : ""}`} />
          Refresh Coordinates
        </button>
      </div>

      {/* Grid configuration and visualization panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Settings panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Page Selector */}
          <div className="glass-card p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Selected Page
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home Page", path: "/index.html" },
                { label: "About Page", path: "/about.html" },
                { label: "Contact Page", path: "/contact.html" }
              ].map((p) => (
                <button
                  key={p.path}
                  onClick={() => setSelectedPage(p.path)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                    selectedPage === p.path
                      ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                      : "bg-gray-950 border-gray-800/80 text-gray-400 hover:text-gray-200 hover:border-gray-700"
                  }`}
                >
                  {p.label}
                  <span className="block text-[9px] text-gray-500 font-mono mt-0.5">{p.path}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rendering config */}
          <div className="glass-card p-5 rounded-2xl space-y-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-400" />
              Heat Overlay Settings
            </h3>
            
            {/* Dot Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Glow Radius</span>
                <span className="font-mono text-gray-300 font-bold">{dotSize}px</span>
              </div>
              <input
                type="range"
                min="15"
                max="60"
                value={dotSize}
                onChange={(e) => setDotSize(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Dot Blur */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Diffusion Blur</span>
                <span className="font-mono text-gray-300 font-bold">{dotBlur}px</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={dotBlur}
                onChange={(e) => setDotBlur(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Dot Opacity */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Heat Opacity</span>
                <span className="font-mono text-gray-300 font-bold">{Math.round(dotOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={Math.round(dotOpacity * 100)}
                onChange={(e) => setDotOpacity(parseInt(e.target.value) / 100)}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="glass-card p-5 rounded-2xl flex flex-col gap-1 bg-gradient-to-br from-indigo-950/20 to-gray-900/10">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Page Density</span>
            <div className="flex items-center gap-2 mt-1">
              <MousePointerClick className="h-5 w-5 text-indigo-400" />
              <span className="text-xl font-extrabold text-white">{clicks.length}</span>
              <span className="text-xs text-gray-400">registered clicks</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed mt-2.5">
              Normalized relative click positions scaling mathematically based on original viewports.
            </p>
          </div>
        </div>

        {/* Wireframe Canvas Overlay container */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-4 bg-gray-900/30 border border-gray-800/60 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-cyan-400" />
              <span className="text-xs text-gray-300 font-bold">Responsive Canvas Overlay</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Mock Wireframe Mode
            </span>
          </div>

          {loading ? (
            <div className="w-full h-[600px] bg-gray-900/10 border border-gray-800 rounded-2xl flex items-center justify-center text-sm text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-6 w-6 text-indigo-400 animate-spin" />
                Plotting coordinate distributions...
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-[600px] bg-red-950/5 border border-red-900/20 rounded-2xl flex items-center justify-center text-sm text-red-400">
              {error}
            </div>
          ) : (
            renderPageSkeleton()
          )}
        </div>

      </div>
    </div>
  );
}
