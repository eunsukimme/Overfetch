const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const dvaRouter = require('./champion/D-Va');
const anaRouter = require('./champion/ana');
const asheRouter = require('./champion/ashe');

// path: /avg/rankplay/champion
router.use('/dva', dvaRouter);
router.use('/ana', anaRouter);
router.use('/ashe', asheRouter);


module.exports = router;