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

// path: /avg/rankplay/champion
router.use('/dva', dvaRouter);
router.use('/ana', anaRouter);
router.use('/ashe', asheRouter);
router.use('/baptiste', baptisteRouter);
router.use('/bastion', bastionRouter);
router.use('/brigitte', brigitteRouter);
router.use('/doomfist', doomfistRouter);


module.exports = router;