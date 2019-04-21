const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const dvaRouter = require('./champion/D-Va');

// path: /avg/rankplay/champion
router.use('/dva', dvaRouter);



module.exports = router;