const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* 트레이서 영웅별 스키마
"영웅별": 
{
"보조 발사 적중률": 39,
"생명력 회복": 13393,
"생명력 회복 - 10분당 평균": 1.25,
"생명력 회복 - 한 게임 최고기록": 1784,
"자가 치유": 13393,
"자가 치유 - 10분당 평균": 1.25,
"자가 치유 - 한 게임 최고기록": 1784,
"펄스 폭탄 부착": 40,
"펄스 폭탄 부착 - 10분당 평균": 0,
"펄스 폭탄 부착 - 한 게임 최고기록": 6,
"펄스 폭탄으로 처치": 38,
"펄스 폭탄으로 처치 - 10분당 평균": 0,
"펄스 폭탄으로 처치 - 한 게임 최고기록": 8
}
*/

// path: /avg/rankplay/champion/트레이서
router.get("/", (req, res, next) => {
  const rank = req.query.rank;
  let min, max;
  {
    if (rank < 1500) {
      min = 500;
      max = 1500;
    } else if (rank < 2000) {
      min = 1500;
      max = 2000;
    } else if (rank < 2500) {
      min = 2000;
      max = 2500;
    } else if (rank < 3000) {
      min = 2500;
      max = 3000;
    } else if (rank < 3500) {
      min = 3000;
      max = 3500;
    } else if (rank < 4000) {
      min = 3500;
      max = 4000;
    } else if (rank < 5000) {
      min = 4000;
      max = 5000;
    } else if (rank == "alltier") {
      min = 500;
      max = 5000;
    } else {
      return res.status(400).json({ error: "잘못된 랭크 정보입니다" });
    }
  }
  const aggregation = User.aggregate([
    {
      $project: {
        rank: 1,
        "rankplay.record.트레이서.영웅별": 1,
        "rankplay.record.트레이서.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.트레이서.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        "생명력 회복": {
          $avg: "$rankplay.record.트레이서.영웅별.생명력 회복"
        },
        "생명력 회복 - 10분당 평균": {
          $avg: "$rankplay.record.트레이서.영웅별.생명력 회복 - 10분당 평균"
        },
        "생명력 회복 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.트레이서.영웅별.생명력 회복 - 한 게임 최고기록"
        },
        "펄스 폭탄 부착": {
          $avg: "$rankplay.record.트레이서.영웅별.펄스 폭탄 부착"
        },
        "펄스 폭탄 부착 - 10분당 평균": {
          $avg: "$rankplay.record.트레이서.영웅별.펄스 폭탄 부착 - 10분당 평균"
        },
        "펄스 폭탄 부착 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.트레이서.영웅별.펄스 폭탄 부착 - 한 게임 최고기록"
        },
        "펄스 폭탄으로 처치": {
          $avg: "$rankplay.record.트레이서.영웅별.펄스 폭탄으로 처치"
        },
        "펄스 폭탄으로 처치 - 10분당 평균": {
          $avg:
            "$rankplay.record.트레이서.영웅별.펄스 폭탄으로 처치 - 10분당 평균"
        },
        "펄스 폭탄으로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.트레이서.영웅별.펄스 폭탄으로 처치 - 한 게임 최고기록"
        },
        "자가 치유": {
          $avg: "$rankplay.record.트레이서.영웅별.자가 치유"
        },
        "자가 치유 - 10분당 평균": {
          $avg: "$rankplay.record.트레이서.영웅별.자가 치유 - 10분당 평균"
        },
        "자가 치유 - 한 게임 최고기록": {
          $avg: "$rankplay.record.트레이서.영웅별.자가 치유 - 한 게임 최고기록"
        },

        "보조 발사 적중률": {
          $avg: "$rankplay.record.트레이서.영웅별.보조 발사 적중률"
        },
        "보조 발사 적중률_최소": {
          $min: {
            $avg: "$rankplay.record.트레이서.영웅별.보조 발사 적중률"
          }
        },
        "보조 발사 적중률_최대": {
          $max: {
            $avg: "$rankplay.record.트레이서.영웅별.보조 발사 적중률"
          }
        },
        "게임당_생명력 회복": {
          $avg: {
            $divide: [
              "$rankplay.record.트레이서.영웅별.생명력 회복",
              "$rankplay.record.트레이서.게임.치른 게임"
            ]
          }
        },
        "게임당_생명력 회복_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.트레이서.영웅별.생명력 회복",
                "$rankplay.record.트레이서.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_생명력 회복_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.트레이서.영웅별.생명력 회복",
                "$rankplay.record.트레이서.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_펄스 폭탄 부착": {
          $avg: {
            $divide: [
              "$rankplay.record.트레이서.영웅별.펄스 폭탄 부착",
              "$rankplay.record.트레이서.게임.치른 게임"
            ]
          }
        },
        "게임당_펄스 폭탄 부착_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.트레이서.영웅별.펄스 폭탄 부착",
                "$rankplay.record.트레이서.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_펄스 폭탄 부착_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.트레이서.영웅별.펄스 폭탄 부착",
                "$rankplay.record.트레이서.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_펄스 폭탄으로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.트레이서.영웅별.펄스 폭탄으로 처치",
              "$rankplay.record.트레이서.게임.치른 게임"
            ]
          }
        },
        "게임당_펄스 폭탄으로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.트레이서.영웅별.펄스 폭탄으로 처치",
                "$rankplay.record.트레이서.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_펄스 폭탄으로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.트레이서.영웅별.펄스 폭탄으로 처치",
                "$rankplay.record.트레이서.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자가 치유": {
          $avg: {
            $divide: [
              "$rankplay.record.트레이서.영웅별.자가 치유",
              "$rankplay.record.트레이서.게임.치른 게임"
            ]
          }
        },
        "게임당_자가 치유_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.트레이서.영웅별.자가 치유",
                "$rankplay.record.트레이서.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자가 치유_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.트레이서.영웅별.자가 치유",
                "$rankplay.record.트레이서.게임.치른 게임"
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        "게임당_생명력 회복.avg": "$게임당_생명력 회복",
        "게임당_생명력 회복.min": "$게임당_생명력 회복_최소",
        "게임당_생명력 회복.max": "$게임당_생명력 회복_최대",

        "게임당_펄스 폭탄 부착.avg": "$게임당_펄스 폭탄 부착",
        "게임당_펄스 폭탄 부착.min": "$게임당_펄스 폭탄 부착_최소",
        "게임당_펄스 폭탄 부착.max": "$게임당_펄스 폭탄 부착_최대",

        "게임당_펄스 폭탄으로 처치.avg": "$게임당_펄스 폭탄으로 처치",
        "게임당_펄스 폭탄으로 처치.min": "$게임당_펄스 폭탄으로 처치_최소",
        "게임당_펄스 폭탄으로 처치.max": "$게임당_펄스 폭탄으로 처치_최대",

        "게임당_자가 치유.avg": "$게임당_자가 치유",
        "게임당_자가 치유.min": "$게임당_자가 치유_최소",
        "게임당_자가 치유.max": "$게임당_자가 치유_최대",

        "보조 발사 적중률.avg": "$보조 발사 적중률",
        "보조 발사 적중률.min": "$보조 발사 적중률_최소",
        "보조 발사 적중률.max": "$보조 발사 적중률_최대"
      }
    },
    {
      $project: {
        "게임당_생명력 회복": 1,
        "게임당_펄스 폭탄 부착": 1,
        "게임당_펄스 폭탄으로 처치": 1,
        "게임당_자가 치유": 1,
        "보조 발사 적중률": 1
      }
    }
  ]);
  aggregation.options = { allowDiskUse: true };
  aggregation.exec((err, users) => {
    if (err) return res.json({ error: err });
    //return res.json(users);
    return res.json(users);
  });
});

module.exports = router;
