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
  Eye
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
      setError("Failed to connect to the backend server. Is it running on port 5000?");
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
        return <Smartphone className="h-4 w-4 text-cyan-400" />;
      case "tablet":
        return <Tablet className="h-4 w-4 text-amber-400" />;
      default:
        return <Laptop className="h-4 w-4 text-indigo-400" />;
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
      <div className="flex-1 flex flex-col overflow-y-auto p-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Active Sessions</h2>
            <p className="text-xs text-gray-400 mt-1">
              Analyze visitor interaction events and trace conversion workflows.
            </p>
          </div>
          <div className="flex items-center gap-3.5">
            {/* Auto refresh toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
              />
              Auto-refresh (5s)
            </label>
            <button
              onClick={() => loadData(false)}
              className="flex items-center gap-2 text-xs font-bold bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 hover:border-gray-700 px-4 py-2.5 rounded-xl transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-indigo-400" : ""}`} />
              Sync Database
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-red-300 text-xs flex items-center justify-between">
            <span className="font-semibold leading-relaxed">{error}</span>
            <button 
              onClick={() => loadData(false)}
              className="text-red-400 font-bold hover:underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Analytics KPI Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Unique Sessions */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Sessions</span>
            </div>
            <p className="text-3xl font-extrabold text-white">{totalSessions}</p>
            <p className="text-xs text-gray-400 mt-1">Unique tracking sessions</p>
          </div>

          {/* Card 2: Click interactions */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                <MousePointer className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Total Clicks</span>
            </div>
            <p className="text-3xl font-extrabold text-white">{totalClicks}</p>
            <p className="text-xs text-gray-400 mt-1">Interactive click events</p>
          </div>

          {/* Card 3: Avg Duration */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Avg Time</span>
            </div>
            <p className="text-3xl font-extrabold text-white">{avgDuration}s</p>
            <p className="text-xs text-gray-400 mt-1">Active engagement span</p>
          </div>

          {/* Card 4: Device breakdown */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                <Laptop className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Devices</span>
            </div>
            <div className="flex items-center gap-3.5 mt-2">
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-white">{desktopCount}</span>
                <span className="text-[9px] text-gray-400 uppercase font-semibold">Desktop</span>
              </div>
              <div className="h-8 w-px bg-gray-800"></div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-white">{mobileCount}</span>
                <span className="text-[9px] text-gray-400 uppercase font-semibold">Mobile</span>
              </div>
              <div className="h-8 w-px bg-gray-800"></div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-white">{tabletCount}</span>
                <span className="text-[9px] text-gray-400 uppercase font-semibold">Tablet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Filter Bar */}
        <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search session ID, browser, OS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Device:</span>
            <div className="flex p-1 bg-gray-950 border border-gray-800/80 rounded-xl">
              {[
                { label: "All", value: "all" },
                { label: "Desktop", value: "desktop" },
                { label: "Mobile", value: "mobile" },
                { label: "Tablet", value: "tablet" }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setDeviceFilter(tab.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    deviceFilter === tab.value 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15" 
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions Table Panel */}
        <div className="glass-card rounded-2xl border border-gray-800/80 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-800 bg-[#0f1524]/50">
                  <th className="px-6 py-4.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Session Identifier</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Device / System</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Events</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Interaction</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {loading && sessions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="h-6 w-6 text-indigo-400 animate-spin" />
                        Analyzing event collections...
                      </div>
                    </td>
                  </tr>
                ) : filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <HelpCircle className="h-6 w-6 text-gray-600" />
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
                        className={`hover:bg-gray-800/35 transition-colors cursor-pointer ${
                          isSelected ? "bg-indigo-600/5 hover:bg-indigo-600/10" : ""
                        }`}
                        onClick={() => handleSelectSession(session)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-white font-mono truncate max-w-[200px]">
                              {session.session_id}
                            </span>
                            <span className="text-[10px] text-gray-500 font-semibold select-none flex gap-1 items-center">
                              <Eye className="h-3 w-3 inline text-emerald-500/80" />
                              {session.pages_visited.length} page(s) visited: {session.pages_visited.slice(0, 2).join(", ")}
                              {session.pages_visited.length > 2 && "..."}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-950 rounded-lg">
                              {getDeviceIcon(session.device_type)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-gray-200">{session.browser}</span>
                              <span className="text-[10px] text-gray-500 font-medium">{session.os}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-300 font-bold font-mono">
                            {session.total_events}
                            <span className="text-[10px] text-gray-500 font-normal">events</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-300 font-semibold font-mono">
                            {session.duration_seconds}s
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-300">
                            {getRelativeTime(session.last_seen)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                              isSelected
                                ? "bg-indigo-600 border-indigo-500 text-white"
                                : "bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white"
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
