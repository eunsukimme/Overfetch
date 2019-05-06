const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* D-Va 영웅별 스키마
"영웅별": 
{
    "막은 피해": 15549,
    "막은 피해 - 10분당 평균": 12.03,
    "막은 피해 - 한 게임 최고기록": 8677,
    "보조 발사 적중률": 29,
    "자폭으로 처치": 7,
    "자폭으로 처치 - 10분당 평균": 0.01,
    "자폭으로 처치 - 한 게임 최고기록": 4,
    "파괴된 메카": 11,
    "호출한 메카": 11,
    "호출한 메카 - 10분당 평균": 0.01,
    "호출한 메카 - 한 게임 최고기록": 7
}
*/

// path: /avg/rankplay/champion/D-Va
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
        "rankplay.record.D-Va.영웅별": 1,
        "rankplay.record.D-Va.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.D-Va.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        /*'막은 피해': {
                    $avg: '$rankplay.record.D-Va.영웅별.막은 피해'
                },
                '막은 피해 - 10분당 평균': {
                    $avg: '$rankplay.record.D-Va.영웅별.막은 피해 - 10분당 평균'
                },
                '막은 피해 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.D-Va.영웅별.막은 피해 - 한 게임 최고기록'
                },
                '보조 발사 적중률': {
                    $avg: '$rankplay.record.D-Va.영웅별.보조 발사 적중률'
                },
                '자폭으로 처치': {
                    $avg: '$rankplay.record.D-Va.영웅별.자폭으로 처치'
                },
                '자폭으로 처치 - 10분당 평균': {
                    $avg: '$rankplay.record.D-Va.영웅별.자폭으로 처치 - 10분당 평균'
                },
                '자폭으로 처치 - 한 게임 최고기록균': {
                    $avg: '$rankplay.record.D-Va.영웅별.자폭으로 처치 - 한 게임 최고기록'
                },
                '파괴된 메카': {
                    $avg: '$rankplay.record.D-Va.영웅별.파괴된 메카'
                },
                '호출한 메카': {
                    $avg: '$rankplay.record.D-Va.영웅별.호출한 메카'
                },
                '호출한 메카 - 10분당 평균': {
                    $avg: '$rankplay.record.D-Va.영웅별.호출한 메카 - 10분당 평균'
                },
                '호출한 메카 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.D-Va.영웅별.호출한 메카 - 한 게임 최고기록'
                },*/

        "보조 발사 적중률": {
          $avg: "$rankplay.record.D-Va.영웅별.보조 발사 적중률"
        },
        "보조 발사 적중률_최소": {
          $min: {
            $avg: "$rankplay.record.D-Va.영웅별.보조 발사 적중률"
          }
        },
        "보조 발사 적중률_최대": {
          $max: {
            $avg: "$rankplay.record.D-Va.영웅별.보조 발사 적중률"
          }
        },
        "게임당_호출한 메카": {
          $avg: {
            $divide: [
              "$rankplay.record.D-Va.영웅별.호출한 메카",
              "$rankplay.record.D-Va.게임.치른 게임"
            ]
          }
        },
        "게임당_호출한 메카_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.D-Va.영웅별.호출한 메카",
                "$rankplay.record.D-Va.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_호출한 메카_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.D-Va.영웅별.호출한 메카",
                "$rankplay.record.D-Va.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_막은 피해": {
          $avg: {
            $divide: [
              "$rankplay.record.D-Va.영웅별.막은 피해",
              "$rankplay.record.D-Va.게임.치른 게임"
            ]
          }
        },
        "게임당_막은 피해_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.D-Va.영웅별.막은 피해",
                "$rankplay.record.D-Va.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_막은 피해_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.D-Va.영웅별.막은 피해",
                "$rankplay.record.D-Va.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자폭으로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.D-Va.영웅별.자폭으로 처치",
              "$rankplay.record.D-Va.게임.치른 게임"
            ]
          }
        },
        "게임당_자폭으로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.D-Va.영웅별.자폭으로 처치",
                "$rankplay.record.D-Va.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자폭으로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.D-Va.영웅별.자폭으로 처치",
                "$rankplay.record.D-Va.게임.치른 게임"
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        "게임당_호출한 메카.avg": "$게임당_호출한 메카",
        "게임당_호출한 메카.min": "$게임당_호출한 메카_최소",
        "게임당_호출한 메카.max": "$게임당_호출한 메카_최대",

        "게임당_막은 피해.avg": "$게임당_막은 피해",
        "게임당_막은 피해.min": "$게임당_막은 피해_최소",
        "게임당_막은 피해.max": "$게임당_막은 피해_최대",

        "게임당_자폭으로 처치.avg": "$게임당_자폭으로 처치",
        "게임당_자폭으로 처치.min": "$게임당_자폭으로 처치_최소",
        "게임당_자폭으로 처치.max": "$게임당_자폭으로 처치_최대",

        "보조 발사 적중률.avg": "$보조 발사 적중률",
        "보조 발사 적중률.min": "$보조 발사 적중률_최소",
        "보조 발사 적중률.max": "$보조 발사 적중률_최대"
      }
    },
    {
      $project: {
        "게임당_호출한 메카": 1,
        "게임당_막은 피해": 1,
        "게임당_자폭으로 처치": 1,
        "보조 발사 적중률": 1
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
