const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const anaRouter = require("./champion/ana");
const asheRouter = require("./champion/ashe");
const baptisteRouter = require("./champion/Baptiste");
const bastionRouter = require("./champion/Bastion");
const brigitteRouter = require("./champion/Brigitte");
const dvaRouter = require("./champion/D-Va");
const doomfistRouter = require("./champion/Doomfist");
const genziRouter = require("./champion/Genzi");
const hanzoRouter = require("./champion/Hanzo");
const junkratRouter = require("./champion/Junkrat");
const lucioRouter = require("./champion/Lucio");
const mccreeRouter = require("./champion/Mccree");
const meiRouter = require("./champion/Mei");
const mercyRouter = require("./champion/Mercy");
const moiraRouter = require("./champion/Moira");
const orisaRouter = require("./champion/Orisa");
const pharahRouter = require("./champion/Pharah");
const reaperRouter = require("./champion/Reaper");
const reinhardtRouter = require("./champion/Reinhardt");
const roadhogRouter = require("./champion/Roadhog");
const soldierRouter = require("./champion/Soldier");
const sombraRouter = require("./champion/Sombra");
const symmetraRouter = require("./champion/Symmetra");
const torbjornRouter = require("./champion/Torbjorn");
const tracerRouter = require("./champion/Tracer");
const widowmakerRouter = require("./champion/Widowmaker");
const winstonRouter = require("./champion/Winston");
const wreckingballRouter = require("./champion/Wreckingball");
const zaryaRouter = require("./champion/Zarya");
const zenyattaRouter = require("./champion/Zenyatta");

// path: /avg/rankplay/champion
router.use(`/${encodeURI("D-Va")}`, dvaRouter);
router.use(`/${encodeURI("아나")}`, anaRouter);
router.use(`/${encodeURI("애쉬")}`, asheRouter);
router.use(`/${encodeURI("바티스트")}`, baptisteRouter);
router.use(`/${encodeURI("바스티온")}`, bastionRouter);
router.use(`/${encodeURI("브리기테")}`, brigitteRouter);
router.use(`/${encodeURI("둠피스트")}`, doomfistRouter);
router.use(`/${encodeURI("겐지")}`, genziRouter);
router.use(`/${encodeURI("한조")}`, hanzoRouter);
router.use(`/${encodeURI("정크랫")}`, junkratRouter);
router.use(`/${encodeURI("루시우")}`, lucioRouter);
router.use(`/${encodeURI("맥크리")}`, mccreeRouter);
router.use(`/${encodeURI("메이")}`, meiRouter);
router.use(`/${encodeURI("메르시")}`, mercyRouter);
router.use(`/${encodeURI("모이라")}`, moiraRouter);
router.use(`/${encodeURI("오리사")}`, orisaRouter);
router.use(`/${encodeURI("파라")}`, pharahRouter);
router.use(`/${encodeURI("리퍼")}`, reaperRouter);
router.use(`/${encodeURI("라인하르트")}`, reinhardtRouter);
router.use(`/${encodeURI("로드호그")}`, roadhogRouter);
router.use(`/${encodeURI("솔저")}`, soldierRouter);
router.use(`/${encodeURI("솜브라")}`, sombraRouter);
router.use(`/${encodeURI("시메트라")}`, symmetraRouter);
router.use(`/${encodeURI("토르비욘")}`, torbjornRouter);
router.use(`/${encodeURI("트레이서")}`, tracerRouter);
router.use(`/${encodeURI("위도우메이커")}`, widowmakerRouter);
router.use(`/${encodeURI("윈스턴")}`, winstonRouter);
router.use(`/${encodeURI("레킹볼")}`, wreckingballRouter);
router.use(`/${encodeURI("자리야")}`, zaryaRouter);
router.use(`/${encodeURI("젠야타")}`, zenyattaRouter);

module.exports = router;