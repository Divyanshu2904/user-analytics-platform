(function () {
  // Configurable API endpoint
  const API_ENDPOINT = "http://localhost:5000/api/events";

  // Helper to generate a simple unique ID
  function generateSessionId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  // Retrieve or create session_id using sessionStorage
  let sessionId = sessionStorage.getItem("cf_session_id");
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem("cf_session_id", sessionId);
  }

  // Parse User Agent for browser, OS, and device type
  function getDeviceDetails() {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    let os = "Unknown";
    let deviceType = "desktop";

    // Browser detection
    if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Browser";
    else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
    else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
    else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) browser = "Edge";
    else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
    else if (ua.indexOf("Safari") > -1) browser = "Safari";

    // OS detection
    if (ua.indexOf("Windows") > -1) os = "Windows";
    else if (ua.indexOf("Macintosh") > -1 || ua.indexOf("Mac OS") > -1) os = "macOS";
    else if (ua.indexOf("Android") > -1) {
      os = "Android";
      deviceType = "mobile";
    } else if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) {
      os = "iOS";
      deviceType = ua.indexOf("iPad") > -1 ? "tablet" : "mobile";
    } else if (ua.indexOf("Linux") > -1) os = "Linux";

    // Device fallback by screen width
    if (deviceType === "desktop") {
      const width = window.innerWidth;
      if (width < 768) deviceType = "mobile";
      else if (width >= 768 && width <= 1024) deviceType = "tablet";
    }

    return { browser, os, device_type: deviceType };
  }

  const deviceDetails = getDeviceDetails();

  // Helper to send events to the server
  function sendEvent(payload) {
    const data = {
      session_id: sessionId,
      page_url: window.location.pathname || "/",
      timestamp: new Date().toISOString(),
      ...deviceDetails,
      ...payload,
    };

    // Use sendBeacon if browser supports it and event type is unloading, otherwise fetch
    if (navigator.sendBeacon && payload.is_unloading) {
      delete data.is_unloading;
      const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      navigator.sendBeacon(API_ENDPOINT, blob);
      console.log("Event sent (beacon): " + data.event_type);
    } else {
      delete data.is_unloading;
      fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then(() => {
        console.log("Event sent: " + data.event_type);
      })
      .catch((err) => console.warn("Analytics tracking failed:", err));
    }
  }

  // 1. Track Page View immediately on script execution
  sendEvent({ event_type: "page_view" });

  // 2. Track Page Load Performance when resource is fully loaded
  window.addEventListener("load", function () {
    setTimeout(function () {
      let loadTimeMs = 0;
      if (window.performance && window.performance.timing) {
        const t = window.performance.timing;
        loadTimeMs = t.loadEventEnd - t.navigationStart;
      } else if (window.performance && typeof window.performance.getEntriesByType === "function") {
        const entries = window.performance.getEntriesByType("navigation");
        if (entries.length > 0) {
          loadTimeMs = entries[0].duration;
        }
      }
      
      if (loadTimeMs > 0) {
        sendEvent({
          event_type: "performance",
          load_time_ms: Math.round(loadTimeMs),
        });
      }
    }, 0);
  });

  // 3. Track Click Events
  document.addEventListener("click", function (event) {
    // Collect absolute document click coordinates
    const x = event.pageX;
    const y = event.pageY;
    
    // Capture page dimensions to draw responsive heatmap
    const windowWidth = document.documentElement.scrollWidth || window.innerWidth;
    const windowHeight = document.documentElement.scrollHeight || window.innerHeight;

    sendEvent({
      event_type: "click",
      x: x,
      y: y,
      window_width: windowWidth,
      window_height: windowHeight,
    });
  });

  // 4. Track Scroll Depth threshold events (25%, 50%, 75%, 100%)
  const trackedScrollThresholds = { 25: false, 50: false, 75: false, 100: false };

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const totalScrollable = documentHeight - windowHeight;
    if (totalScrollable <= 0) return;

    const scrollPercentage = Math.round((scrollTop / totalScrollable) * 100);

    // Check thresholds
    [25, 50, 75, 100].forEach((threshold) => {
      if (scrollPercentage >= threshold && !trackedScrollThresholds[threshold]) {
        trackedScrollThresholds[threshold] = true;
        sendEvent({
          event_type: "scroll",
          scroll_depth: threshold,
        });
      }
    });
  });
})();
