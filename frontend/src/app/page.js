"use client";

import { useState, useEffect } from "react";
import { 
  fetchSessions, 
  fetchSessionDetails 
} from "@/utils/api";
import SessionTimeline from "@/components/SessionTimeline";
import { 
  Users, 
  MousePointer, 
  Clock, 
  RefreshCw, 
  Search, 
  Laptop, 
  Smartphone, 
  Tablet, 
  HelpCircle,
  Eye,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedSessionEvents, setSelectedSessionEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshTimer, setRefreshTimer] = useState(0);

  const loadData = async (showSilently = false) => {
    if (!showSilently) setLoading(true);
    try {
      const data = await fetchSessions();
      setSessions(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the backend server. Is it running on Render/locally?");
    } finally {
      if (!showSilently) setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Auto refresh loop
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      loadData(true);
      setRefreshTimer((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleSelectSession = async (session) => {
    try {
      setSelectedSession(session);
      const events = await fetchSessionDetails(session.session_id);
      setSelectedSessionEvents(events);
    } catch (err) {
      console.error("Error loading timeline:", err);
    }
  };

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.session_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.browser.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.os.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDevice = deviceFilter === "all" || s.device_type === deviceFilter;
    return matchesSearch && matchesDevice;
  });

  // Calculate high-level stats
  const totalSessions = sessions.length;
  const totalClicks = sessions.reduce((acc, s) => acc + (s.clicks || 0), 0);
  const avgDuration = totalSessions > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.duration_seconds, 0) / totalSessions) 
    : 0;

  const desktopCount = sessions.filter((s) => s.device_type === "desktop").length;
  const mobileCount = sessions.filter((s) => s.device_type === "mobile").length;
  const tabletCount = sessions.filter((s) => s.device_type === "tablet").length;
  
  const getDeviceIcon = (device) => {
    switch (device) {
      case "mobile":
        return <Smartphone className="h-4.5 w-4.5 text-cyan-500" />;
      case "tablet":
        return <Tablet className="h-4.5 w-4.5 text-amber-500" />;
      default:
        return <Laptop className="h-4.5 w-4.5 text-blue-500" />;
    }
  };

  const getRelativeTime = (dateString) => {
    const diffMs = new Date() - new Date(dateString);
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 10) return "Just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Dashboard Main Panel */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">User Sessions</h2>
            <p className="text-xs text-slate-400 mt-1">
              Analyze visitor interaction events and trace conversion workflows.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto">
            {/* Auto refresh toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              Auto-refresh (5s)
            </label>
            <button
              onClick={() => loadData(false)}
              className="flex items-center gap-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-500" : "text-slate-400"}`} />
              Sync Database
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs flex items-center justify-between shadow-sm">
            <span className="font-semibold leading-relaxed">{error}</span>
            <button 
              onClick={() => loadData(false)}
              className="text-red-600 font-extrabold hover:underline cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Analytics KPI Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Unique Sessions */}
          <div className="bg-white border border-slate-100/80 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Sessions</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-800">{totalSessions}</p>
            <p className="text-xs text-slate-400 mt-1">Unique tracking sessions</p>
          </div>

          {/* Card 2: Click interactions */}
          <div className="bg-white border border-slate-100/80 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600">
                <MousePointer className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Clicks</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-800">{totalClicks}</p>
            <p className="text-xs text-slate-400 mt-1">Interactive click events</p>
          </div>

          {/* Card 3: Avg Duration */}
          <div className="bg-white border border-slate-100/80 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Avg Time</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-800">{avgDuration}s</p>
            <p className="text-xs text-slate-400 mt-1">Active engagement span</p>
          </div>

          {/* Card 4: Device breakdown */}
          <div className="bg-white border border-slate-100/80 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <Laptop className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Devices</span>
            </div>
            <div className="flex items-center gap-3.5 mt-2">
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-slate-800">{desktopCount}</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">Desktop</span>
              </div>
              <div className="h-8 w-px bg-slate-100"></div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-slate-800">{mobileCount}</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">Mobile</span>
              </div>
              <div className="h-8 w-px bg-slate-100"></div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-slate-800">{tabletCount}</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">Tablet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Filter Bar */}
        <div className="bg-white border border-slate-100/80 shadow-sm p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search session ID, browser, OS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto self-stretch md:self-auto justify-between md:justify-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Device:
            </span>
            <div className="flex p-1 bg-slate-50 border border-slate-200 rounded-xl">
              {[
                { label: "All", value: "all" },
                { label: "Desktop", value: "desktop" },
                { label: "Mobile", value: "mobile" },
                { label: "Tablet", value: "tablet" }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setDeviceFilter(tab.value)}
                  className={`px-3-5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    deviceFilter === tab.value 
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/10" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions Table Panel */}
        <div className="bg-white border border-slate-100/80 shadow-sm rounded-2xl overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Session Identifier</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Device / System</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Events</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Last Interaction</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && sessions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-400">
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
                        Analyzing event collections...
                      </div>
                    </td>
                  </tr>
                ) : filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <HelpCircle className="h-6 w-6 text-slate-300" />
                        No active sessions discovered matching criteria.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => {
                    const isSelected = selectedSession?.session_id === session.session_id;
                    return (
                      <tr 
                        key={session.session_id}
                        className={`hover:bg-slate-50/40 transition-colors cursor-pointer ${
                          isSelected ? "bg-blue-50/30 hover:bg-blue-50/40" : ""
                        }`}
                        onClick={() => handleSelectSession(session)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-slate-700 font-mono truncate max-w-[200px]">
                              {session.session_id}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold select-none flex gap-1 items-center">
                              <Eye className="h-3 w-3 inline text-emerald-500" />
                              {session.pages_visited.length} page(s) visited: {session.pages_visited.slice(0, 2).map(p => p.split('/').pop()).join(", ")}
                              {session.pages_visited.length > 2 && "..."}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                              {getDeviceIcon(session.device_type)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700">{session.browser}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{session.os}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold font-mono">
                            {session.total_events}
                            <span className="text-[10px] text-slate-400 font-medium">events</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-slate-600 font-bold font-mono">
                            {session.duration_seconds}s
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-slate-500 font-medium">
                            {getRelativeTime(session.last_seen)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-blue-600 border-blue-500 text-white shadow-sm"
                                : "bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800"
                            }`}
                          >
                            Timeline
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Slide-out Panel Timeline */}
      {selectedSession && (
        <SessionTimeline 
          session={selectedSession}
          events={selectedSessionEvents}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}
