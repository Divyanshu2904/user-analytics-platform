const Event = require("../models/Event");

// Ingest one or more events
const createEvent = async (req, res) => {
  try {
    const eventsData = Array.isArray(req.body) ? req.body : [req.body];

    if (eventsData.length === 0) {
      return res.status(400).json({ message: "No events provided" });
    }

    // Validate fields for each event
    for (const data of eventsData) {
      if (!data.session_id || !data.event_type || !data.page_url) {
        return res.status(400).json({ 
          message: "Missing required fields (session_id, event_type, page_url)" 
        });
      }
    }

    const savedEvents = await Event.insertMany(
      eventsData.map(data => ({
        session_id: data.session_id,
        event_type: data.event_type,
        page_url: data.page_url,
        timestamp: data.timestamp || new Date(),
        x: data.x !== undefined ? data.x : null,
        y: data.y !== undefined ? data.y : null,
        window_width: data.window_width !== undefined ? data.window_width : null,
        window_height: data.window_height !== undefined ? data.window_height : null,
        scroll_depth: data.scroll_depth !== undefined ? data.scroll_depth : null,
        load_time_ms: data.load_time_ms !== undefined ? data.load_time_ms : null,
        browser: data.browser || "Unknown",
        os: data.os || "Unknown",
        device_type: data.device_type || "desktop"
      }))
    );

    res.status(201).json({ 
      message: `${savedEvents.length} event(s) saved successfully`, 
      events: savedEvents 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get list of all unique sessions with stats
const getSessions = async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          total_events: { $sum: 1 },
          start_time: { $min: "$timestamp" },
          last_seen: { $max: "$timestamp" },
          pages: { $addToSet: "$page_url" },
          // Grab user agent info from the first matching document
          browser: { $first: "$browser" },
          os: { $first: "$os" },
          device_type: { $first: "$device_type" },
          // Count specific event types
          click_count: {
            $sum: { $cond: [{ $eq: ["$event_type", "click"] }, 1, 0] }
          },
          scroll_count: {
            $sum: { $cond: [{ $eq: ["$event_type", "scroll"] }, 1, 0] }
          }
        }
      },
      { $sort: { last_seen: -1 } }
    ]);

    const formatted = sessions.map(s => {
      const durationMs = new Date(s.last_seen) - new Date(s.start_time);
      return {
        session_id: s._id,
        total_events: s.total_events,
        start_time: s.start_time,
        last_seen: s.last_seen,
        duration_seconds: Math.round(durationMs / 1000),
        pages_visited: s.pages,
        browser: s.browser || "Unknown",
        os: s.os || "Unknown",
        device_type: s.device_type || "desktop",
        clicks: s.click_count,
        scrolls: s.scroll_count
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get details/timeline for a specific session
const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const events = await Event.find({ session_id: id }).sort({ timestamp: 1 });

    if (events.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get click coordinate heatmap data for a page
const getHeatmap = async (req, res) => {
  try {
    const { page } = req.query;

    if (!page) {
      return res.status(400).json({ message: "page query parameter required" });
    }

    // Match either full match or relative page urls
    const clicks = await Event.find({
      event_type: "click",
      page_url: { $regex: page, $options: "i" },
      x: { $ne: null },
      y: { $ne: null }
    }).select("x y window_width window_height timestamp");

    res.status(200).json(clicks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Heuristic-based AI behavior analysis insights
const getAIInsights = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    if (totalEvents === 0) {
      return res.status(200).json({
        summary: "No user activity recorded yet. Embed your tracker on the demo site and perform actions to generate insights.",
        insights: []
      });
    }

    // 1. Devices breakdown
    const devices = await Event.aggregate([
      { $group: { _id: "$device_type", count: { $sum: 1 } } }
    ]);
    
    // 2. Average Page load time
    const avgLoadTime = await Event.aggregate([
      { $match: { event_type: "performance", load_time_ms: { $ne: null } } },
      { $group: { _id: null, avg_load: { $avg: "$load_time_ms" } } }
    ]);

    // 3. Page list with pageviews, clicks, average scroll depth
    const pageStats = await Event.aggregate([
      {
        $group: {
          _id: "$page_url",
          pageviews: {
            $sum: { $cond: [{ $eq: ["$event_type", "page_view"] }, 1, 0] }
          },
          clicks: {
            $sum: { $cond: [{ $eq: ["$event_type", "click"] }, 1, 0] }
          },
          avg_scroll: {
            $avg: "$scroll_depth"
          }
        }
      }
    ]);

    const insights = [];

    // Check load times
    if (avgLoadTime.length > 0 && avgLoadTime[0].avg_load > 1500) {
      insights.push({
        type: "warning",
        title: "Slow Page Loading Detected",
        description: `Average load time is ${(avgLoadTime[0].avg_load / 1000).toFixed(2)}s. Slow load times damage user experience and increase bounce rate. We suggest checking image optimization and reducing heavy blocking scripts.`,
        impact: "High"
      });
    } else if (avgLoadTime.length > 0) {
      insights.push({
        type: "success",
        title: "Excellent Page Performance",
        description: `Your pages are loading within ${(avgLoadTime[0].avg_load).toFixed(0)}ms on average, which satisfies Google Core Web Vitals standards.`,
        impact: "Low"
      });
    }

    // Check click engagement on key pages
    pageStats.forEach(page => {
      if (page.pageviews > 3 && page.clicks === 0) {
        insights.push({
          type: "danger",
          title: `Zero clicks on ${page._id}`,
          description: `Users visited ${page._id} ${page.pageviews} times but never clicked on anything. Check if there are broken links, confusing layouts, or if your Call to Action (CTA) buttons are missing.`,
          impact: "Critical"
        });
      } else if (page.pageviews > 0 && page.clicks / page.pageviews < 0.2) {
        insights.push({
          type: "warning",
          title: `Low engagement on ${page._id}`,
          description: `Only ${(page.clicks / page.pageviews * 100).toFixed(0)}% of visits on ${page._id} result in clicks. Consider repositioning links or making buttons stand out.`,
          impact: "Medium"
        });
      }

      if (page.avg_scroll && page.avg_scroll < 40) {
        insights.push({
          type: "warning",
          title: `Low scroll depth on ${page._id}`,
          description: `Users only scroll through ${page.avg_scroll.toFixed(0)}% of ${page._id} on average. Key conversion elements should be moved higher (above the fold) to capture attention.`,
          impact: "Medium"
        });
      }
    });

    // Device insights
    const mobileCount = (devices.find(d => d._id === "mobile")?.count || 0);
    const desktopCount = (devices.find(d => d._id === "desktop")?.count || 0);
    const totalDeviceCount = mobileCount + desktopCount;

    if (totalDeviceCount > 0 && (mobileCount / totalDeviceCount) > 0.4) {
      insights.push({
        type: "info",
        title: "Strong Mobile Presence",
        description: `Over ${(mobileCount / totalDeviceCount * 100).toFixed(0)}% of your event interactions originate from mobile screens. Ensure mobile styles, finger-friendly button targets, and touch scroll configurations are flawless.`,
        impact: "Medium"
      });
    }

    // If no negative insights are triggered, offer standard tips
    if (insights.length <= 1) {
      insights.push({
        type: "info",
        title: "Track Conversion Actions",
        description: "To gain deeper analytics insight, add custom button elements (like 'Sign Up' or 'Contact Submit') inside demo-site pages and track click locations.",
        impact: "Low"
      });
    }

    res.status(200).json({
      summary: `Analyzed ${totalEvents} event logs across ${pageStats.length} pages. Detected ${insights.filter(i => i.type === "danger" || i.type === "warning").length} optimization opportunities.`,
      insights
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { 
  createEvent, 
  getSessions, 
  getSessionById, 
  getHeatmap,
  getAIInsights
};
