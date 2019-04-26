const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

/* 루시우 영웅별 스키마
"영웅별": 
{
"보조 발사 적중률": 25,
"소리 방벽 제공": 373,
"소리 방벽 제공 - 10분당 평균": 0.02,
"소리 방벽 제공 - 한 게임 최고기록": 29,
"자가 치유": 47120,
"자가 치유 - 10분당 평균": 2.98,
"자가 치유 - 한 게임 최고기록": 2581
}
*/

// path: /avg/rankplay/champion/루시우
router.get('/', (req, res, next) => {
    const rank = req.query.rank;
    console.log(`lucio champion analyzing... rank: ${rank}`);
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
                'rankplay.record.루시우.영웅별':1,
                'rankplay.record.루시우.게임': 1
            }
        },
        {
            $match: 
            {
                'rank.val': {$gte: min, $lt: max},
                'rankplay.record.루시우.게임.치른 게임': {$gt: 9}
            }
        },
        {
            $group:
            {
                _id: null,
                count: {
                    $sum: 1
                },
                '평균_소리 방벽 제공': {
                    $avg: '$rankplay.record.루시우.영웅별.소리 방벽 제공'
                },
                '평균_소리 방벽 제공 - 10분당 평균': {
                    $avg: '$rankplay.record.루시우.영웅별.소리 방벽 제공 - 10분당 평균'
                },
                '평균_소리 방벽 제공 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.루시우.영웅별.소리 방벽 제공 - 한 게임 최고기록'
                },
                '평균_보조 발사 적중률': {
                    $avg: '$rankplay.record.루시우.영웅별.보조 발사 적중률'
                },
                '평균_자가 치유': {
                    $avg: '$rankplay.record.루시우.영웅별.자가 치유'
                },
                '평균_자가 치유 - 10분당 평균': {
                    $avg: '$rankplay.record.루시우.영웅별.자가 치유 - 10분당 평균'
                },
                '평균_자가 치유 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.루시우.영웅별.자가 치유 - 한 게임 최고기록'
                },

                '평균_게임당_소리 방벽 제공': {
                    $avg: { $divide: ['$rankplay.record.루시우.영웅별.소리 방벽 제공', '$rankplay.record.루시우.게임.치른 게임' ] }
                },
                '평균_게임당_소리 방벽 제공_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.루시우.영웅별.소리 방벽 제공', '$rankplay.record.루시우.게임.치른 게임' ]
                        }
                    }
                },
                '평균_게임당_소리 방벽 제공_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.루시우.영웅별.소리 방벽 제공', '$rankplay.record.루시우.게임.치른 게임' ]
                        }
                    }
                },
                '평균_게임당_자가 치유': {
                    $avg: { $divide: ['$rankplay.record.루시우.영웅별.자가 치유', '$rankplay.record.루시우.게임.치른 게임' ] }
                },
                '평균_게임당_자가 치유_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.루시우.영웅별.자가 치유', '$rankplay.record.루시우.게임.치른 게임' ]
                        }
                    }
                },
                '평균_게임당_자가 치유_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.루시우.영웅별.자가 치유', '$rankplay.record.루시우.게임.치른 게임' ]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                "평균_게임당_소리 방벽 제공.avg": "$평균_게임당_소리 방벽 제공",
                "평균_게임당_소리 방벽 제공.min": "$평균_게임당_소리 방벽 제공_최소",
                "평균_게임당_소리 방벽 제공.max": "$평균_게임당_소리 방벽 제공_최대",

                "평균_게임당_자가 치유.avg": "$평균_게임당_자가 치유",
                "평균_게임당_자가 치유.min": "$평균_게임당_자가 치유_최소",
                "평균_게임당_자가 치유.max": "$평균_게임당_자가 치유_최대",

            }
        },
        {
            $project: 
            {
                "평균_게임당_소리 방벽 제공": 1,
                "평균_게임당_자가 치유": 1,
            }
        }
    ]);
    aggregation.options = { allowDiskUse: true };
    aggregation.exec((err, users) => {
        if(err) return res.json({'error': err});
        //return res.json(users);
        return res.json(users);
    });
})

module.exports = router;