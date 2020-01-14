const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* 로드호그 영웅별 스키마
"영웅별": 
{
"갈고리 명중률": 50,
"갈고리 명중률 - 한 게임 최고기록": 100,
"갈고리 시도": 501,
"갈고리로 끌어오기": 250,
"갈고리로 끌어오기 - 10분당 평균": 0.02,
"갈고리로 끌어오기 - 한 게임 최고기록": 21,
"돼재앙으로 처치": 70,
"돼재앙으로 처치 - 10분당 평균": 0.01,
"돼재앙으로 처치 - 한 게임 최고기록": 9,
"자가 치유": 72127,
"자가 치유 - 10분당 평균": 6.39,
"자가 치유 - 한 게임 최고기록": 8526
}
*/

// path: /avg/rankplay/champion/로드호그
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
        "rankplay.record.로드호그.영웅별": 1,
        "rankplay.record.로드호그.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.로드호그.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        "갈고리로 끌어오기": {
          $avg: "$rankplay.record.로드호그.영웅별.갈고리로 끌어오기"
        },
        "갈고리로 끌어오기 - 10분당 평균": {
          $avg:
            "$rankplay.record.로드호그.영웅별.갈고리로 끌어오기 - 10분당 평균"
        },
        "갈고리로 끌어오기 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.로드호그.영웅별.갈고리로 끌어오기 - 한 게임 최고기록"
        },
        "돼재앙으로 처치": {
          $avg: "$rankplay.record.로드호그.영웅별.돼재앙으로 처치"
        },
        "돼재앙으로 처치 - 10분당 평균": {
          $avg: "$rankplay.record.로드호그.영웅별.돼재앙으로 처치 - 10분당 평균"
        },
        "돼재앙으로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.로드호그.영웅별.돼재앙으로 처치 - 한 게임 최고기록"
        },
        "자가 치유": {
          $avg: "$rankplay.record.로드호그.영웅별.자가 치유"
        },
        "자가 치유 - 10분당 평균": {
          $avg: "$rankplay.record.로드호그.영웅별.자가 치유 - 10분당 평균"
        },
        "자가 치유 - 한 게임 최고기록": {
          $avg: "$rankplay.record.로드호그.영웅별.자가 치유 - 한 게임 최고기록"
        },
        "갈고리 명중률": {
          $avg: "$rankplay.record.로드호그.영웅별.갈고리 명중률"
        },
        "갈고리 명중률_최소": {
          $min: {
            $avg: "$rankplay.record.로드호그.영웅별.갈고리 명중률"
          }
        },
        "갈고리 명중률_최대": {
          $max: {
            $avg: "$rankplay.record.로드호그.영웅별.갈고리 명중률"
          }
        },
        "게임당_갈고리로 끌어오기": {
          $avg: {
            $divide: [
              "$rankplay.record.로드호그.영웅별.갈고리로 끌어오기",
              "$rankplay.record.로드호그.게임.치른 게임"
            ]
          }
        },
        "게임당_갈고리로 끌어오기_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.로드호그.영웅별.갈고리로 끌어오기",
                "$rankplay.record.로드호그.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_갈고리로 끌어오기_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.로드호그.영웅별.갈고리로 끌어오기",
                "$rankplay.record.로드호그.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_돼재앙으로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.로드호그.영웅별.돼재앙으로 처치",
              "$rankplay.record.로드호그.게임.치른 게임"
            ]
          }
        },
        "게임당_돼재앙으로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.로드호그.영웅별.돼재앙으로 처치",
                "$rankplay.record.로드호그.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_돼재앙으로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.로드호그.영웅별.돼재앙으로 처치",
                "$rankplay.record.로드호그.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자가 치유": {
          $avg: {
            $divide: [
              "$rankplay.record.로드호그.영웅별.자가 치유",
              "$rankplay.record.로드호그.게임.치른 게임"
            ]
          }
        },
        "게임당_자가 치유_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.로드호그.영웅별.자가 치유",
                "$rankplay.record.로드호그.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자가 치유_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.로드호그.영웅별.자가 치유",
                "$rankplay.record.로드호그.게임.치른 게임"
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        "게임당_갈고리로 끌어오기.avg": "$게임당_갈고리로 끌어오기",
        "게임당_갈고리로 끌어오기.min": "$게임당_갈고리로 끌어오기_최소",
        "게임당_갈고리로 끌어오기.max": "$게임당_갈고리로 끌어오기_최대",

        "게임당_돼재앙으로 처치.avg": "$게임당_돼재앙으로 처치",
        "게임당_돼재앙으로 처치.min": "$게임당_돼재앙으로 처치_최소",
        "게임당_돼재앙으로 처치.max": "$게임당_돼재앙으로 처치_최대",

        "게임당_자가 치유.avg": "$게임당_자가 치유",
        "게임당_자가 치유.min": "$게임당_자가 치유_최소",
        "게임당_자가 치유.max": "$게임당_자가 치유_최대",

        "갈고리 명중률.avg": "$갈고리 명중률",
        "갈고리 명중률.min": "$갈고리 명중률_최소",
        "갈고리 명중률.max": "$갈고리 명중률_최대"
      }
    },
    {
      $project: {
        "게임당_갈고리로 끌어오기": 1,
        "게임당_돼재앙으로 처치": 1,
        "게임당_자가 치유": 1,
        "갈고리 명중률": 1
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
