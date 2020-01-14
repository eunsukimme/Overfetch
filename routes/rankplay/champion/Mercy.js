const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* 메르시 영웅별 스키마
"영웅별": 
{
"공격력 증폭": 14716,
"공격력 증폭 - 10분당 평균": 0.93,
"공격력 증폭 - 한 게임 최고기록": 1184,
"부활한 플레이어": 175,
"부활한 플레이어 - 10분당 평균": 0.01,
"부활한 플레이어 - 한 게임 최고기록": 10,
"블라스터로 처치": 56,
"블라스터로 처치 - 10분당 평균": 0,
"블라스터로 처치 - 한 게임 최고기록": 8,
"자가 치유": 25890,
"자가 치유 - 10분당 평균": 1.63,
"자가 치유 - 한 게임 최고기록": 1890
}
*/

// path: /avg/rankplay/champion/메르시
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
        "rankplay.record.메르시.영웅별": 1,
        "rankplay.record.메르시.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.메르시.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        "공격력 증폭": {
          $avg: "$rankplay.record.메르시.영웅별.공격력 증폭"
        },
        "공격력 증폭 - 10분당 평균": {
          $avg: "$rankplay.record.메르시.영웅별.공격력 증폭 - 10분당 평균"
        },
        "공격력 증폭 - 한 게임 최고기록": {
          $avg: "$rankplay.record.메르시.영웅별.공격력 증폭 - 한 게임 최고기록"
        },
        "부활한 플레이어": {
          $avg: "$rankplay.record.메르시.영웅별.부활한 플레이어"
        },
        "부활한 플레이어 - 10분당 평균": {
          $avg: "$rankplay.record.메르시.영웅별.부활한 플레이어 - 10분당 평균"
        },
        "부활한 플레이어 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.메르시.영웅별.부활한 플레이어 - 한 게임 최고기록"
        },
        "블라스터로 처치": {
          $avg: "$rankplay.record.메르시.영웅별.블라스터로 처치"
        },
        "블라스터로 처치 - 10분당 평균": {
          $avg: "$rankplay.record.메르시.영웅별.블라스터로 처치 - 10분당 평균"
        },
        "블라스터로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.메르시.영웅별.블라스터로 처치 - 한 게임 최고기록"
        },
        "자가 치유": {
          $avg: "$rankplay.record.메르시.영웅별.자가 치유"
        },
        "자가 치유 - 10분당 평균": {
          $avg: "$rankplay.record.메르시.영웅별.자가 치유 - 10분당 평균"
        },
        "자가 치유 - 한 게임 최고기록": {
          $avg: "$rankplay.record.메르시.영웅별.자가 치유 - 한 게임 최고기록"
        },

        "게임당_공격력 증폭": {
          $avg: {
            $divide: [
              "$rankplay.record.메르시.영웅별.공격력 증폭",
              "$rankplay.record.메르시.게임.치른 게임"
            ]
          }
        },
        "게임당_공격력 증폭_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.메르시.영웅별.공격력 증폭",
                "$rankplay.record.메르시.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_공격력 증폭_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.메르시.영웅별.공격력 증폭",
                "$rankplay.record.메르시.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_부활한 플레이어": {
          $avg: {
            $divide: [
              "$rankplay.record.메르시.영웅별.부활한 플레이어",
              "$rankplay.record.메르시.게임.치른 게임"
            ]
          }
        },
        "게임당_부활한 플레이어_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.메르시.영웅별.부활한 플레이어",
                "$rankplay.record.메르시.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_부활한 플레이어_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.메르시.영웅별.부활한 플레이어",
                "$rankplay.record.메르시.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_블라스터로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.메르시.영웅별.블라스터로 처치",
              "$rankplay.record.메르시.게임.치른 게임"
            ]
          }
        },
        "게임당_블라스터로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.메르시.영웅별.블라스터로 처치",
                "$rankplay.record.메르시.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_블라스터로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.메르시.영웅별.블라스터로 처치",
                "$rankplay.record.메르시.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자가 치유": {
          $avg: {
            $divide: [
              "$rankplay.record.메르시.영웅별.자가 치유",
              "$rankplay.record.메르시.게임.치른 게임"
            ]
          }
        },
        "게임당_자가 치유_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.메르시.영웅별.자가 치유",
                "$rankplay.record.메르시.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자가 치유_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.메르시.영웅별.자가 치유",
                "$rankplay.record.메르시.게임.치른 게임"
              ]
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

        "게임당_부활한 플레이어.avg": "$게임당_부활한 플레이어",
        "게임당_부활한 플레이어.min": "$게임당_부활한 플레이어_최소",
        "게임당_부활한 플레이어.max": "$게임당_부활한 플레이어_최대",

        "게임당_블라스터로 처치.avg": "$게임당_블라스터로 처치",
        "게임당_블라스터로 처치.min": "$게임당_블라스터로 처치_최소",
        "게임당_블라스터로 처치.max": "$게임당_블라스터로 처치_최대",

        "게임당_자가 치유.avg": "$게임당_자가 치유",
        "게임당_자가 치유.min": "$게임당_자가 치유_최소",
        "게임당_자가 치유.max": "$게임당_자가 치유_최대"
      }
    },
    {
      $project: {
        "게임당_공격력 증폭": 1,
        "게임당_부활한 플레이어": 1,
        "게임당_블라스터로 처치": 1,
        "게임당_자가 치유": 1
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
