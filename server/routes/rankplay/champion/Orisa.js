const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

/* 오리사 영웅별 스키마
"영웅별": 
{
"공격력 증폭": 10790,
"공격력 증폭 - 10분당 평균": 1.71,
"공격력 증폭 - 한 게임 최고기록": 2116,
"막은 피해": 237357,
"막은 피해 - 10분당 평균": 37.61,
"막은 피해 - 한 게임 최고기록": 23585,
"보조 발사 적중률": 21,
"초강력 증폭기 도움": 79,
"초강력 증폭기 도움 - 10분당 평균": 0.01,
"초강력 증폭기 도움 - 한 게임 최고기록": 22
}
*/

// path: /avg/rankplay/champion/오리사
router.get('/', (req, res, next) => {
    const rank = req.query.rank;
    console.log(`orisa champion analyzing... rank: ${rank}`);
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
                'rankplay.record.오리사.영웅별':1,
                'rankplay.record.오리사.게임': 1
            }
        },
        {
            $match: 
            {
                'rank.val': {$gte: min, $lt: max},
                'rankplay.record.오리사.게임.치른 게임': {$gt: 9}
            }
        },
        {
            $group:
            {
                _id: null,
                count: {
                    $sum: 1
                },
                '공격력 증폭': {
                    $avg: '$rankplay.record.오리사.영웅별.공격력 증폭'
                },
                '공격력 증폭 - 10분당 평균': {
                    $avg: '$rankplay.record.오리사.영웅별.공격력 증폭 - 10분당 평균'
                },
                '공격력 증폭 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.오리사.영웅별.공격력 증폭 - 한 게임 최고기록'
                },
                '막은 피해': {
                    $avg: '$rankplay.record.오리사.영웅별.막은 피해'
                },
                '막은 피해 - 10분당 평균': {
                    $avg: '$rankplay.record.오리사.영웅별.막은 피해 - 10분당 평균'
                },
                '막은 피해 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.오리사.영웅별.막은 피해 - 한 게임 최고기록'
                },
                '초강력 증폭기 도움': {
                    $avg: '$rankplay.record.오리사.영웅별.초강력 증폭기 도움'
                },
                '초강력 증폭기 도움 - 10분당 평균': {
                    $avg: '$rankplay.record.오리사.영웅별.초강력 증폭기 도움 - 10분당 평균'
                },
                '초강력 증폭기 도움 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.오리사.영웅별.초강력 증폭기 도움 - 한 게임 최고기록'
                },

                '보조 발사 적중률': {
                    $avg: '$rankplay.record.오리사.영웅별.보조 발사 적중률'
                },
                '보조 발사 적중률_최소': {
                    $min: {
                        $avg: '$rankplay.record.오리사.영웅별.보조 발사 적중률'
                    }
                },
                '보조 발사 적중률_최대': {
                    $max: {
                        $avg: '$rankplay.record.오리사.영웅별.보조 발사 적중률'
                    }
                },
                '게임당_공격력 증폭': {
                    $avg: { $divide: ['$rankplay.record.오리사.영웅별.공격력 증폭', '$rankplay.record.오리사.게임.치른 게임' ] }
                },
                '게임당_공격력 증폭_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.오리사.영웅별.공격력 증폭', '$rankplay.record.오리사.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_공격력 증폭_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.오리사.영웅별.공격력 증폭', '$rankplay.record.오리사.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_막은 피해': {
                    $avg: { $divide: ['$rankplay.record.오리사.영웅별.막은 피해', '$rankplay.record.오리사.게임.치른 게임' ] }
                },
                '게임당_막은 피해_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.오리사.영웅별.막은 피해', '$rankplay.record.오리사.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_막은 피해_최대': {
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.오리사.영웅별.막은 피해', '$rankplay.record.오리사.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_초강력 증폭기 도움': {
                    $avg: { $divide: ['$rankplay.record.오리사.영웅별.초강력 증폭기 도움', '$rankplay.record.오리사.게임.치른 게임' ] }
                },
                '게임당_초강력 증폭기 도움_최소': {
                    $min: {
                        $avg: {
                            $divide: ['$rankplay.record.오리사.영웅별.초강력 증폭기 도움', '$rankplay.record.오리사.게임.치른 게임' ]
                        }
                    }
                },
                '게임당_초강력 증폭기 도움_최대':{
                    $max: {
                        $avg: {
                            $divide: ['$rankplay.record.오리사.영웅별.초강력 증폭기 도움', '$rankplay.record.오리사.게임.치른 게임' ]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                "게임당_공격력 증폭.avg": "$게임당_공격력 증폭",
                "게임당_공격력 증폭.min": "$게임당_공격력 증폭_최소",
                "게임당_공격력 증폭.max": "$게임당_공격력 증폭_최대",

                "게임당_막은 피해.avg": "$게임당_막은 피해",
                "게임당_막은 피해.min": "$게임당_막은 피해_최소",
                "게임당_막은 피해.max": "$게임당_막은 피해_최대",

                "게임당_초강력 증폭기 도움.avg": "$게임당_초강력 증폭기 도움",
                "게임당_초강력 증폭기 도움.min": "$게임당_초강력 증폭기 도움_최소",
                "게임당_초강력 증폭기 도움.max": "$게임당_초강력 증폭기 도움_최대",

                "보조 발사 적중률.avg": "$보조 발사 적중률",
                "보조 발사 적중률.min": "$보조 발사 적중률_최소",
                "보조 발사 적중률.max": "$보조 발사 적중률_최대",
            }
        },
        {
            $project: 
            {
                "게임당_공격력 증폭": 1,
                "게임당_막은 피해": 1,
                "게임당_초강력 증폭기 도움": 1,
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