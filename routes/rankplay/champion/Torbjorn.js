const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* 토르비욘 영웅별 스키마
"영웅별": 
{
"과부하로 처치": 1077,
"과부하로 처치 - 한 게임 최고기록": 14,
"망치로 처치": 3,
"망치로 처치 - 한 게임 최고기록": 1,
"보조 발사 적중률": 24,
"초고열 용광로로 처치": 511,
"초고열 용광로로 처치 - 10분당 평균": 0,
"초고열 용광로로 처치 - 한 게임 최고기록": 11,
"토르비욘이 직접 처치": 2301,
"토르비욘이 직접 처치 - 10분당 평균": 0.02,
"토르비욘이 직접 처치 - 한 게임 최고기록": 28,
"포탑으로 준 피해 - 10분당 평균": 5.21,
"포탑으로 처치": 2551,
"포탑으로 처치 - 10분당 평균": 0.02,
"포탑으로 처치 - 한 게임 최고기록": 36
}
*/

// path: /avg/rankplay/champion/토르비욘
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
        "rankplay.record.토르비욘.영웅별": 1,
        "rankplay.record.토르비욘.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.토르비욘.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        "초고열 용광로로 처치": {
          $avg: "$rankplay.record.토르비욘.영웅별.초고열 용광로로 처치"
        },
        "초고열 용광로로 처치 - 10분당 평균": {
          $avg:
            "$rankplay.record.토르비욘.영웅별.초고열 용광로로 처치 - 10분당 평균"
        },
        "초고열 용광로로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.토르비욘.영웅별.초고열 용광로로 처치 - 한 게임 최고기록"
        },
        "토르비욘이 직접 처치": {
          $avg: "$rankplay.record.토르비욘.영웅별.토르비욘이 직접 처치"
        },
        "토르비욘이 직접 처치 - 10분당 평균": {
          $avg:
            "$rankplay.record.토르비욘.영웅별.토르비욘이 직접 처치 - 10분당 평균"
        },
        "토르비욘이 직접 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.토르비욘.영웅별.토르비욘이 직접 처치 - 한 게임 최고기록"
        },
        "포탑으로 처치": {
          $avg: "$rankplay.record.토르비욘.영웅별.포탑으로 처치"
        },
        "포탑으로 처치 - 10분당 평균": {
          $avg: "$rankplay.record.토르비욘.영웅별.포탑으로 처치 - 10분당 평균"
        },
        "포탑으로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.토르비욘.영웅별.포탑으로 처치 - 한 게임 최고기록"
        },
        "망치로 처치": {
          $avg: "$rankplay.record.토르비욘.영웅별.망치로 처치"
        },
        "망치로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.토르비욘.영웅별.망치로 처치 - 한 게임 최고기록"
        },
        "과부하로 처치": {
          $avg: "$rankplay.record.토르비욘.영웅별.과부하로 처치"
        },
        "과부하로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.토르비욘.영웅별.과부하로 처치 - 한 게임 최고기록"
        },

        "보조 발사 적중률": {
          $avg: "$rankplay.record.토르비욘.영웅별.보조 발사 적중률"
        },
        "보조 발사 적중률_최소": {
          $min: {
            $avg: "$rankplay.record.토르비욘.영웅별.보조 발사 적중률"
          }
        },
        "보조 발사 적중률_최대": {
          $max: {
            $avg: "$rankplay.record.토르비욘.영웅별.보조 발사 적중률"
          }
        },
        "게임당_초고열 용광로로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.토르비욘.영웅별.초고열 용광로로 처치",
              "$rankplay.record.토르비욘.게임.치른 게임"
            ]
          }
        },
        "게임당_초고열 용광로로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.토르비욘.영웅별.초고열 용광로로 처치",
                "$rankplay.record.토르비욘.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_초고열 용광로로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.토르비욘.영웅별.초고열 용광로로 처치",
                "$rankplay.record.토르비욘.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_토르비욘이 직접 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.토르비욘.영웅별.토르비욘이 직접 처치",
              "$rankplay.record.토르비욘.게임.치른 게임"
            ]
          }
        },
        "게임당_토르비욘이 직접 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.토르비욘.영웅별.토르비욘이 직접 처치",
                "$rankplay.record.토르비욘.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_토르비욘이 직접 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.토르비욘.영웅별.토르비욘이 직접 처치",
                "$rankplay.record.토르비욘.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_포탑으로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.토르비욘.영웅별.포탑으로 처치",
              "$rankplay.record.토르비욘.게임.치른 게임"
            ]
          }
        },
        "게임당_포탑으로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.토르비욘.영웅별.포탑으로 처치",
                "$rankplay.record.토르비욘.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_포탑으로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.토르비욘.영웅별.포탑으로 처치",
                "$rankplay.record.토르비욘.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_망치로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.토르비욘.영웅별.망치로 처치",
              "$rankplay.record.토르비욘.게임.치른 게임"
            ]
          }
        },
        "게임당_망치로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.토르비욘.영웅별.망치로 처치",
                "$rankplay.record.토르비욘.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_망치로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.토르비욘.영웅별.망치로 처치",
                "$rankplay.record.토르비욘.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_과부하로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.토르비욘.영웅별.과부하로 처치",
              "$rankplay.record.토르비욘.게임.치른 게임"
            ]
          }
        },
        "게임당_과부하로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.토르비욘.영웅별.과부하로 처치",
                "$rankplay.record.토르비욘.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_과부하로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.토르비욘.영웅별.과부하로 처치",
                "$rankplay.record.토르비욘.게임.치른 게임"
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        "게임당_초고열 용광로로 처치.avg": "$게임당_초고열 용광로로 처치",
        "게임당_초고열 용광로로 처치.min": "$게임당_초고열 용광로로 처치_최소",
        "게임당_초고열 용광로로 처치.max": "$게임당_초고열 용광로로 처치_최대",

        "게임당_토르비욘이 직접 처치.avg": "$게임당_토르비욘이 직접 처치",
        "게임당_토르비욘이 직접 처치.min": "$게임당_토르비욘이 직접 처치_최소",
        "게임당_토르비욘이 직접 처치.max": "$게임당_토르비욘이 직접 처치_최대",

        "게임당_포탑으로 처치.avg": "$게임당_포탑으로 처치",
        "게임당_포탑으로 처치.min": "$게임당_포탑으로 처치_최소",
        "게임당_포탑으로 처치.max": "$게임당_포탑으로 처치_최대",

        "게임당_망치로 처치.avg": "$게임당_망치로 처치",
        "게임당_망치로 처치.min": "$게임당_망치로 처치_최소",
        "게임당_망치로 처치.max": "$게임당_망치로 처치_최대",

        "게임당_과부하로 처치.avg": "$게임당_과부하로 처치",
        "게임당_과부하로 처치.min": "$게임당_과부하로 처치_최소",
        "게임당_과부하로 처치.max": "$게임당_과부하로 처치_최대",

        "보조 발사 적중률.avg": "$보조 발사 적중률",
        "보조 발사 적중률.min": "$보조 발사 적중률_최소",
        "보조 발사 적중률.max": "$보조 발사 적중률_최대"
      }
    },
    {
      $project: {
        "게임당_초고열 용광로로 처치": 1,
        "게임당_토르비욘이 직접 처치": 1,
        "게임당_포탑으로 처치": 1,
        "게임당_망치로 처치": 1,
        "게임당_과부하로 처치": 1,
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
