const express = require("express");
const router = express.Router();
const {
  createEvent,
  getSessions,
  getSessionById,
  getHeatmap,
  getAIInsights
} = require("../controllers/eventController");

router.post("/events", createEvent);
router.get("/sessions", getSessions);
router.get("/sessions/:id", getSessionById);
router.get("/heatmap", getHeatmap);
router.get("/insights", getAIInsights);

module.exports = router;
