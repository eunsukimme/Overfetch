const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

/* 맥크리 영웅별 스키마
"영웅별": 
{
"보조 발사 적중률": 50,
"피스키퍼 난사로 처치": 14,
"피스키퍼 난사로 처치 - 10분당 평균": 0,
"피스키퍼 난사로 처치 - 한 게임 최고기록": 2,
"황야의 무법자로 처치": 66,
"황야의 무법자로 처치 - 10분당 평균": 0,
"황야의 무법자로 처치 - 한 게임 최고기록": 6
}
*/

// path: /avg/rankplay/champion/맥크리
router.get('/', (req, res, next) => {
    const rank = req.query.rank;
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
                'rankplay.record.맥크리.영웅별':1,
                'rankplay.record.맥크리.게임': 1
            }
        },
        {
            $match: 
            {
                'rank.val': {$gte: min, $lt: max},
                'rankplay.record.맥크리.게임.치른 게임': {$gt: 9}
            }
        },
        {
            $group:
            {
                _id: null,
                count: {
                    $sum: 1
                },
                /*'피스키퍼 난사로 처치': {
                    $avg: '$rankplay.record.맥크리.영웅별.피스키퍼 난사로 처치'
                },
                '피스키퍼 난사로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.맥크리.영웅별.피스키퍼 난사로 처치 - 10분당 평균'
                },
                '피스키퍼 난사로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.맥크리.영웅별.피스키퍼 난사로 처치 - 한 게임 최고기록'
                },
                '황야의 무법자로 처치': {
                    $avg: '$rankplay.record.맥크리.영웅별.황야의 무법자로 처치'
                },
                '황야의 무법자로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.맥크리.영웅별.황야의 무법자로 처치 - 10분당 평균'
                },
                '황야의 무법자로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.맥크리.영웅별.황야의 무법자로 처치 - 한 게임 최고기록'
                },*/

                '보조 발사 적중률': {
                    $avg: '$rankplay.record.맥크리.영웅별.보조 발사 적중률'
                },
                '보조 발사 적중률_최소': {
                    $min: {
                        $avg: '$rankplay.record.맥크리.영웅별.보조 발사 적중률'
                    }
                },
                '보조 발사 적중률_최대': {
                    $max: {
                        $avg: '$rankplay.record.맥크리.영웅별.보조 발사 적중률'
                    }
                },
                '게임당_피스키퍼 난사로 처치': {
                    $avg: { $divide: ['$rankplay.record.맥크리.영웅별.피스키퍼 난사로 처치', '$rankplay.record.맥크리.게임.치른 게임' ] }
                },
                '게임당_피스키퍼 난사로 처치_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.맥크리.영웅별.피스키퍼 난사로 처치', '$rankplay.record.맥크리.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_피스키퍼 난사로 처치_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.맥크리.영웅별.피스키퍼 난사로 처치', '$rankplay.record.맥크리.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_황야의 무법자로 처치': {
                    $avg: { $divide: ['$rankplay.record.맥크리.영웅별.황야의 무법자로 처치', '$rankplay.record.맥크리.게임.치른 게임' ] }
                },
                '게임당_황야의 무법자로 처치_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.맥크리.영웅별.황야의 무법자로 처치', '$rankplay.record.맥크리.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_황야의 무법자로 처치_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.맥크리.영웅별.황야의 무법자로 처치', '$rankplay.record.맥크리.게임.치른 게임' ]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                "게임당_피스키퍼 난사로 처치.avg": "$게임당_피스키퍼 난사로 처치",
                "게임당_피스키퍼 난사로 처치.min": "$게임당_피스키퍼 난사로 처치_최소",
                "게임당_피스키퍼 난사로 처치.max": "$게임당_피스키퍼 난사로 처치_최대",

                "게임당_황야의 무법자로 처치.avg": "$게임당_황야의 무법자로 처치",
                "게임당_황야의 무법자로 처치.min": "$게임당_황야의 무법자로 처치_최소",
                "게임당_황야의 무법자로 처치.max": "$게임당_황야의 무법자로 처치_최대",

                "보조 발사 적중률.avg": "$보조 발사 적중률",
                "보조 발사 적중률.min": "$보조 발사 적중률_최소",
                "보조 발사 적중률.max": "$보조 발사 적중률_최대",

            }
        },
        {
            $project: 
            {
                "게임당_피스키퍼 난사로 처치": 1,
                "게임당_황야의 무법자로 처치": 1,
                "보조 발사 적중률": 1,
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