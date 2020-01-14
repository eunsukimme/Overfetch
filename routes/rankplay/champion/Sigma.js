const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* 시그마 영웅별 스키마
"영웅별": 
{
강착으로 처치:41
강착으로 처치 - 10분당 평균:3.35
강착으로 처치 - 한 게임 최고기록:5
막은 피해:172733
막은 피해 - 10분당 평균:17827
막은 피해 - 한 게임 최고기록:19289
중력 붕괴로 처치:21
중력 붕괴로 처치 - 10분당 평균:1.71
중력 붕괴로 처치 - 한 게임 최고기록:4
흡수한 피해:29195
흡수한 피해 - 10분당 평균:2384
흡수한 피해 - 한 게임 최고기록:4582
}
*/

// path: /avg/rankplay/champion/시그마
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
        "rankplay.record.시그마.영웅별": 1,
        "rankplay.record.시그마.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.시그마.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        "강착으로 처치": {
          $avg: "$rankplay.record.시그마.영웅별.강착으로 처치"
        },
        "강착으로 처치 - 10분당 평균": {
          $avg: "$rankplay.record.시그마.영웅별.강착으로 처치 - 10분당 평균"
        },
        "강착으로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.시그마.영웅별.강착으로 처치 - 한 게임 최고기록"
        },
        "중력 붕괴로 처치": {
          $avg: "$rankplay.record.시그마.영웅별.중력 붕괴로 처치"
        },
        "중력 붕괴로 처치 - 10분당 평균": {
          $avg: "$rankplay.record.시그마.영웅별.중력 붕괴로 처치 - 10분당 평균"
        },
        "중력 붕괴로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.시그마.영웅별.중력 붕괴로 처치 - 한 게임 최고기록"
        },
        "막은 피해": {
          $avg: "$rankplay.record.시그마.영웅별.막은 피해"
        },
        "막은 피해 - 10분당 평균": {
          $avg: "$rankplay.record.시그마.영웅별.막은 피해 - 10분당 평균"
        },
        "막은 피해 - 한 게임 최고기록": {
          $avg: "$rankplay.record.시그마.영웅별.막은 피해 - 한 게임 최고기록"
        },
        "흡수한 피해": {
          $avg: "$rankplay.record.시그마.영웅별.흡수한 피해"
        },
        "흡수한 피해 - 10분당 평균": {
          $avg: "$rankplay.record.시그마.영웅별.흡수한 피해 - 10분당 평균"
        },
        "흡수한 피해 - 한 게임 최고기록": {
          $avg: "$rankplay.record.시그마.영웅별.흡수한 피해 - 한 게임 최고기록"
        },
        "게임당_강착으로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.시그마.영웅별.강착으로 처치",
              "$rankplay.record.시그마.게임.치른 게임"
            ]
          }
        },
        "게임당_강착으로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.시그마.영웅별.강착으로 처치",
                "$rankplay.record.시그마.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_강착으로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.시그마.영웅별.강착으로 처치",
                "$rankplay.record.시그마.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_중력 붕괴로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.시그마.영웅별.중력 붕괴로 처치",
              "$rankplay.record.시그마.게임.치른 게임"
            ]
          }
        },
        "게임당_중력 붕괴로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.시그마.영웅별.중력 붕괴로 처치",
                "$rankplay.record.시그마.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_중력 붕괴로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.시그마.영웅별.중력 붕괴로 처치",
                "$rankplay.record.시그마.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_막은 피해": {
          $avg: {
            $divide: [
              "$rankplay.record.시그마.영웅별.막은 피해",
              "$rankplay.record.시그마.게임.치른 게임"
            ]
          }
        },
        "게임당_막은 피해_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.시그마.영웅별.막은 피해",
                "$rankplay.record.시그마.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_막은 피해_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.시그마.영웅별.막은 피해",
                "$rankplay.record.시그마.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_흡수한 피해": {
          $avg: {
            $divide: [
              "$rankplay.record.시그마.영웅별.흡수한 피해",
              "$rankplay.record.시그마.게임.치른 게임"
            ]
          }
        },
        "게임당_흡수한 피해_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.시그마.영웅별.흡수한 피해",
                "$rankplay.record.시그마.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_흡수한 피해_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.시그마.영웅별.흡수한 피해",
                "$rankplay.record.시그마.게임.치른 게임"
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        "게임당_강착으로 처치.avg": "$게임당_강착으로 처치",
        "게임당_강착으로 처치.min": "$게임당_강착으로 처치_최소",
        "게임당_강착으로 처치.max": "$게임당_강착으로 처치_최대",

        "게임당_중력 붕괴로 처치.avg": "$게임당_중력 붕괴로 처치",
        "게임당_중력 붕괴로 처치.min": "$게임당_중력 붕괴로 처치_최소",
        "게임당_중력 붕괴로 처치.max": "$게임당_중력 붕괴로 처치_최대",

        "게임당_막은 피해.avg": "$게임당_막은 피해",
        "게임당_막은 피해.min": "$게임당_막은 피해_최소",
        "게임당_막은 피해.max": "$게임당_막은 피해_최대",

        "게임당_흡수한 피해.avg": "$게임당_흡수한 피해",
        "게임당_흡수한 피해.min": "$게임당_흡수한 피해_최소",
        "게임당_흡수한 피해.max": "$게임당_흡수한 피해_최대"
      }
    },
    {
      $project: {
        "게임당_강착으로 처치": 1,
        "게임당_중력 붕괴로 처치": 1,
        "게임당_막은 피해": 1,
        "게임당_흡수한 피해": 1
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
