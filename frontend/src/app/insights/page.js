"use client";

import { useState, useEffect } from "react";
import { fetchAIInsights } from "@/utils/api";
import { 
  Lightbulb, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Info,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function InsightsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const insights = await fetchAIInsights();
      setData(insights);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch automated design recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getInsightIcon = (type) => {
    switch (type) {
      case "danger":
        return <AlertOctagon className="h-5 w-5 text-red-400" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      default:
        return <Info className="h-5 w-5 text-cyan-400" />;
    }
  };

  const getInsightBorderClass = (type) => {
    switch (type) {
      case "danger":
        return "border-red-900/30 bg-red-950/5 hover:border-red-500/20";
      case "warning":
        return "border-amber-900/30 bg-amber-950/5 hover:border-amber-500/20";
      case "success":
        return "border-emerald-900/30 bg-emerald-950/5 hover:border-emerald-500/20";
      default:
        return "border-cyan-900/30 bg-cyan-950/5 hover:border-cyan-500/20";
    }
  };

  const getImpactBadgeClass = (impact) => {
    switch (impact) {
      case "Critical":
        return "bg-red-500/10 text-red-400 border-red-500/25";
      case "High":
        return "bg-orange-500/10 text-orange-400 border-orange-500/25";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/25";
      default:
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/25";
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-400 animate-pulse" />
            AI Design Advisor
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time heuristic analyzer mapping MongoDB event streams to actionable UX optimizations.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 text-xs font-bold bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 hover:border-gray-700 px-4 py-2.5 rounded-xl transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-indigo-400" : ""}`} />
          Recalculate Heuristics
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 text-indigo-400 animate-spin" />
            Scanning event logs & executing heuristic aggregations...
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-sm text-red-400">
          {error}
        </div>
      ) : (
        <div className="max-w-4xl space-y-6">
          {/* Summary Box */}
          <div className="glass-panel p-6 rounded-2xl border-indigo-900/30 flex items-start gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 flex-shrink-0">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Aggregated Performance Summary</h3>
              <p className="text-sm text-gray-300 leading-relaxed mt-2">
                {data.summary}
              </p>
            </div>
          </div>

          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pt-2">
            Recommended Actions
          </p>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 gap-4">
            {data.insights.map((insight, index) => (
              <div
                key={index}
                className={`glass-card p-5.5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 ${getInsightBorderClass(
                  insight.type
                )}`}
              >
                <div className="flex items-start gap-4.5">
                  <div className="mt-1 flex-shrink-0">{getInsightIcon(insight.type)}</div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{insight.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed mt-1.5 max-w-2xl">
                      {insight.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 self-end md:self-auto">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] text-gray-500 uppercase font-semibold">Priority</span>
                    <span
                      className={`text-[9px] font-extrabold px-2.5 py-1 rounded border ${getImpactBadgeClass(
                        insight.impact
                      )}`}
                    >
                      {insight.impact}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-600 hidden md:block" />
                </div>
              </div>
            ))}
          </div>

          {/* Educational Note */}
          <div className="p-5 rounded-2xl bg-gray-900/10 border border-gray-800/80 text-[11px] text-gray-500 leading-relaxed">
            <span className="font-bold text-gray-400 block mb-1">How do heuristics work?</span>
            These recommendations are computed dynamically directly from visitor telemetry logs stored in MongoDB. The algorithms analyze load speed anomalies, click density distributions, and scroll patterns relative to viewport heights to alert you of structural UX issues.
          </div>
        </div>
      )}
    </div>
  );
}
