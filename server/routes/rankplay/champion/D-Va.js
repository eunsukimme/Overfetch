const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const User = require('../../../models/user');

// path: /avg/rankplay/champion/dva
router.get('/', (req, res, next) => {
    console.log('hello world');
    const rank = req.query.rank;
    console.log(rank);      // bug
    let min, max;
    {
        if(rank < 1500){
            min = 500;
            max = 1500;
        }
        else if(rank < 2000){
            min = 1500;
            max = 2000;
        }
        else if(rank < 2500){
            min = 2000;
            max = 2500;
        }
        else if(rank < 3000){
            min = 2500;
            max = 3000;
        }
        else if(rank < 3500){
            min = 3000;
            max = 3500;
        }
        else if(rank < 4000){
            min = 3500;
            max = 4000;
        }
        else if(rank < 5000){
            min = 4000;
            max = 5000;
        }
        else {
            return res.status(400).json({'error': '잘못된 랭크 정보입니다'});
        }
    }
    const aggregation = User.aggregate([
        {
            $project: 
            {
                rank: 1,
                'rankplay.record.D-Va.영웅별':1
            }
        },
        {
            $match: 
            {
                'rank.val': {$gte: min, $lt: max}
            }
        },
        {
            $group:
            {
                _id: null,
                avg_field: {
                    $avg: '$rankplay.record.D-Va.영웅별'
                }
            }
        }
    ]);
    aggregation.options = { allowDiskUse: true };
    aggregation.exec((err, users) => {
        if(err) return res.json({'error': err});
        return res.json(users);
    });
})

module.exports = router;