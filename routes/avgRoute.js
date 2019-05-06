const express = require("express");
const router = express.Router();
const User = require("../models/user");
const rankRouter = require("./rankplay/rankRoute");
const quickRouter = require("./quickRoute");

// path: /avg
router.use("/rankplay", rankRouter);
router.use("/quickplay", quickRouter);

module.exports = router;
