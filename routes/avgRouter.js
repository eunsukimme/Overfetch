const express = require("express");
const router = express.Router();
const rankRouter = require("./rankplay/rankRoute");
const quickRouter = require("./quickRouter");

// path: /avg
router.use("/rankplay", rankRouter);
router.use("/quickplay", quickRouter);

module.exports = router;
