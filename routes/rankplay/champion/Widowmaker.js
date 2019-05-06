const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* 위도우메이커 영웅별 스키마
"영웅별": 
{
"맹독 지뢰로 처치": 49,
"맹독 지뢰로 처치 - 10분당 평균": 0,
"맹독 지뢰로 처치 - 한 게임 최고기록": 3,
"보조 발사 적중률": 46,
"저격 명중률": 47,
"저격 명중률 - 한 게임 최고기록": 100,
"저격 치명타": 1203,
"저격 치명타 - 10분당 평균": 0.03,
"저격 치명타 - 한 게임 최고기록": 20,
"저격 치명타 명중률": 32,
"저격 치명타 처치": 645,
"저격 치명타 처치 - 10분당 평균": 0.01
}
*/

// path: /avg/rankplay/champion/위도우위도우메이커커
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
        "rankplay.record.위도우메이커.영웅별": 1,
        "rankplay.record.위도우메이커.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.위도우메이커.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        "맹독 지뢰로 처치": {
          $avg: "$rankplay.record.위도우메이커.영웅별.맹독 지뢰로 처치"
        },
        "맹독 지뢰로 처치 - 10분당 평균": {
          $avg:
            "$rankplay.record.위도우메이커.영웅별.맹독 지뢰로 처치 - 10분당 평균"
        },
        "맹독 지뢰로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.위도우메이커.영웅별.맹독 지뢰로 처치 - 한 게임 최고기록"
        },
        "저격 치명타": {
          $avg: "$rankplay.record.위도우메이커.영웅별.저격 치명타"
        },
        "저격 치명타 - 10분당 평균": {
          $avg: "$rankplay.record.위도우메이커.영웅별.저격 치명타 - 10분당 평균"
        },
        "저격 치명타 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.위도우메이커.영웅별.저격 치명타 - 한 게임 최고기록"
        },
        "저격 치명타 처치": {
          $avg: "$rankplay.record.위도우메이커.영웅별.저격 치명타 처치"
        },
        "저격 치명타 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.위도우메이커.영웅별.저격 치명타 처치 - 한 게임 최고기록"
        },

        "보조 발사 적중률": {
          $avg: "$rankplay.record.위도우메이커.영웅별.보조 발사 적중률"
        },
        "보조 발사 적중률_최소": {
          $min: {
            $avg: "$rankplay.record.위도우메이커.영웅별.보조 발사 적중률"
          }
        },
        "보조 발사 적중률_최대": {
          $max: {
            $avg: "$rankplay.record.위도우메이커.영웅별.보조 발사 적중률"
          }
        },
        "저격 명중률": {
          $avg: "$rankplay.record.위도우메이커.영웅별.저격 명중률"
        },
        "저격 명중률_최소": {
          $min: {
            $avg: "$rankplay.record.위도우메이커.영웅별.저격 명중률"
          }
        },
        "저격 명중률_최대": {
          $max: {
            $avg: "$rankplay.record.위도우메이커.영웅별.저격 명중률"
          }
        },
        "저격 치명타 명중률": {
          $avg: "$rankplay.record.위도우메이커.영웅별.저격 치명타 명중률"
        },
        "저격 치명타 명중률_최소": {
          $min: {
            $avg: "$rankplay.record.위도우메이커.영웅별.저격 치명타 명중률"
          }
        },
        "저격 치명타 명중률_최대": {
          $max: {
            $avg: "$rankplay.record.위도우메이커.영웅별.저격 치명타 명중률"
          }
        },
        "게임당_맹독 지뢰로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.위도우메이커.영웅별.맹독 지뢰로 처치",
              "$rankplay.record.위도우메이커.게임.치른 게임"
            ]
          }
        },
        "게임당_맹독 지뢰로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.위도우메이커.영웅별.맹독 지뢰로 처치",
                "$rankplay.record.위도우메이커.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_맹독 지뢰로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.위도우메이커.영웅별.맹독 지뢰로 처치",
                "$rankplay.record.위도우메이커.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_저격 치명타": {
          $avg: {
            $divide: [
              "$rankplay.record.위도우메이커.영웅별.저격 치명타",
              "$rankplay.record.위도우메이커.게임.치른 게임"
            ]
          }
        },
        "게임당_저격 치명타_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.위도우메이커.영웅별.저격 치명타",
                "$rankplay.record.위도우메이커.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_저격 치명타_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.위도우메이커.영웅별.저격 치명타",
                "$rankplay.record.위도우메이커.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_저격 치명타 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.위도우메이커.영웅별.저격 치명타 처치",
              "$rankplay.record.위도우메이커.게임.치른 게임"
            ]
          }
        },
        "게임당_저격 치명타 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.위도우메이커.영웅별.저격 치명타 처치",
                "$rankplay.record.위도우메이커.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_저격 치명타 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.위도우메이커.영웅별.저격 치명타 처치",
                "$rankplay.record.위도우메이커.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자가 치유": {
          $avg: {
            $divide: [
              "$rankplay.record.위도우메이커.영웅별.자가 치유",
              "$rankplay.record.위도우메이커.게임.치른 게임"
            ]
          }
        },
        "게임당_자가 치유_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.위도우메이커.영웅별.자가 치유",
                "$rankplay.record.위도우메이커.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자가 치유_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.위도우메이커.영웅별.자가 치유",
                "$rankplay.record.위도우메이커.게임.치른 게임"
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        "게임당_맹독 지뢰로 처치.avg": "$게임당_맹독 지뢰로 처치",
        "게임당_맹독 지뢰로 처치.min": "$게임당_맹독 지뢰로 처치_최소",
        "게임당_맹독 지뢰로 처치.max": "$게임당_맹독 지뢰로 처치_최대",

        "게임당_저격 치명타.avg": "$게임당_저격 치명타",
        "게임당_저격 치명타.min": "$게임당_저격 치명타_최소",
        "게임당_저격 치명타.max": "$게임당_저격 치명타_최대",

        "게임당_저격 치명타 처치.avg": "$게임당_저격 치명타 처치",
        "게임당_저격 치명타 처치.min": "$게임당_저격 치명타 처치_최소",
        "게임당_저격 치명타 처치.max": "$게임당_저격 치명타 처치_최대",

        "보조 발사 적중률.avg": "$보조 발사 적중률",
        "보조 발사 적중률.min": "$보조 발사 적중률_최소",
        "보조 발사 적중률.max": "$보조 발사 적중률_최대",

        "저격 명중률.avg": "$저격 명중률",
        "저격 명중률.min": "$저격 명중률_최소",
        "저격 명중률.max": "$저격 명중률_최대",

        "저격 치명타 명중률.avg": "$저격 치명타 명중률",
        "저격 치명타 명중률.min": "$저격 치명타 명중률_최소",
        "저격 치명타 명중률.max": "$저격 치명타 명중률_최대"
      }
    },
    {
      $project: {
        "게임당_맹독 지뢰로 처치": 1,
        "게임당_저격 치명타": 1,
        "게임당_저격 치명타 처치": 1,
        "보조 발사 적중률": 1,
        "저격 명중률": 1,
        "저격 치명타 명중률": 1
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
