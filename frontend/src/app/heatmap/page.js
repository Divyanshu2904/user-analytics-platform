"use client";

import { useState, useEffect } from "react";
import { fetchHeatmapData } from "@/utils/api";
import { 
  Map, 
  RefreshCw, 
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

  // Light-themed wireframe skeletons for the pages to render clicks on
  const renderPageSkeleton = () => {
    switch (selectedPage) {
      case "/index.html":
        return (
          <div className="w-full min-h-[600px] bg-white border border-slate-100 rounded-2xl relative overflow-hidden flex flex-col p-6 text-slate-400 shadow-sm select-none">
            {/* Header Wireframe */}
            <div className="border-b border-slate-100 pb-4 mb-16 flex justify-between items-center">
              <div className="h-6 w-24 bg-slate-100 rounded-lg border border-slate-200/55"></div>
              <div className="flex gap-4">
                <div className="h-4 w-12 bg-slate-100 rounded border border-slate-200/55"></div>
                <div className="h-4 w-12 bg-slate-100 rounded border border-slate-200/55"></div>
                <div className="h-4 w-12 bg-slate-100 rounded border border-slate-200/55"></div>
              </div>
            </div>

            {/* Hero Wireframe */}
            <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-16">
              <div className="h-5 w-36 bg-slate-50 border border-slate-100 rounded-full mb-6"></div>
              <div className="h-10 w-full bg-slate-100/70 border border-slate-200/55 rounded-xl mb-4"></div>
              <div className="h-10 w-3/4 bg-slate-100/70 border border-slate-200/55 rounded-xl mb-6"></div>
              <div className="h-4 w-5/6 bg-slate-50 border border-slate-100 rounded mb-10"></div>
              
              <div className="flex gap-4">
                <div className="h-10 w-28 bg-blue-50 border border-blue-100/55 rounded-lg"></div>
                <div className="h-10 w-32 bg-slate-100/80 border border-slate-200/55 rounded-lg"></div>
              </div>
            </div>

            {/* Features Grid Wireframe */}
            <div className="grid grid-cols-3 gap-6 mt-auto">
              <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-5 h-36">
                <div className="h-6 w-6 bg-slate-100 border border-slate-200/60 rounded mb-4"></div>
                <div className="h-4 w-2/3 bg-slate-100 border border-slate-200/60 rounded mb-2"></div>
                <div className="h-3 w-full bg-slate-50 border border-slate-100/60 rounded"></div>
              </div>
              <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-5 h-36">
                <div className="h-6 w-6 bg-slate-100 border border-slate-200/60 rounded mb-4"></div>
                <div className="h-4 w-2/3 bg-slate-100 border border-slate-200/60 rounded mb-2"></div>
                <div className="h-3 w-full bg-slate-50 border border-slate-100/60 rounded"></div>
              </div>
              <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-5 h-36">
                <div className="h-6 w-6 bg-slate-100 border border-slate-200/60 rounded mb-4"></div>
                <div className="h-4 w-2/3 bg-slate-100 border border-slate-200/60 rounded mb-2"></div>
                <div className="h-3 w-full bg-slate-50 border border-slate-100/60 rounded"></div>
              </div>
            </div>
            
            {/* Heatmap click points overlays */}
            {renderClicksOverlay()}
          </div>
        );
      case "/about.html":
        return (
          <div className="w-full min-h-[800px] bg-white border border-slate-100 rounded-2xl relative overflow-hidden flex flex-col p-6 text-slate-400 shadow-sm select-none">
            {/* Header */}
            <div className="border-b border-slate-100 pb-4 mb-16 flex justify-between items-center">
              <div className="h-6 w-24 bg-slate-100 rounded-lg border border-slate-200/55"></div>
              <div className="flex gap-4">
                <div className="h-4 w-12 bg-slate-100 rounded border border-slate-200/55"></div>
                <div className="h-4 w-12 bg-slate-100 rounded border border-slate-200/55"></div>
                <div className="h-4 w-12 bg-slate-100 rounded border border-slate-200/55"></div>
              </div>
            </div>

            {/* About content wireframe layout */}
            <div className="max-w-2xl mx-auto w-full space-y-12">
              <div className="text-center mb-12">
                <div className="h-4 w-24 bg-slate-100 border border-slate-200 rounded-full mx-auto mb-4"></div>
                <div className="h-8 w-64 bg-slate-100 border border-slate-200 rounded-lg mx-auto mb-3"></div>
                <div className="h-4 w-3/4 bg-slate-50 border border-slate-100 rounded mx-auto"></div>
              </div>

              <div className="space-y-4 pt-16">
                <div className="h-5 w-44 bg-blue-50 border border-blue-100/30 rounded"></div>
                <div className="h-3 w-full bg-slate-50 border border-slate-100 rounded"></div>
                <div className="h-3 w-5/6 bg-slate-50 border border-slate-100 rounded"></div>
                <div className="h-3 w-4/5 bg-slate-50 border border-slate-100 rounded"></div>
              </div>

              <div className="space-y-4 pt-24">
                <div className="h-5 w-48 bg-blue-50 border border-blue-100/30 rounded"></div>
                <div className="h-3 w-full bg-slate-50 border border-slate-100 rounded"></div>
                <div className="h-3 w-4/5 bg-slate-50 border border-slate-100 rounded"></div>
              </div>

              <div className="space-y-4 pt-24">
                <div className="h-5 w-40 bg-blue-50 border border-blue-100/30 rounded"></div>
                <div className="h-3 w-full bg-slate-50 border border-slate-100 rounded"></div>
                <div className="h-3.5 w-11/12 bg-slate-50 border border-slate-100 rounded"></div>
              </div>
            </div>
            
            {/* Heatmap click points overlays */}
            {renderClicksOverlay()}
          </div>
        );
      case "/contact.html":
        return (
          <div className="w-full min-h-[600px] bg-white border border-slate-100 rounded-2xl relative overflow-hidden flex flex-col p-6 text-slate-400 shadow-sm select-none">
            {/* Header */}
            <div className="border-b border-slate-100 pb-4 mb-16 flex justify-between items-center">
              <div className="h-6 w-24 bg-slate-100 rounded-lg border border-slate-200/55"></div>
              <div className="flex gap-4">
                <div className="h-4 w-12 bg-slate-100 rounded border border-slate-200/55"></div>
                <div className="h-4 w-12 bg-slate-100 rounded border border-slate-200/55"></div>
                <div className="h-4 w-12 bg-slate-100 rounded border border-slate-200/55"></div>
              </div>
            </div>

            {/* Form box wireframe */}
            <div className="max-w-md mx-auto w-full border border-slate-200 bg-slate-50/30 rounded-2xl p-8 mb-12">
              <div className="h-4 w-20 bg-slate-100 border border-slate-200 rounded-full mx-auto mb-4"></div>
              <div className="h-6 w-44 bg-slate-100 border border-slate-200 rounded-lg mx-auto mb-8"></div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-slate-100 border border-slate-100 rounded"></div>
                  <div className="h-9 w-full bg-white border border-slate-200 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-slate-100 border border-slate-100 rounded"></div>
                  <div className="h-9 w-full bg-white border border-slate-200 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-14 bg-slate-100 border border-slate-100 rounded"></div>
                  <div className="h-9 w-full bg-white border border-slate-200 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-slate-100 border border-slate-100 rounded"></div>
                  <div className="h-20 w-full bg-white border border-slate-200 rounded-lg"></div>
                </div>

                <div className="h-10 w-full bg-blue-50 border border-blue-100 rounded-lg pt-4"></div>
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
    <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Click Heatmap</h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyze spatial density distributions of coordinates registered by tracker.js clicks.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-500" : "text-slate-400"}`} />
          Refresh Coordinates
        </button>
      </div>

      {/* Grid configuration and visualization panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Settings panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Page Selector */}
          <div className="bg-white border border-slate-100/80 shadow-sm p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
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
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selectedPage === p.path
                      ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm shadow-blue-500/5"
                      : "bg-slate-50 border-slate-200/60 text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  {p.label}
                  <span className="block text-[9px] text-slate-400 font-mono mt-0.5">{p.path}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rendering config */}
          <div className="bg-white border border-slate-100/80 shadow-sm p-5 rounded-2xl space-y-5">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <Sliders className="h-4 w-4 text-blue-500" />
              Heat Overlay Settings
            </h3>
            
            {/* Dot Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Glow Radius</span>
                <span className="font-mono text-slate-700 font-bold">{dotSize}px</span>
              </div>
              <input
                type="range"
                min="15"
                max="60"
                value={dotSize}
                onChange={(e) => setDotSize(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Dot Blur */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Diffusion Blur</span>
                <span className="font-mono text-slate-700 font-bold">{dotBlur}px</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={dotBlur}
                onChange={(e) => setDotBlur(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Dot Opacity */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Heat Opacity</span>
                <span className="font-mono text-slate-700 font-bold">{Math.round(dotOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={Math.round(dotOpacity * 100)}
                onChange={(e) => setDotOpacity(parseInt(e.target.value) / 100)}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-white border border-slate-100/80 shadow-sm p-5 rounded-2xl flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Page Density</span>
            <div className="flex items-center gap-2 mt-1">
              <MousePointerClick className="h-5 w-5 text-blue-500" />
              <span className="text-xl font-extrabold text-slate-800">{clicks.length}</span>
              <span className="text-xs text-slate-400">registered clicks</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-2.5 font-medium">
              Normalized relative click positions scaling mathematically based on original viewports.
            </p>
          </div>
        </div>

        {/* Wireframe Canvas Overlay container */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-4 bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-blue-500" />
              <span className="text-xs text-slate-600 font-bold">Responsive Canvas Overlay</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Mock Wireframe Mode
            </span>
          </div>

          {loading ? (
            <div className="w-full h-[600px] bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-sm text-slate-400 shadow-sm">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
                Plotting coordinate distributions...
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-[600px] bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-sm text-red-500 shadow-sm">
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
