const express = require("express");
const router = express.Router();
const anaFeedback = require("./feedback/ana");
const meiFeedback = require("./feedback/mei");

// path: /feedback
router.use(`/${encodeURI("아나")}`, anaFeedback);
router.use(`/${encodeURI("메이")}`, anaFeedback);

module.exports = router;
