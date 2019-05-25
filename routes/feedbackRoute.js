const express = require("express");
const router = express.Router();
const anaFeedback = require("./feedback/ana");
const meiFeedback = require("./feedback/mei");
const genjiFeedback = require("./feedback/genji");
const reaperFeedback = require("./feedback/reaper");
const mccreeFeedback = require("./feedback/mccree");
const dvaFeedback = require("./feedback/dva");
const reinhardtFeedback = require("./feedback/reinhardt");
const roadhogFeedback = require("./feedback/roadhog");
const winstonFeedback = require("./feedback/winston");
const orisaFeedback = require("./feedback/orisa");
const zaryaFeedback = require("./feedback/zarya");
const sombraFeedback = require("./feedback/sombra");
const widowmakerFeedback = require("./feedback/widowmaker");
const torbjornFeedback = require("./feedback/torbjorn");

// path: /feedback
router.use(`/${encodeURI("아나")}`, anaFeedback);
router.use(`/${encodeURI("메이")}`, meiFeedback);
router.use(`/${encodeURI("겐지")}`, genjiFeedback);
router.use(`/${encodeURI("리퍼")}`, reaperFeedback);
router.use(`/${encodeURI("맥크리")}`, mccreeFeedback);
router.use(`/${encodeURI("D-Va")}`, dvaFeedback);
router.use(`/${encodeURI("라인하르트")}`, reinhardtFeedback);
router.use(`/${encodeURI("로드호그")}`, roadhogFeedback);
router.use(`/${encodeURI("윈스턴")}`, winstonFeedback);
router.use(`/${encodeURI("오리사")}`, orisaFeedback);
router.use(`/${encodeURI("자리야")}`, zaryaFeedback);
router.use(`/${encodeURI("솜브라")}`, sombraFeedback);
router.use(`/${encodeURI("위도우메이커")}`, widowmakerFeedback);
router.use(`/${encodeURI("토르비욘")}`, torbjornFeedback);

module.exports = router;
