const express = require('express');
const router = express.Router();
const User = require('../models/user');

// path: /avg
router.get('/win_rate', (req, res, next) => {
    let aggregation = User.aggregate(
    [
    { $project: 
        {
            rank: 1, 'rankplay.record.겐지.게임.승률':1
        }
    },
    { $match: 
        {
            'rank.val': {$gt: 2000, $lte: 2500 }
        }
    },
    {
        $group:
        {
            _id: null,
            avg_win_rate: {
                $avg: '$rankplay.record.겐지.게임.승률'
            }
        }
    }]
    );
    aggregation.options = { allowDiskUse: true, maxTimeMS: 20000 };
    aggregation.exec((err, users) => {
        if(err) return res.json({'error': err});
        return res.json(users);
    });
});

module.exports = router;