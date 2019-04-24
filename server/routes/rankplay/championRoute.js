const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const anaRouter = require('./champion/Ana');
const asheRouter = require('./champion/Ashe');
const baptisteRouter = require('./champion/Baptiste');
const bastionRouter = require('./champion/Bastion');
const brigitteRouter = require('./champion/Brigitte');
const dvaRouter = require('./champion/D-Va');
const doomfistRouter = require('./champion/Doomfist');
const genziRouter = require('./champion/Genzi');
const hanzoRouter = require('./champion/Hanzo');

// path: /avg/rankplay/champion
router.use(`/${encodeURI('D-Va')}`, dvaRouter);
router.use(`/${encodeURI('아나')}`, anaRouter);
router.use(`/${encodeURI('애쉬')}`, asheRouter);
router.use(`/${encodeURI('바티스트')}`, baptisteRouter);
router.use(`/${encodeURI('바스티온')}`, bastionRouter);
router.use(`/${encodeURI('브리기테')}`, brigitteRouter);
router.use(`/${encodeURI('둠피스트')}`, doomfistRouter);
router.use(`/${encodeURI('겐지')}`, genziRouter);
router.use(`/${encodeURI('한조')}`, hanzoRouter);


module.exports = router;