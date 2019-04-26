const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

/* 애쉬 영웅별 스키마
"영웅별": 
{
"다이너마이트로 처치": 164,
"다이너마이트로 처치 - 10분당 평균": 0.01,
"다이너마이트로 처치 - 한 게임 최고기록": 15,
"밥으로 처치": 87,
"밥으로 처치 - 10분당 평균": 0.01,
"밥으로 처치 - 한 게임 최고기록": 9,
"보조 발사 적중률": 39,
"저격 명중률": 25,
"저격 명중률 - 한 게임 최고기록": 35,
"저격 치명타": 69,
"저격 치명타 - 10분당 평균": 0,
"저격 치명타 - 한 게임 최고기록": 7,
"저격 치명타 명중률": 8,
"저격 치명타 처치": 14,
"저격 치명타 처치 - 10분당 평균": 0,
"충격 샷건으로 처치": 11,
"충격 샷건으로 처치 - 10분당 평균": 0,
"충격 샷건으로 처치 - 한 게임 최고기록": 2
}
*/

// path: /avg/rankplay/champion/애쉬
router.get('/', (req, res, next) => {
    const rank = req.query.rank;
    console.log(`Ashe champion analyzing... rank: ${rank}`);
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
                'rankplay.record.애쉬.영웅별':1,
                'rankplay.record.애쉬.게임': 1
            }
        },
        {
            $match: 
            {
                'rank.val': {$gte: min, $lt: max},
                'rankplay.record.애쉬.게임.치른 게임': {$gt: 9}
            }
        },
        {
            $group:
            {
                _id: null,
                count: {
                    $sum: 1
                },
                /*'다이너마이트로 처치': {
                    $avg: '$rankplay.record.애쉬.영웅별.다이너마이트로 처치'
                },
                '다이너마이트로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.애쉬.영웅별.다이너마이트로 처치 - 10분당 평균'
                },
                '다이너마이트로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.애쉬.영웅별.다이너마이트로 처치 - 한 게임 최고기록'
                },
                '밥으로 처치': {
                    $avg: '$rankplay.record.애쉬.영웅별.밥으로 처치'
                },
                '밥으로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.애쉬.영웅별.밥으로 처치 - 10분당 평균'
                },
                '밥으로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.애쉬.영웅별.밥으로 처치 - 한 게임 최고기록'
                },
                '보조 발사 적중률': {
                    $avg: '$rankplay.record.애쉬.영웅별.보조 발사 적중률'
                },
                '저격 명중률': {
                    $avg: '$rankplay.record.애쉬.영웅별.저격 명중률'
                },
                '저격 치명타': {
                    $avg: '$rankplay.record.애쉬.영웅별.저격 치명타'
                },
                '저격 치명타 - 10분당 평균': {
                    $avg: '$rankplay.record.애쉬.영웅별.저격 치명타 - 10분당 평균'
                },
                '저격 치명타 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.애쉬.영웅별.저격 치명타 - 한 게임 최고기록'
                },
                '저격 치명타 명중률': {
                    $avg: '$rankplay.record.애쉬.영웅별.저격 치명타 명중률'
                },
                '저격 치명타 처치': {
                    $avg: '$rankplay.record.애쉬.영웅별.저격 치명타 처치'
                },
                '저격 치명타 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.애쉬.영웅별.저격 치명타 처치 - 10분당 평균'
                },
                '충격 샷건으로 처치': {
                    $avg: '$rankplay.record.애쉬.영웅별.충격 샷건으로 처치'
                },
                '충격 샷건으로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.애쉬.영웅별.충격 샷건으로 처치 - 10분당 평균'
                },
                '충격 샷건으로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.애쉬.영웅별.충격 샷건으로 처치 - 한 게임 최고기록'
                },*/

                '보조 발사 적중률': {
                    $avg: '$rankplay.record.애쉬.영웅별.보조 발사 적중률'
                },
                '보조 발사 적중률_최소': {
                    $min: {
                        $avg: '$rankplay.record.애쉬.영웅별.보조 발사 적중률'
                    }
                },
                '보조 발사 적중률_최대': {
                    $max: {
                        $avg: '$rankplay.record.애쉬.영웅별.보조 발사 적중률'
                    }
                },
                '게임당_다이너마이트로 처치': {
                    $avg: { $divide: ['$rankplay.record.애쉬.영웅별.다이너마이트로 처치', '$rankplay.record.애쉬.게임.치른 게임' ] }
                },
                '게임당_다이너마이트로 처치_최소': {
                    $min: {
                        $avg: { $divide: ['$rankplay.record.애쉬.영웅별.다이너마이트로 처치', '$rankplay.record.애쉬.게임.치른 게임' ] }
                    }
                },
                '게임당_다이너마이트로 처치_최대': {
                    $max: {
                        $avg: { $divide: ['$rankplay.record.애쉬.영웅별.다이너마이트로 처치', '$rankplay.record.애쉬.게임.치른 게임' ] }
                    }
                },
                '게임당_밥으로 처치': {
                    $avg: { $divide: ['$rankplay.record.애쉬.영웅별.밥으로 처치', '$rankplay.record.애쉬.게임.치른 게임' ] }
                },
                '게임당_밥으로 처치_최소': {
                    $min: {
                        $avg: { $divide: ['$rankplay.record.애쉬.영웅별.밥으로 처치', '$rankplay.record.애쉬.게임.치른 게임' ] }
                    }
                },
                '게임당_밥으로 처치_최대': {
                    $max: {
                        $avg: { $divide: ['$rankplay.record.애쉬.영웅별.밥으로 처치', '$rankplay.record.애쉬.게임.치른 게임' ] }
                    }
                },
                '게임당_저격 치명타': {
                    $avg: { $divide: ['$rankplay.record.애쉬.영웅별.저격 치명타', '$rankplay.record.애쉬.게임.치른 게임' ] }
                },
                '게임당_저격 치명타_최소': {
                    $min: {
                        $avg: { $divide: ['$rankplay.record.애쉬.영웅별.저격 치명타', '$rankplay.record.애쉬.게임.치른 게임' ] }
                    }
                },
                '게임당_저격 치명타_최대': {
                    $max: {
                        $avg: { $divide: ['$rankplay.record.애쉬.영웅별.저격 치명타', '$rankplay.record.애쉬.게임.치른 게임' ] }
                    }
                },
                '게임당_저격 치명타 처치': {
                    $avg: { $divide: ['$rankplay.record.애쉬.영웅별.저격 치명타 처치', '$rankplay.record.애쉬.게임.치른 게임' ] }
                },
                '게임당_저격 치명타 처치_최소': {
                    $min: {
                        $avg: { $divide: ['$rankplay.record.애쉬.영웅별.저격 치명타 처치', '$rankplay.record.애쉬.게임.치른 게임' ] }
                    }
                },
                '게임당_저격 치명타 처치_최대': {
                    $max: {
                        $avg: { $divide: ['$rankplay.record.애쉬.영웅별.저격 치명타 처치', '$rankplay.record.애쉬.게임.치른 게임' ] }
                    }
                },
                '게임당_충격 샷건으로 처치': {
                    $avg: { $divide: ['$rankplay.record.애쉬.영웅별.충격 샷건으로 처치', '$rankplay.record.애쉬.게임.치른 게임' ] }
                },
                '게임당_충격 샷건으로 처치_최소': {
                    $min: {
                        $avg: { $divide: ['$rankplay.record.애쉬.영웅별.충격 샷건으로 처치', '$rankplay.record.애쉬.게임.치른 게임' ] }
                    }
                },
                '게임당_충격 샷건으로 처치_최대': {
                    $max: {
                        $avg: { $divide: ['$rankplay.record.애쉬.영웅별.충격 샷건으로 처치', '$rankplay.record.애쉬.게임.치른 게임' ] }
                    }
                },
            }
        },
        {
            $addFields: {
                "게임당_다이너마이트로 처치.avg": "$게임당_다이너마이트로 처치",
                "게임당_다이너마이트로 처치.min": "$게임당_다이너마이트로 처치_최소",
                "게임당_다이너마이트로 처치.max": "$게임당_다이너마이트로 처치_최대",

                "게임당_밥으로 처치.avg": "$게임당_밥으로 처치",
                "게임당_밥으로 처치.min": "$게임당_밥으로 처치_최소",
                "게임당_밥으로 처치.max": "$게임당_밥으로 처치_최대",

                "게임당_저격 치명타.avg": "$게임당_저격 치명타",
                "게임당_저격 치명타.min": "$게임당_저격 치명타_최소",
                "게임당_저격 치명타.max": "$게임당_저격 치명타_최대",

                "게임당_저격 치명타 처치.avg": "$게임당_저격 치명타 처치",
                "게임당_저격 치명타 처치.min": "$게임당_저격 치명타 처치_최소",
                "게임당_저격 치명타 처치.max": "$게임당_저격 치명타 처치_최대",

                "게임당_충격 샷건으로 처치.avg": "$게임당_충격 샷건으로 처치",
                "게임당_충격 샷건으로 처치.min": "$게임당_충격 샷건으로 처치_최소",
                "게임당_충격 샷건으로 처치.max": "$게임당_충격 샷건으로 처치_최대",

                "보조 발사 적중률.avg": "$보조 발사 적중률",
                "보조 발사 적중률.min": "$보조 발사 적중률_최소",
                "보조 발사 적중률.max": "$보조 발사 적중률_최대",
            }
        },
        {
            $project:{
                "게임당_다이너마이트로 처치": 1,
                "게임당_밥으로 처치": 1,
                "게임당_저격 치명타": 1,
                "게임당_저격 치명타 처치": 1,
                "게임당_충격 샷건으로 처치": 1,
                "보조 발사 적중률": 1
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