const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

/* 바스티온 영웅별 스키마
"영웅별": 
{
"경계 모드로 처치": 357,
"경계 모드로 처치 - 10분당 평균": 0.03,
"경계 모드로 처치 - 한 게임 최고기록": 32,
"보조 발사 적중률": 25,
"수색 모드로 처치": 83,
"수색 모드로 처치 - 10분당 평균": 0.01,
"수색 모드로 처치 - 한 게임 최고기록": 9,
"자가 치유": 41750,
"자가 치유 - 10분당 평균": 3.25,
"자가 치유 - 한 게임 최고기록": 2658,
"전차 모드로 처치": 76,
"전차 모드로 처치 - 10분당 평균": 0.01,
"전차 모드로 처치 - 한 게임 최고기록": 11
}
*/

// path: /avg/rankplay/champion/바스티온
router.get('/', (req, res, next) => {
    const rank = req.query.rank;
    console.log(`Bastion champion analyzing... rank: ${rank}`);
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
                'rankplay.record.바스티온.영웅별':1,
                'rankplay.record.바스티온.게임': 1
            }
        },
        {
            $match: 
            {
                'rank.val': {$gte: min, $lt: max},
                'rankplay.record.바스티온.게임.치른 게임': {$gt: 9}
            }
        },
        {
            $group:
            {
                _id: null,
                count: {
                    $sum: 1
                },
                '평균_경계 모드로 처치': {
                    $avg: '$rankplay.record.바스티온.영웅별.경계 모드로 처치'
                },
                '평균_경계 모드로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.바스티온.영웅별.경계 모드로 처치 - 10분당 평균'
                },
                '평균_경계 모드로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.바스티온.영웅별.경계 모드로 처치 - 한 게임 최고기록'
                },
                '평균_보조 발사 적중률': {
                    $avg: '$rankplay.record.바스티온.영웅별.보조 발사 적중률'
                },
                '평균_수색 모드로 처치': {
                    $avg: '$rankplay.record.바스티온.영웅별.수색 모드로 처치'
                },
                '평균_수색 모드로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.바스티온.영웅별.수색 모드로 처치 - 10분당 평균'
                },
                '평균_수색 모드로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.바스티온.영웅별.수색 모드로 처치 - 한 게임 최고기록'
                },
                '평균_자가 치유': {
                    $avg: '$rankplay.record.바스티온.영웅별.자가 치유'
                },
                '평균_자가 치유 - 10분당 평균': {
                    $avg: '$rankplay.record.바스티온.영웅별.자가 치유 - 10분당 평균'
                },
                '평균_자가 치유 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.바스티온.영웅별.자가 치유 - 한 게임 최고기록'
                },
                '평균_전차 모드로 처치': {
                    $avg: '$rankplay.record.바스티온.영웅별.전차 모드로 처치'
                },
                '평균_전차 모드로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.바스티온.영웅별.전차 모드로 처치 - 10분당 평균'
                },
                '평균_전차 모드로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.바스티온.영웅별.전차 모드로 처치 - 한 게임 최고기록'
                },

                '평균_게임당_경계 모드로 처치': {
                    $avg: { $divide: ['$rankplay.record.바스티온.영웅별.경계 모드로 처치', '$rankplay.record.바스티온.게임.치른 게임' ] }
                },
                '평균_게임당_수색 모드로 처치': {
                    $avg: { $divide: ['$rankplay.record.바스티온.영웅별.수색 모드로 처치', '$rankplay.record.바스티온.게임.치른 게임' ] }
                },
                '평균_게임당_자가 치유': {
                    $avg: { $divide: ['$rankplay.record.바스티온.영웅별.자가 치유', '$rankplay.record.바스티온.게임.치른 게임' ] }
                },
                '평균_게임당_전차 모드로 처치': {
                    $avg: { $divide: ['$rankplay.record.바스티온.영웅별.전차 모드로 처치', '$rankplay.record.바스티온.게임.치른 게임' ] }
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