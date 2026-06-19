const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    // If running locally, connect to local backend on port 5000
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5000/api";
    }
  }
  // Deployed / production URL fallback
  return process.env.NEXT_PUBLIC_API_URL || "https://user-analytics-platform.onrender.com/api";
};

const API_BASE_URL = getApiBaseUrl();

export async function fetchSessions() {
  const res = await fetch(`${API_BASE_URL}/sessions`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export async function fetchSessionDetails(sessionId) {
  const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch session details");
  return res.json();
}

export async function fetchHeatmapData(pageUrl) {
  const res = await fetch(`${API_BASE_URL}/heatmap?page=${encodeURIComponent(pageUrl)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch heatmap data");
  return res.json();
}

export async function fetchAIInsights() {
  const res = await fetch(`${API_BASE_URL}/insights`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch AI insights");
  return res.json();
}
