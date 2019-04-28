const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

/* 메이 영웅별 스키마
"영웅별": 
{
"눈보라로 처치": 65,
"눈보라로 처치 - 10분당 평균": 0.01,
"눈보라로 처치 - 한 게임 최고기록": 10,
"막은 피해": 48078,
"막은 피해 - 10분당 평균": 6.04,
"막은 피해 - 한 게임 최고기록": 8437,
"보조 발사 적중률": 26,
"얼린 적": 154,
"얼린 적 - 10분당 평균": 0.02,
"얼린 적 - 한 게임 최고기록": 28,
"자가 치유": 10336,
"자가 치유 - 10분당 평균": 1.3,
"자가 치유 - 한 게임 최고기록": 1495
}
*/

// path: /avg/rankplay/champion/메이
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
                'rankplay.record.메이.영웅별':1,
                'rankplay.record.메이.게임': 1
            }
        },
        {
            $match: 
            {
                'rank.val': {$gte: min, $lt: max},
                'rankplay.record.메이.게임.치른 게임': {$gt: 9}
            }
        },
        {
            $group:
            {
                _id: null,
                count: {
                    $sum: 1
                },
                '눈보라로 처치': {
                    $avg: '$rankplay.record.메이.영웅별.눈보라로 처치'
                },
                '눈보라로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.메이.영웅별.눈보라로 처치 - 10분당 평균'
                },
                '눈보라로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.메이.영웅별.눈보라로 처치 - 한 게임 최고기록'
                },
                '막은 피해': {
                    $avg: '$rankplay.record.메이.영웅별.막은 피해'
                },
                '막은 피해 - 10분당 평균': {
                    $avg: '$rankplay.record.메이.영웅별.막은 피해 - 10분당 평균'
                },
                '막은 피해 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.메이.영웅별.막은 피해 - 한 게임 최고기록'
                },
                '얼린 적': {
                    $avg: '$rankplay.record.메이.영웅별.얼린 적'
                },
                '얼린 적 - 10분당 평균': {
                    $avg: '$rankplay.record.메이.영웅별.얼린 적 - 10분당 평균'
                },
                '얼린 적 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.메이.영웅별.얼린 적 - 한 게임 최고기록'
                },
                '자가 치유': {
                    $avg: '$rankplay.record.메이.영웅별.자가 치유'
                },
                '자가 치유 - 10분당 평균': {
                    $avg: '$rankplay.record.메이.영웅별.자가 치유 - 10분당 평균'
                },
                '자가 치유 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.메이.영웅별.자가 치유 - 한 게임 최고기록'
                },

                '보조 발사 적중률': {
                    $avg: '$rankplay.record.메이.영웅별.보조 발사 적중률'
                },
                '보조 발사 적중률_최소': {
                    $min: {
                        $avg: '$rankplay.record.메이.영웅별.보조 발사 적중률'
                    }
                },
                '보조 발사 적중률_최대': {
                    $max: {
                        $avg: '$rankplay.record.메이.영웅별.보조 발사 적중률'
                    }
                },
                '게임당_눈보라로 처치': {
                    $avg: { $divide: ['$rankplay.record.메이.영웅별.눈보라로 처치', '$rankplay.record.메이.게임.치른 게임' ] }
                },
                '게임당_눈보라로 처치_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.메이.영웅별.눈보라로 처치', '$rankplay.record.메이.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_눈보라로 처치_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.메이.영웅별.눈보라로 처치', '$rankplay.record.메이.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_막은 피해': {
                    $avg: { $divide: ['$rankplay.record.메이.영웅별.막은 피해', '$rankplay.record.메이.게임.치른 게임' ] }
                },
                '게임당_막은 피해_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.메이.영웅별.막은 피해', '$rankplay.record.메이.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_막은 피해_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.메이.영웅별.막은 피해', '$rankplay.record.메이.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_얼린 적': {
                    $avg: { $divide: ['$rankplay.record.메이.영웅별.얼린 적', '$rankplay.record.메이.게임.치른 게임' ] }
                },
                '게임당_얼린 적_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.메이.영웅별.얼린 적', '$rankplay.record.메이.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_얼린 적_최대':{
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.메이.영웅별.얼린 적', '$rankplay.record.메이.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_자가 치유': {
                    $avg: { $divide: ['$rankplay.record.메이.영웅별.자가 치유', '$rankplay.record.메이.게임.치른 게임' ] }
                },
                '게임당_자가 치유_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.메이.영웅별.자가 치유', '$rankplay.record.메이.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_자가 치유_최대':{
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.메이.영웅별.자가 치유', '$rankplay.record.메이.게임.치른 게임' ]
                        }
                    }
                },
            }
        },
        {
            $addFields: {
                "게임당_눈보라로 처치.avg": "$게임당_눈보라로 처치",
                "게임당_눈보라로 처치.min": "$게임당_눈보라로 처치_최소",
                "게임당_눈보라로 처치.max": "$게임당_눈보라로 처치_최대",

                "게임당_막은 피해.avg": "$게임당_막은 피해",
                "게임당_막은 피해.min": "$게임당_막은 피해_최소",
                "게임당_막은 피해.max": "$게임당_막은 피해_최대",

                "게임당_얼린 적.avg": "$게임당_얼린 적",
                "게임당_얼린 적.min": "$게임당_얼린 적_최소",
                "게임당_얼린 적.max": "$게임당_얼린 적_최대",

                "게임당_자가 치유.avg": "$게임당_자가 치유",
                "게임당_자가 치유.min": "$게임당_자가 치유_최소",
                "게임당_자가 치유.max": "$게임당_자가 치유_최대",

                "보조 발사 적중률.avg": "$보조 발사 적중률",
                "보조 발사 적중률.min": "$보조 발사 적중률_최소",
                "보조 발사 적중률.max": "$보조 발사 적중률_최대",
            }
        },
        {
            $project: 
            {
                "게임당_눈보라로 처치": 1,
                "게임당_막은 피해": 1,
                "게임당_얼린 적": 1,
                "게임당_자가 치유": 1,
                "보조 발사 적중률": 1
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