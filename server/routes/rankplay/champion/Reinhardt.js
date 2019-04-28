const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

/* 라인하르트 영웅별 스키마
"영웅별":
{
"대지분쇄로 처치": 47,
"대지분쇄로 처치 - 10분당 평균": 0,
"대지분쇄로 처치 - 한 게임 최고기록": 8,
"돌진으로 처치": 22,
"돌진으로 처치 - 10분당 평균": 0,
"돌진으로 처치 - 한 게임 최고기록": 2,
"로켓 해머 근접 공격 적중률": 40,
"막은 피해": 341677,
"막은 피해 - 10분당 평균": 30.9,
"막은 피해 - 한 게임 최고기록": 24691,
"화염 강타로 처치": 85,
"화염 강타로 처치 - 10분당 평균": 0.01,
"화염 강타로 처치 - 한 게임 최고기록": 14
}
*/

// path: /avg/rankplay/champion/라인하르트
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
                'rankplay.record.라인하르트.영웅별':1,
                'rankplay.record.라인하르트.게임': 1
            }
        },
        {
            $match: 
            {
                'rank.val': {$gte: min, $lt: max},
                'rankplay.record.라인하르트.게임.치른 게임': {$gt: 9}
            }
        },
        {
            $group:
            {
                _id: null,
                count: {
                    $sum: 1
                },
                '대지분쇄로 처치': {
                    $avg: '$rankplay.record.라인하르트.영웅별.대지분쇄로 처치'
                },
                '대지분쇄로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.라인하르트.영웅별.대지분쇄로 처치 - 10분당 평균'
                },
                '대지분쇄로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.라인하르트.영웅별.대지분쇄로 처치 - 한 게임 최고기록'
                },
                '막은 피해': {
                    $avg: '$rankplay.record.라인하르트.영웅별.막은 피해'
                },
                '막은 피해 - 10분당 평균': {
                    $avg: '$rankplay.record.라인하르트.영웅별.막은 피해 - 10분당 평균'
                },
                '막은 피해 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.라인하르트.영웅별.막은 피해 - 한 게임 최고기록'
                },
                '돌진으로 처치': {
                    $avg: '$rankplay.record.라인하르트.영웅별.돌진으로 처치'
                },
                '돌진으로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.라인하르트.영웅별.돌진으로 처치 - 10분당 평균'
                },
                '돌진으로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.라인하르트.영웅별.돌진으로 처치 - 한 게임 최고기록'
                },
                '화염 강타로 처치': {
                    $avg: '$rankplay.record.라인하르트.영웅별.화염 강타로 처치'
                },
                '화염 강타로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.라인하르트.영웅별.화염 강타로 처치 - 10분당 평균'
                },
                '화염 강타로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.라인하르트.영웅별.화염 강타로 처치 - 한 게임 최고기록'
                },

                '로켓 해머 근접 공격 적중률': {
                    $avg: '$rankplay.record.라인하르트.영웅별.로켓 해머 근접 공격 적중률'
                },
                '로켓 해머 근접 공격 적중률_최소': {
                    $min: {
                        $avg: '$rankplay.record.라인하르트.영웅별.로켓 해머 근접 공격 적중률'
                    }
                },
                '로켓 해머 근접 공격 적중률_최대': {
                    $max: {
                        $avg: '$rankplay.record.라인하르트.영웅별.로켓 해머 근접 공격 적중률'
                    }
                },
                '게임당_대지분쇄로 처치': {
                    $avg: { $divide: ['$rankplay.record.라인하르트.영웅별.대지분쇄로 처치', '$rankplay.record.라인하르트.게임.치른 게임' ] }
                },
                '게임당_대지분쇄로 처치_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.라인하르트.영웅별.대지분쇄로 처치', '$rankplay.record.라인하르트.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_대지분쇄로 처치_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.라인하르트.영웅별.대지분쇄로 처치', '$rankplay.record.라인하르트.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_막은 피해': {
                    $avg: { $divide: ['$rankplay.record.라인하르트.영웅별.막은 피해', '$rankplay.record.라인하르트.게임.치른 게임' ] }
                },
                '게임당_막은 피해_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.라인하르트.영웅별.막은 피해', '$rankplay.record.라인하르트.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_막은 피해_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.라인하르트.영웅별.막은 피해', '$rankplay.record.라인하르트.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_돌진으로 처치': {
                    $avg: { $divide: ['$rankplay.record.라인하르트.영웅별.돌진으로 처치', '$rankplay.record.라인하르트.게임.치른 게임' ] }
                },
                '게임당_돌진으로 처치_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.라인하르트.영웅별.돌진으로 처치', '$rankplay.record.라인하르트.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_돌진으로 처치_최대':{
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.라인하르트.영웅별.돌진으로 처치', '$rankplay.record.라인하르트.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_화염 강타로 처치': {
                    $avg: { $divide: ['$rankplay.record.라인하르트.영웅별.화염 강타로 처치', '$rankplay.record.라인하르트.게임.치른 게임' ] }
                },
                '게임당_화염 강타로 처치_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.라인하르트.영웅별.화염 강타로 처치', '$rankplay.record.라인하르트.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_화염 강타로 처치_최대':{
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.라인하르트.영웅별.화염 강타로 처치', '$rankplay.record.라인하르트.게임.치른 게임' ]
                        }
                    }
                },
            }
        },
        {
            $addFields: {
                "게임당_대지분쇄로 처치.avg": "$게임당_대지분쇄로 처치",
                "게임당_대지분쇄로 처치.min": "$게임당_대지분쇄로 처치_최소",
                "게임당_대지분쇄로 처치.max": "$게임당_대지분쇄로 처치_최대",

                "게임당_막은 피해.avg": "$게임당_막은 피해",
                "게임당_막은 피해.min": "$게임당_막은 피해_최소",
                "게임당_막은 피해.max": "$게임당_막은 피해_최대",

                "게임당_돌진으로 처치.avg": "$게임당_돌진으로 처치",
                "게임당_돌진으로 처치.min": "$게임당_돌진으로 처치_최소",
                "게임당_돌진으로 처치.max": "$게임당_돌진으로 처치_최대",

                "게임당_화염 강타로 처치.avg": "$게임당_화염 강타로 처치",
                "게임당_화염 강타로 처치.min": "$게임당_화염 강타로 처치_최소",
                "게임당_화염 강타로 처치.max": "$게임당_화염 강타로 처치_최대",

                "로켓 해머 근접 공격 적중률.avg": "$로켓 해머 근접 공격 적중률",
                "로켓 해머 근접 공격 적중률.min": "$로켓 해머 근접 공격 적중률_최소",
                "로켓 해머 근접 공격 적중률.max": "$로켓 해머 근접 공격 적중률_최대",
            }
        },
        {
            $project: 
            {
                "게임당_대지분쇄로 처치": 1,
                "게임당_막은 피해": 1,
                "게임당_돌진으로 처치": 1,
                "게임당_화염 강타로 처치": 1,
                "로켓 해머 근접 공격 적중률": 1
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