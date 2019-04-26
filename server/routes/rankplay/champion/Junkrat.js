const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

/* 정크랫 영웅별 스키마
"영웅별": 
{
"덫에 걸린 적": 59,
"덫에 걸린 적 - 10분당 평균": 0.01,
"덫에 걸린 적 - 한 게임 최고기록": 10,
"보조 발사 적중률": 17,
"죽이는 타이어로 처치": 29,
"죽이는 타이어로 처치 - 10분당 평균": 0,
"죽이는 타이어로 처치 - 한 게임 최고기록": 7,
"충격 지뢰로 처치": 48,
"충격 지뢰로 처치 - 10분당 평균": 0.01,
"충격 지뢰로 처치 - 한 게임 최고기록": 7
}
*/

// path: /avg/rankplay/champion/정크랫
router.get('/', (req, res, next) => {
    const rank = req.query.rank;
    console.log(`junkrat champion analyzing... rank: ${rank}`);
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
                'rankplay.record.정크랫.영웅별':1,
                'rankplay.record.정크랫.게임': 1
            }
        },
        {
            $match: 
            {
                'rank.val': {$gte: min, $lt: max},
                'rankplay.record.정크랫.게임.치른 게임': {$gt: 9}
            }
        },
        {
            $group:
            {
                _id: null,
                count: {
                    $sum: 1
                },
                '평균_덫에 걸린 적': {
                    $avg: '$rankplay.record.정크랫.영웅별.덫에 걸린 적'
                },
                '평균_덫에 걸린 적 - 10분당 평균': {
                    $avg: '$rankplay.record.정크랫.영웅별.덫에 걸린 적 - 10분당 평균'
                },
                '평균_덫에 걸린 적 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.정크랫.영웅별.덫에 걸린 적 - 한 게임 최고기록'
                },
                '평균_보조 발사 적중률': {
                    $avg: '$rankplay.record.정크랫.영웅별.보조 발사 적중률'
                },
                '평균_죽이는 타이어로 처치': {
                    $avg: '$rankplay.record.정크랫.영웅별.죽이는 타이어로 처치'
                },
                '평균_죽이는 타이어로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.정크랫.영웅별.죽이는 타이어로 처치 - 10분당 평균'
                },
                '평균_죽이는 타이어로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.정크랫.영웅별.죽이는 타이어로 처치 - 한 게임 최고기록'
                },
                '평균_충격 지뢰로 처치': {
                    $avg: '$rankplay.record.정크랫.영웅별.충격 지뢰로 처치'
                },
                '평균_충격 지뢰로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.정크랫.영웅별.충격 지뢰로 처치 - 10분당 평균'
                },
                '평균_충격 지뢰로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.정크랫.영웅별.충격 지뢰로 처치 - 한 게임 최고기록'
                },

                '평균_게임당_덫에 걸린 적': {
                    $avg: { $divide: ['$rankplay.record.정크랫.영웅별.덫에 걸린 적', '$rankplay.record.정크랫.게임.치른 게임' ] }
                },
                '평균_게임당_덫에 걸린 적_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.정크랫.영웅별.덫에 걸린 적', '$rankplay.record.정크랫.게임.치른 게임' ]
                        }
                    }
                },
                '평균_게임당_덫에 걸린 적_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.정크랫.영웅별.덫에 걸린 적', '$rankplay.record.정크랫.게임.치른 게임' ]
                        }
                    }
                },
                '평균_게임당_죽이는 타이어로 처치': {
                    $avg: { $divide: ['$rankplay.record.정크랫.영웅별.죽이는 타이어로 처치', '$rankplay.record.정크랫.게임.치른 게임' ] }
                },
                '평균_게임당_죽이는 타이어로 처치_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.정크랫.영웅별.죽이는 타이어로 처치', '$rankplay.record.정크랫.게임.치른 게임' ]
                        }
                    }
                },
                '평균_게임당_죽이는 타이어로 처치_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.정크랫.영웅별.죽이는 타이어로 처치', '$rankplay.record.정크랫.게임.치른 게임' ]
                        }
                    }
                },
                '평균_게임당_충격 지뢰로 처치': {
                    $avg: { $divide: ['$rankplay.record.정크랫.영웅별.충격 지뢰로 처치', '$rankplay.record.정크랫.게임.치른 게임' ] }
                },
                '평균_게임당_충격 지뢰로 처치_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.정크랫.영웅별.충격 지뢰로 처치', '$rankplay.record.정크랫.게임.치른 게임' ]
                        }
                    }
                },
                '평균_게임당_충격 지뢰로 처치_최대':{
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.정크랫.영웅별.충격 지뢰로 처치', '$rankplay.record.정크랫.게임.치른 게임' ]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                "평균_게임당_덫에 걸린 적.avg": "$평균_게임당_덫에 걸린 적",
                "평균_게임당_덫에 걸린 적.min": "$평균_게임당_덫에 걸린 적_최소",
                "평균_게임당_덫에 걸린 적.max": "$평균_게임당_덫에 걸린 적_최대",

                "평균_게임당_죽이는 타이어로 처치.avg": "$평균_게임당_죽이는 타이어로 처치",
                "평균_게임당_죽이는 타이어로 처치.min": "$평균_게임당_죽이는 타이어로 처치_최소",
                "평균_게임당_죽이는 타이어로 처치.max": "$평균_게임당_죽이는 타이어로 처치_최대",

                "평균_게임당_충격 지뢰로 처치.avg": "$평균_게임당_충격 지뢰로 처치",
                "평균_게임당_충격 지뢰로 처치.min": "$평균_게임당_충격 지뢰로 처치_최소",
                "평균_게임당_충격 지뢰로 처치.max": "$평균_게임당_충격 지뢰로 처치_최대",
            }
        },
        {
            $project: 
            {
                "평균_게임당_덫에 걸린 적": 1,
                "평균_게임당_죽이는 타이어로 처치": 1,
                "평균_게임당_충격 지뢰로 처치": 1
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