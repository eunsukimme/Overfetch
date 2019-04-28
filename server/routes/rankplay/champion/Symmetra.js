const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

/* 시메트라 영웅별 스키마
"영웅별": 
{
"감시 포탑으로 처치": 131,
"감시 포탑으로 처치 - 10분당 평균": 0.02,
"감시 포탑으로 처치 - 한 게임 최고기록": 15,
"기본 발사 적중률": 45,
"막은 피해": 55478,
"막은 피해 - 10분당 평균": 6.85,
"막은 피해 - 한 게임 최고기록": 7917,
"보조 발사 명중 - 10분당 평균": 0.12,
"보조 발사 적중률": 25,
"순간이동한 플레이어": 317,
"순간이동한 플레이어 - 10분당 평균": 0.04,
"순간이동한 플레이어 - 한 게임 최고기록": 35
}
*/

// path: /avg/rankplay/champion/시메트라
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
                'rankplay.record.시메트라.영웅별':1,
                'rankplay.record.시메트라.게임': 1
            }
        },
        {
            $match: 
            {
                'rank.val': {$gte: min, $lt: max},
                'rankplay.record.시메트라.게임.치른 게임': {$gt: 9}
            }
        },
        {
            $group:
            {
                _id: null,
                count: {
                    $sum: 1
                },
                '감시 포탑으로 처치': {
                    $avg: '$rankplay.record.시메트라.영웅별.감시 포탑으로 처치'
                },
                '감시 포탑으로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.시메트라.영웅별.감시 포탑으로 처치 - 10분당 평균'
                },
                '감시 포탑으로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.시메트라.영웅별.감시 포탑으로 처치 - 한 게임 최고기록'
                },
                '막은 피해': {
                    $avg: '$rankplay.record.시메트라.영웅별.막은 피해'
                },
                '막은 피해 - 10분당 평균': {
                    $avg: '$rankplay.record.시메트라.영웅별.막은 피해 - 10분당 평균'
                },
                '막은 피해 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.시메트라.영웅별.막은 피해 - 한 게임 최고기록'
                },
                '순간이동한 플레이어': {
                    $avg: '$rankplay.record.시메트라.영웅별.순간이동한 플레이어'
                },
                '순간이동한 플레이어 - 10분당 평균': {
                    $avg: '$rankplay.record.시메트라.영웅별.순간이동한 플레이어 - 10분당 평균'
                },
                '순간이동한 플레이어 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.시메트라.영웅별.순간이동한 플레이어 - 한 게임 최고기록'
                },

                '보조 발사 적중률': {
                    $avg: '$rankplay.record.시메트라.영웅별.보조 발사 적중률'
                },
                '보조 발사 적중률_최소': {
                    $min: {
                        $avg: '$rankplay.record.시메트라.영웅별.보조 발사 적중률'
                    }
                },
                '보조 발사 적중률_최대': {
                    $max: {
                        $avg: '$rankplay.record.시메트라.영웅별.보조 발사 적중률'
                    }
                },
                '기본 발사 적중률': {
                    $avg: '$rankplay.record.시메트라.영웅별.기본 발사 적중률'
                },
                '기본 발사 적중률_최소': {
                    $min: {
                        $avg: '$rankplay.record.시메트라.영웅별.기본 발사 적중률'
                    }
                },
                '기본 발사 적중률_최대': {
                    $max: {
                        $avg: '$rankplay.record.시메트라.영웅별.기본 발사 적중률'
                    }
                },
                '게임당_감시 포탑으로 처치': {
                    $avg: { $divide: ['$rankplay.record.시메트라.영웅별.감시 포탑으로 처치', '$rankplay.record.시메트라.게임.치른 게임' ] }
                },
                '게임당_감시 포탑으로 처치_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.시메트라.영웅별.감시 포탑으로 처치', '$rankplay.record.시메트라.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_감시 포탑으로 처치_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.시메트라.영웅별.감시 포탑으로 처치', '$rankplay.record.시메트라.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_막은 피해': {
                    $avg: { $divide: ['$rankplay.record.시메트라.영웅별.막은 피해', '$rankplay.record.시메트라.게임.치른 게임' ] }
                },
                '게임당_막은 피해_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.시메트라.영웅별.막은 피해', '$rankplay.record.시메트라.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_막은 피해_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.시메트라.영웅별.막은 피해', '$rankplay.record.시메트라.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_순간이동한 플레이어': {
                    $avg: { $divide: ['$rankplay.record.시메트라.영웅별.순간이동한 플레이어', '$rankplay.record.시메트라.게임.치른 게임' ] }
                },
                '게임당_순간이동한 플레이어_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.시메트라.영웅별.순간이동한 플레이어', '$rankplay.record.시메트라.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_순간이동한 플레이어_최대':{
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.시메트라.영웅별.순간이동한 플레이어', '$rankplay.record.시메트라.게임.치른 게임' ]
                        }
                    }
                },
            }
        },
        {
            $addFields: {
                "게임당_감시 포탑으로 처치.avg": "$게임당_감시 포탑으로 처치",
                "게임당_감시 포탑으로 처치.min": "$게임당_감시 포탑으로 처치_최소",
                "게임당_감시 포탑으로 처치.max": "$게임당_감시 포탑으로 처치_최대",

                "게임당_막은 피해.avg": "$게임당_막은 피해",
                "게임당_막은 피해.min": "$게임당_막은 피해_최소",
                "게임당_막은 피해.max": "$게임당_막은 피해_최대",

                "게임당_순간이동한 플레이어.avg": "$게임당_순간이동한 플레이어",
                "게임당_순간이동한 플레이어.min": "$게임당_순간이동한 플레이어_최소",
                "게임당_순간이동한 플레이어.max": "$게임당_순간이동한 플레이어_최대",

                "보조 발사 적중률.avg": "$보조 발사 적중률",
                "보조 발사 적중률.min": "$보조 발사 적중률_최소",
                "보조 발사 적중률.max": "$보조 발사 적중률_최대",

                "기본 발사 적중률.avg": "$기본 발사 적중률",
                "기본 발사 적중률.min": "$기본 발사 적중률_최소",
                "기본 발사 적중률.max": "$기본 발사 적중률_최대",
            }
        },
        {
            $project: 
            {
                "게임당_감시 포탑으로 처치": 1,
                "게임당_막은 피해": 1,
                "게임당_순간이동한 플레이어": 1,
                "보조 발사 적중률": 1,
                "기본 발사 적중률": 1,
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