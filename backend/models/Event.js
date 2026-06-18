const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    index: true
  },
  event_type: {
    type: String,
    enum: ["page_view", "click", "scroll", "performance"],
    required: true
  },
  page_url: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  // Click event specific coordinates
  x: {
    type: Number,
    default: null
  },
  y: {
    type: Number,
    default: null
  },
  window_width: {
    type: Number,
    default: null
  },
  window_height: {
    type: Number,
    default: null
  },
  // Scroll event specific depth
  scroll_depth: {
    type: Number,
    default: null
  },
  // Performance event specific load time
  load_time_ms: {
    type: Number,
    default: null
  },
  // User Agent details
  browser: {
    type: String,
    default: "Unknown"
  },
  os: {
    type: String,
    default: "Unknown"
  },
  device_type: {
    type: String,
    default: "desktop"
  }
});

// Create compound index for querying session timeline efficiently
eventSchema.index({ session_id: 1, timestamp: 1 });

module.exports = mongoose.model("Event", eventSchema);
