const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* 둠피스트 영웅별 스키마
"영웅별": 
{
"기술로 준 피해": 261445,
"기술로 준 피해 - 10분당 평균": 9.35,
"기술로 준 피해 - 한 게임 최고기록": 12445,
"생성한 보호막": 123394,
"생성한 보호막 - 10분당 평균": 4.41,
"생성한 보호막 - 한 게임 최고기록": 5782,
"파멸의 일격으로 처치": 163,
"파멸의 일격으로 처치 - 10분당 평균": 0.01,
"파멸의 일격으로 처치 - 한 게임 최고기록": 11
}
*/

// path: /avg/rankplay/champion/둠피스트
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
        "rankplay.record.둠피스트.영웅별": 1,
        "rankplay.record.둠피스트.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.둠피스트.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        /*'기술로 준 피해': {
                    $avg: '$rankplay.record.둠피스트.영웅별.기술로 준 피해'
                },
                '기술로 준 피해 - 10분당 평균': {
                    $avg: '$rankplay.record.둠피스트.영웅별.기술로 준 피해 - 10분당 평균'
                },
                '기술로 준 피해 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.둠피스트.영웅별.기술로 준 피해 - 한 게임 최고기록'
                },
                '보조 발사 적중률': {
                    $avg: '$rankplay.record.둠피스트.영웅별.보조 발사 적중률'
                },
                '생성한 보호막': {
                    $avg: '$rankplay.record.둠피스트.영웅별.생성한 보호막'
                },
                '생성한 보호막 - 10분당 평균': {
                    $avg: '$rankplay.record.둠피스트.영웅별.생성한 보호막 - 10분당 평균'
                },
                '생성한 보호막 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.둠피스트.영웅별.생성한 보호막 - 한 게임 최고기록'
                },
                '파멸의 일격으로 처치': {
                    $avg: '$rankplay.record.둠피스트.영웅별.파멸의 일격으로 처치'
                },
                '파멸의 일격으로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.둠피스트.영웅별.파멸의 일격으로 처치 - 10분당 평균'
                },
                '파멸의 일격으로 처치 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.둠피스트.영웅별.파멸의 일격으로 처치 - 한 게임 최고기록'
                },*/
        "게임당_기술로 준 피해": {
          $avg: {
            $divide: [
              "$rankplay.record.둠피스트.영웅별.기술로 준 피해",
              "$rankplay.record.둠피스트.게임.치른 게임"
            ]
          }
        },
        "게임당_기술로 준 피해_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.둠피스트.영웅별.기술로 준 피해",
                "$rankplay.record.둠피스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_기술로 준 피해_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.둠피스트.영웅별.기술로 준 피해",
                "$rankplay.record.둠피스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_생성한 보호막": {
          $avg: {
            $divide: [
              "$rankplay.record.둠피스트.영웅별.생성한 보호막",
              "$rankplay.record.둠피스트.게임.치른 게임"
            ]
          }
        },
        "게임당_생성한 보호막_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.둠피스트.영웅별.생성한 보호막",
                "$rankplay.record.둠피스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_생성한 보호막_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.둠피스트.영웅별.생성한 보호막",
                "$rankplay.record.둠피스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_파멸의 일격으로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.둠피스트.영웅별.파멸의 일격으로 처치",
              "$rankplay.record.둠피스트.게임.치른 게임"
            ]
          }
        },
        "게임당_파멸의 일격으로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.둠피스트.영웅별.파멸의 일격으로 처치",
                "$rankplay.record.둠피스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_파멸의 일격으로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.둠피스트.영웅별.파멸의 일격으로 처치",
                "$rankplay.record.둠피스트.게임.치른 게임"
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        "게임당_기술로 준 피해.avg": "$게임당_기술로 준 피해",
        "게임당_기술로 준 피해.min": "$게임당_기술로 준 피해_최소",
        "게임당_기술로 준 피해.max": "$게임당_기술로 준 피해_최대",

        "게임당_생성한 보호막.avg": "$게임당_생성한 보호막",
        "게임당_생성한 보호막.min": "$게임당_생성한 보호막_최소",
        "게임당_생성한 보호막.max": "$게임당_생성한 보호막_최대",

        "게임당_파멸의 일격으로 처치.avg": "$게임당_파멸의 일격으로 처치",
        "게임당_파멸의 일격으로 처치.min": "$게임당_파멸의 일격으로 처치_최소",
        "게임당_파멸의 일격으로 처치.max": "$게임당_파멸의 일격으로 처치_최대"
      }
    },
    {
      $project: {
        "게임당_기술로 준 피해": 1,
        "게임당_생성한 보호막": 1,
        "게임당_파멸의 일격으로 처치": 1
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
