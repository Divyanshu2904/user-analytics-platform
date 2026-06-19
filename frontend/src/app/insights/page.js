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
        return <AlertOctagon className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getInsightBorderClass = (type) => {
    switch (type) {
      case "danger":
        return "border-red-100 bg-red-50/10 hover:border-red-200";
      case "warning":
        return "border-amber-100 bg-amber-50/10 hover:border-amber-200";
      case "success":
        return "border-emerald-100 bg-emerald-50/10 hover:border-emerald-200";
      default:
        return "border-blue-100 bg-blue-50/10 hover:border-blue-200";
    }
  };

  const getImpactBadgeClass = (impact) => {
    switch (impact) {
      case "Critical":
        return "bg-red-50 text-red-600 border-red-100";
      case "High":
        return "bg-orange-50 text-orange-600 border-orange-100";
      case "Medium":
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-blue-50 text-blue-600 border-blue-100";
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-500 animate-pulse" />
            AI Design Advisor
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time heuristic analyzer mapping MongoDB event streams to actionable UX optimizations.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-500" : "text-slate-400"}`} />
          Recalculate Heuristics
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
            Scanning event logs & executing heuristic aggregations...
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-sm text-red-500">
          {error}
        </div>
      ) : (
        <div className="max-w-4xl space-y-6">
          {/* Summary Box */}
          <div className="bg-gradient-to-tr from-blue-50/70 to-indigo-50/30 border border-blue-100/50 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 flex-shrink-0">
              <Lightbulb className="h-6 w-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800">Aggregated Performance Summary</h3>
              <p className="text-sm text-slate-600 leading-relaxed mt-2 font-medium">
                {data.summary}
              </p>
            </div>
          </div>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
            Recommended Actions
          </p>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 gap-4">
            {data.insights.map((insight, index) => (
              <div
                key={index}
                className={`bg-white border rounded-2xl p-5.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 shadow-sm hover:shadow ${getInsightBorderClass(
                  insight.type
                )}`}
              >
                <div className="flex items-start gap-4.5">
                  <div className="mt-1 flex-shrink-0">{getInsightIcon(insight.type)}</div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">{insight.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1.5 max-w-2xl font-medium">
                      {insight.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 self-end md:self-auto">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Priority</span>
                    <span
                      className={`text-[9px] font-bold px-2.5 py-1 rounded border ${getImpactBadgeClass(
                        insight.impact
                      )}`}
                    >
                      {insight.impact}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 hidden md:block" />
                </div>
              </div>
            ))}
          </div>

          {/* Educational Note */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-400 leading-relaxed font-medium">
            <span className="font-bold text-slate-500 block mb-1">How do heuristics work?</span>
            These recommendations are computed dynamically directly from visitor telemetry logs stored in MongoDB. The algorithms analyze load speed anomalies, click density distributions, and scroll patterns relative to viewport heights to alert you of structural UX issues.
          </div>
        </div>
      )}
    </div>
  );
}
