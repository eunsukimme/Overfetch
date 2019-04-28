const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

/* 파라 영웅별 스키마
"영웅별": 
{
"로켓 명중": 448,
"로켓 명중 - 10분당 평균": 0.06,
"로켓 명중 - 한 게임 최고기록": 33,
"보조 발사 적중률": 48,
"직격률": 15,
"포화로 처치": 51,
"포화로 처치 - 10분당 평균": 0.01,
"포화로 처치 - 한 게임 최고기록": 7
}
*/

// path: /avg/rankplay/champion/파라
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
                'rankplay.record.파라.영웅별':1,
                'rankplay.record.파라.게임': 1
            }
        },
        {
            $match: 
            {
                'rank.val': {$gte: min, $lt: max},
                'rankplay.record.파라.게임.치른 게임': {$gt: 9}
            }
        },
        {
            $group:
            {
                _id: null,
                count: {
                    $sum: 1
                },
                '로켓 명중': {
                    $avg: '$rankplay.record.파라.영웅별.로켓 명중'
                },
                '로켓 명중 - 10분당 평균': {
                    $avg: '$rankplay.record.파라.영웅별.로켓 명중 - 10분당 평균'
                },
                '로켓 명중 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.파라.영웅별.로켓 명중 - 한 게임 최고기록'
                },
                '포화로 처치': {
                    $avg: '$rankplay.record.파라.영웅별.포화로 처치'
                },
                '포화로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.파라.영웅별.포화로 처치 - 10분당 평균'
                },
                '포화로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.파라.영웅별.포화로 처치 - 한 게임 최고기록'
                },

                '보조 발사 적중률': {
                    $avg: '$rankplay.record.파라.영웅별.보조 발사 적중률'
                },
                '보조 발사 적중률_최소': {
                    $min: {
                        $avg: '$rankplay.record.파라.영웅별.보조 발사 적중률'
                    }
                },
                '보조 발사 적중률_최대': {
                    $max: {
                        $avg: '$rankplay.record.파라.영웅별.보조 발사 적중률'
                    }
                },
                '직격률': {
                    $avg: '$rankplay.record.파라.영웅별.직격률'
                },
                '직격률_최소': {
                    $min: {
                        $avg: '$rankplay.record.파라.영웅별.직격률'
                    }
                },
                '직격률_최대': {
                    $max: {
                        $avg: '$rankplay.record.파라.영웅별.직격률'
                    }
                },
                '게임당_로켓 명중': {
                    $avg: { $divide: ['$rankplay.record.파라.영웅별.로켓 명중', '$rankplay.record.파라.게임.치른 게임' ] }
                },
                '게임당_로켓 명중_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.파라.영웅별.로켓 명중', '$rankplay.record.파라.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_로켓 명중_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.파라.영웅별.로켓 명중', '$rankplay.record.파라.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_포화로 처치': {
                    $avg: { $divide: ['$rankplay.record.파라.영웅별.포화로 처치', '$rankplay.record.파라.게임.치른 게임' ] }
                },
                '게임당_포화로 처치_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.파라.영웅별.포화로 처치', '$rankplay.record.파라.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_포화로 처치_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.파라.영웅별.포화로 처치', '$rankplay.record.파라.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_얼린 적': {
                    $avg: { $divide: ['$rankplay.record.파라.영웅별.얼린 적', '$rankplay.record.파라.게임.치른 게임' ] }
                },
                '게임당_얼린 적_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.파라.영웅별.얼린 적', '$rankplay.record.파라.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_얼린 적_최대':{
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.파라.영웅별.얼린 적', '$rankplay.record.파라.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_자가 치유': {
                    $avg: { $divide: ['$rankplay.record.파라.영웅별.자가 치유', '$rankplay.record.파라.게임.치른 게임' ] }
                },
                '게임당_자가 치유_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.파라.영웅별.자가 치유', '$rankplay.record.파라.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_자가 치유_최대':{
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.파라.영웅별.자가 치유', '$rankplay.record.파라.게임.치른 게임' ]
                        }
                    }
                },
            }
        },
        {
            $addFields: {
                "게임당_로켓 명중.avg": "$게임당_로켓 명중",
                "게임당_로켓 명중.min": "$게임당_로켓 명중_최소",
                "게임당_로켓 명중.max": "$게임당_로켓 명중_최대",

                "게임당_포화로 처치.avg": "$게임당_포화로 처치",
                "게임당_포화로 처치.min": "$게임당_포화로 처치_최소",
                "게임당_포화로 처치.max": "$게임당_포화로 처치_최대",

                "보조 발사 적중률.avg": "$보조 발사 적중률",
                "보조 발사 적중률.min": "$보조 발사 적중률_최소",
                "보조 발사 적중률.max": "$보조 발사 적중률_최대",

                "직격률.avg": "$직격률",
                "직격률.min": "$직격률_최소",
                "직격률.max": "$직격률_최대",
            }
        },
        {
            $project: 
            {
                "게임당_로켓 명중": 1,
                "게임당_포화로 처치": 1,
                "보조 발사 적중률": 1,
                "직격률": 1
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