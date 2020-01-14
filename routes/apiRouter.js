const express = require("express");
const router = express.Router();
const profileRouter = require("./profileRouter");
const usersRouter = require("./usersRouter");
const avgRouter = require("./avgRouter");
const feedbackRouter = require("./feedbackRouter");

// path: ~/api
router.use("/profile", profileRouter);
router.use("/users", usersRouter);
router.use("/avg", avgRouter);
router.use("/feedback", feedbackRouter);

module.exports = router;
