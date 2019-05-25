const express = require("express");
const router = express.Router();

// path: /feedback/아나
router.get(`/${encodeURI("게임당_재운_적")}/low`, (req, res, next) => {
  res.json({ feedback: "hello low ana!" });
});

router.get(`/${encodeURI("게임당_재운_적")}/high`, (req, res, next) => {
  res.json({ feedback: "hello high ana!" });
});

module.exports = router;
