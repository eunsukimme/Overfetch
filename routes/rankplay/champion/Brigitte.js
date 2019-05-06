const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* 브리기테 영웅별 스키마
"영웅별": 
{
"격려 활성 시간 비율": 37,
"막은 피해": 144290,
"막은 피해 - 10분당 평균": 5.21,
"막은 피해 - 한 게임 최고기록": 6246,
"방어력 제공": 152994,
"방어력 제공 - 10분당 평균": 5.53,
"방어력 제공 - 한 게임 최고기록": 7447,
"자가 치유": 70401,
"자가 치유 - 10분당 평균": 2.54
}
*/

// path: /avg/rankplay/champion/브리기테
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
        "rankplay.record.브리기테.영웅별": 1,
        "rankplay.record.브리기테.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.브리기테.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        /*'막은 피해': {
                    $avg: '$rankplay.record.브리기테.영웅별.막은 피해'
                },
                '막은 피해 - 10분당 평균': {
                    $avg: '$rankplay.record.브리기테.영웅별.막은 피해 - 10분당 평균'
                },
                '막은 피해 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.브리기테.영웅별.막은 피해 - 한 게임 최고기록'
                },
                '격려 활성 시간 비율': {
                    $avg: '$rankplay.record.브리기테.영웅별.격려 활성 시간 비율'
                },
                '방어력 제공': {
                    $avg: '$rankplay.record.브리기테.영웅별.방어력 제공'
                },
                '방어력 제공 - 10분당 평균': {
                    $avg: '$rankplay.record.브리기테.영웅별.방어력 제공 - 10분당 평균'
                },
                '방어력 제공 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.브리기테.영웅별.방어력 제공 - 한 게임 최고기록'
                },
                '자가 치유': {
                    $avg: '$rankplay.record.브리기테.영웅별.자가 치유'
                },
                '자가 치유 - 10분당 평균': {
                    $avg: '$rankplay.record.브리기테.영웅별.자가 치유 - 10분당 평균'
                },*/

        "게임당_막은 피해": {
          $avg: {
            $divide: [
              "$rankplay.record.브리기테.영웅별.막은 피해",
              "$rankplay.record.브리기테.게임.치른 게임"
            ]
          }
        },
        "게임당_막은 피해_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.브리기테.영웅별.막은 피해",
                "$rankplay.record.브리기테.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_막은 피해_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.브리기테.영웅별.막은 피해",
                "$rankplay.record.브리기테.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_방어력 제공": {
          $avg: {
            $divide: [
              "$rankplay.record.브리기테.영웅별.방어력 제공",
              "$rankplay.record.브리기테.게임.치른 게임"
            ]
          }
        },
        "게임당_방어력 제공_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.브리기테.영웅별.방어력 제공",
                "$rankplay.record.브리기테.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_방어력 제공_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.브리기테.영웅별.방어력 제공",
                "$rankplay.record.브리기테.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자가 치유": {
          $avg: {
            $divide: [
              "$rankplay.record.브리기테.영웅별.자가 치유",
              "$rankplay.record.브리기테.게임.치른 게임"
            ]
          }
        },
        "게임당_자가 치유_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.브리기테.영웅별.자가 치유",
                "$rankplay.record.브리기테.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자가 치유_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.브리기테.영웅별.자가 치유",
                "$rankplay.record.브리기테.게임.치른 게임"
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        "게임당_막은 피해.avg": "$게임당_막은 피해",
        "게임당_막은 피해.min": "$게임당_막은 피해_최소",
        "게임당_막은 피해.max": "$게임당_막은 피해_최대",

        "게임당_방어력 제공.avg": "$게임당_방어력 제공",
        "게임당_방어력 제공.min": "$게임당_방어력 제공_최소",
        "게임당_방어력 제공.max": "$게임당_방어력 제공_최대",

        "게임당_자가 치유.avg": "$게임당_자가 치유",
        "게임당_자가 치유.min": "$게임당_자가 치유_최소",
        "게임당_자가 치유.max": "$게임당_자가 치유_최대"
      }
    },
    {
      $project: {
        "게임당_막은 피해": 1,
        "게임당_방어력 제공": 1,
        "게임당_자가 치유": 1
      }
    }
  ]);
  aggregation.options = { allowDiskUse: true };
  aggregation.exec((err, users) => {
    if (err) return res.json({ error: err });
    return res.json(users);
  });
});

module.exports = router;
