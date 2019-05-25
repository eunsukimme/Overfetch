const express = require("express");
const router = express.Router();
const anaFeedback = require("./feedback/ana");
const meiFeedback = require("./feedback/mei");
const genjiFeedback = require("./feedback/genji");
const reaperFeedback = require("./feedback/reaper");
const mccreeFeedback = require("./feedback/mccree");

// path: /feedback
router.use(`/${encodeURI("아나")}`, anaFeedback);
router.use(`/${encodeURI("메이")}`, meiFeedback);
router.use(`/${encodeURI("겐지")}`, genjiFeedback);
router.use(`/${encodeURI("리퍼")}`, reaperFeedback);
router.use(`/${encodeURI("맥크리")}`, mccreeFeedback);

module.exports = router;
