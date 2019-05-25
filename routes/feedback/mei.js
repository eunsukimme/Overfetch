const express = require("express");
const router = express.Router();

// path: /feedback/메이
router.get(`/${encodeURI("게임당_재운_적")}/low`, (req, res, next) => {
  res.json({ feedback: "hello low mei!" });
});

router.get(`/${encodeURI("게임당_재운_적")}/high`, (req, res, next) => {
  res.json({ feedback: "hello high mei!" });
});

module.exports = router;
