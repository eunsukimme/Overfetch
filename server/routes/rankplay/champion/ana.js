const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

/* 아나 영웅별 스키마
"영웅별": 
{
    "나노 강화제 도움": 20,
    "나노 강화제 도움 - 10분당 평균": 0.01,
    "나노 강화제 도움 - 한 게임 최고기록": 10,
    "나노 강화제 주입": 26,
    "나노 강화제 주입 - 10분당 평균": 0.01,
    "나노 강화제 주입 - 한 게임 최고기록": 7,
    "보조 발사 적중률": 30,
    "생체 수류탄 처치": 31,
    "소총 명중률": 65,
    "소총 명중률 - 한 게임 최고기록": 70,
    "자가 치유": 1681,
    "자가 치유 - 10분당 평균": 0.52,
    "자가 치유 - 한 게임 최고기록": 475,
    "재운 적": 23,
    "재운 적 - 10분당 평균": 0.01,
    "재운 적 - 한 게임 최고기록": 7,
    "저격 명중률": 61,
    "저격 명중률 - 한 게임 최고기록": 100,
    "치유 증폭": 210,
    "치유 증폭 - 10분당 평균": 0.06,
    "치유 증폭 - 한 게임 최고기록": 210
}
*/

// path: /avg/rankplay/champion/아나
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
                'rankplay.record.아나.영웅별':1,
                'rankplay.record.아나.게임': 1
            }
        },
        {
            $match: 
            {
                'rank.val': {$gte: min, $lt: max},
                'rankplay.record.아나.게임.치른 게임': {$gt: 9}
            }
        },
        {
            $group:
            {
                _id: null,
                count: {
                    $sum: 1
                },
                /*'나노 강화제 도움': {
                    $avg: '$rankplay.record.아나.영웅별.나노 강화제 도움'
                },
                '나노 강화제 도움 - 10분당 평균': {
                    $avg: '$rankplay.record.아나.영웅별.나노 강화제 도움 - 10분당 평균'
                },
                '나노 강화제 도움 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.아나.영웅별.나노 강화제 도움 - 한 게임 최고기록'
                },
                '나노 강화제 주입': {
                    $avg: '$rankplay.record.아나.영웅별.나노 강화제 주입'
                },
                '나노 강화제 주입 - 10분당 평균': {
                    $avg: '$rankplay.record.아나.영웅별.나노 강화제 주입 - 10분당 평균'
                },
                '나노 강화제 주입 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.아나.영웅별.나노 강화제 주입 - 한 게임 최고기록'
                },
                '보조 발사 적중률': {
                    $avg: '$rankplay.record.아나.영웅별.보조 발사 적중률'
                },
                '생체 수류탄 처치': {
                    $avg: '$rankplay.record.아나.영웅별.생체 수류탄 처치'
                },
                '소총 명중률': {
                    $avg: '$rankplay.record.아나.영웅별.소총 명중률'
                },
                '소총 명중률 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.아나.영웅별.소총 명중률 - 한 게임 최고기록'
                },
                '자가 치유': {
                    $avg: '$rankplay.record.아나.영웅별.자가 치유'
                },
                '자가 치유 - 10분당 평균': {
                    $avg: '$rankplay.record.아나.영웅별.자가 치유 - 10분당 평균'
                },
                '자가 치유 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.아나.영웅별.자가 치유 - 한 게임 최고기록'
                },
                '재운 적': {
                    $avg: '$rankplay.record.아나.영웅별.재운 적'
                },
                '재운 적 - 10분당 평균': {
                    $avg: '$rankplay.record.아나.영웅별.재운 적 - 10분당 평균'
                },
                '재운 적 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.아나.영웅별.재운 적 - 한 게임 최고기록'
                },
                '저격 명중률': {
                    $avg: '$rankplay.record.아나.영웅별.저격 명중률'
                },
                '저격 명중률 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.아나.영웅별.저격 명중률 - 한 게임 최고기록'
                },
                '치유 증폭': {
                    $avg: '$rankplay.record.아나.영웅별.치유 증폭'
                },
                '치유 증폭 - 10분당 평균': {
                    $avg: '$rankplay.record.아나.영웅별.치유 증폭 - 10분당 평균'
                },
                '치유 증폭 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.아나.영웅별.치유 증폭 - 한 게임 최고기록'
                },*/


                '보조 발사 적중률': {
                    $avg:  '$rankplay.record.아나.영웅별.보조 발사 적중률' 
                },
                '보조 발사 적중률_최소':{
                    $min: {
                        $avg:  '$rankplay.record.아나.영웅별.보조 발사 적중률' 
                    }
                },
                '보조 발사 적중률_최대':{
                    $max: {
                        $avg:  '$rankplay.record.아나.영웅별.보조 발사 적중률' 
                    }
                },
                '게임당_나노 강화제 도움':{
                    $avg: { $divide: ['$rankplay.record.아나.영웅별.나노 강화제 도움', '$rankplay.record.아나.게임.치른 게임'] }
                },
                '게임당_나노 강화제 도움_최소':{
                    $min:{
                        $avg: { $divide: ['$rankplay.record.아나.영웅별.나노 강화제 도움', '$rankplay.record.아나.게임.치른 게임'] }
                    }
                },
                '게임당_나노 강화제 도움_최대':{
                    $max:{
                        $avg: { $divide: ['$rankplay.record.아나.영웅별.나노 강화제 도움', '$rankplay.record.아나.게임.치른 게임'] }
                    }
                },
                '게임당_나노 강화제 주입':{
                    $avg: { $divide: ['$rankplay.record.아나.영웅별.나노 강화제 주입', '$rankplay.record.아나.게임.치른 게임'] }
                },
                '게임당_나노 강화제 주입_최소':{
                    $min: {
                        $avg: { $divide: ['$rankplay.record.아나.영웅별.나노 강화제 주입', '$rankplay.record.아나.게임.치른 게임'] }
                    }
                },
                '게임당_나노 강화제 주입_최대':{
                    $max: {
                        $avg: { $divide: ['$rankplay.record.아나.영웅별.나노 강화제 주입', '$rankplay.record.아나.게임.치른 게임'] }
                    }
                }
                ,
                '게임당_생체 수류탄 처치':{
                    $avg: { $divide: ['$rankplay.record.아나.영웅별.생체 수류탄 처치', '$rankplay.record.아나.게임.치른 게임'] }
                },
                '게임당_생체 수류탄 처치_최소':{
                    $min: {
                        $avg: { $divide: ['$rankplay.record.아나.영웅별.생체 수류탄 처치', '$rankplay.record.아나.게임.치른 게임'] }
                    }
                },
                '게임당_생체 수류탄 처치_최대':{
                    $max: {
                        $avg: { $divide: ['$rankplay.record.아나.영웅별.생체 수류탄 처치', '$rankplay.record.아나.게임.치른 게임'] }
                    }
                }
                ,
                '게임당_자가 치유':{
                    $avg: { $divide: ['$rankplay.record.아나.영웅별.자가 치유', '$rankplay.record.아나.게임.치른 게임'] }
                },
                '게임당_자가 치유_최소':{
                    $min: {
                        $avg: { $divide: ['$rankplay.record.아나.영웅별.자가 치유', '$rankplay.record.아나.게임.치른 게임'] }
                    }
                },
                '게임당_자가 치유_최대':{
                    $max: {
                        $avg: { $divide: ['$rankplay.record.아나.영웅별.자가 치유', '$rankplay.record.아나.게임.치른 게임'] }
                    }
                },
                '게임당_재운 적':{
                    $avg: { $divide: ['$rankplay.record.아나.영웅별.재운 적', '$rankplay.record.아나.게임.치른 게임'] }
                }
                ,
                '게임당_재운 적_최소':{
                    $min: {
                        $avg: { $divide: ['$rankplay.record.아나.영웅별.재운 적', '$rankplay.record.아나.게임.치른 게임'] }    
                    }
                }
                ,
                '게임당_재운 적_최대':{
                    $max: {
                        $avg: { $divide: ['$rankplay.record.아나.영웅별.재운 적', '$rankplay.record.아나.게임.치른 게임'] }
                    }
                },
                '게임당_치유 증폭':{
                    $avg: { $divide: ['$rankplay.record.아나.영웅별.치유 증폭', '$rankplay.record.아나.게임.치른 게임'] }
                },
                '게임당_치유 증폭_최소':{
                    $min: {
                        $avg: { $divide: ['$rankplay.record.아나.영웅별.치유 증폭', '$rankplay.record.아나.게임.치른 게임'] }
                    }
                },
                '게임당_치유 증폭_최대':{
                    $max: {
                        $avg: { $divide: ['$rankplay.record.아나.영웅별.치유 증폭', '$rankplay.record.아나.게임.치른 게임'] }
                    }
                }
            }
        },
        {
            $addFields: {
                "게임당_나노 강화제 도움.avg": "$게임당_나노 강화제 도움",
                "게임당_나노 강화제 도움.min": "$게임당_나노 강화제 도움_최소",
                "게임당_나노 강화제 도움.max": "$게임당_나노 강화제 도움_최대",

                "게임당_나노 강화제 주입.avg": "$게임당_나노 강화제 주입",
                "게임당_나노 강화제 주입.min": "$게임당_나노 강화제 주입_최소",
                "게임당_나노 강화제 주입.max": "$게임당_나노 강화제 주입_최대",

                "게임당_생체 수류탄 처치.avg": "$게임당_생체 수류탄 처치",
                "게임당_생체 수류탄 처치.min": "$게임당_생체 수류탄 처치_최소",
                "게임당_생체 수류탄 처치.max": "$게임당_생체 수류탄 처치_최대",

                "게임당_자가 치유.avg": "$게임당_자가 치유",
                "게임당_자가 치유.min": "$게임당_자가 치유_최소",
                "게임당_자가 치유.max": "$게임당_자가 치유_최대",

                "게임당_재운 적.avg": "$게임당_재운 적",
                "게임당_재운 적.min": "$게임당_재운 적_최소",
                "게임당_재운 적.max": "$게임당_재운 적_최대",

                "게임당_치유 증폭.avg": "$게임당_치유 증폭",
                "게임당_치유 증폭.min": "$게임당_치유 증폭_최소",
                "게임당_치유 증폭.max": "$게임당_치유 증폭_최대",

                "보조 발사 적중률.avg": "$보조 발사 적중률",
                "보조 발사 적중률.min": "$보조 발사 적중률_최소",
                "보조 발사 적중률.max": "$보조 발사 적중률_최대",
            }
        },
        {
            $project: {
                "게임당_나노 강화제 도움": 1,
                "게임당_나노 강화제 주입" : 1,
                "게임당_생체 수류탄 처치" : 1,
                "게임당_자가 치유": 1,
                "게임당_재운 적": 1,
                "게임당_치유 증폭": 1,
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