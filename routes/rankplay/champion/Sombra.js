const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* 솜브라 영웅별 스키마
"영웅별": 
{
"EMP 맞힌 적": 208,
"EMP 맞힌 적 - 10분당 평균": 0.02,
"EMP 맞힌 적 - 한 게임 최고기록": 22,
"해킹한 적": 479,
"해킹한 적 - 10분당 평균": 0.04,
"해킹한 적 - 한 게임 최고기록": 46
}
*/

// path: /avg/rankplay/champion/솜브라
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
        "rankplay.record.솜브라.영웅별": 1,
        "rankplay.record.솜브라.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.솜브라.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        "EMP 맞힌 적": {
          $avg: "$rankplay.record.솜브라.영웅별.EMP 맞힌 적"
        },
        "EMP 맞힌 적 - 10분당 평균": {
          $avg: "$rankplay.record.솜브라.영웅별.EMP 맞힌 적 - 10분당 평균"
        },
        "EMP 맞힌 적 - 한 게임 최고기록": {
          $avg: "$rankplay.record.솜브라.영웅별.EMP 맞힌 적 - 한 게임 최고기록"
        },
        "해킹한 적": {
          $avg: "$rankplay.record.솜브라.영웅별.해킹한 적"
        },
        "해킹한 적 - 10분당 평균": {
          $avg: "$rankplay.record.솜브라.영웅별.해킹한 적 - 10분당 평균"
        },
        "해킹한 적 - 한 게임 최고기록": {
          $avg: "$rankplay.record.솜브라.영웅별.해킹한 적 - 한 게임 최고기록"
        },

        "게임당_EMP 맞힌 적": {
          $avg: {
            $divide: [
              "$rankplay.record.솜브라.영웅별.EMP 맞힌 적",
              "$rankplay.record.솜브라.게임.치른 게임"
            ]
          }
        },
        "게임당_EMP 맞힌 적_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.솜브라.영웅별.EMP 맞힌 적",
                "$rankplay.record.솜브라.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_EMP 맞힌 적_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.솜브라.영웅별.EMP 맞힌 적",
                "$rankplay.record.솜브라.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_해킹한 적": {
          $avg: {
            $divide: [
              "$rankplay.record.솜브라.영웅별.해킹한 적",
              "$rankplay.record.솜브라.게임.치른 게임"
            ]
          }
        },
        "게임당_해킹한 적_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.솜브라.영웅별.해킹한 적",
                "$rankplay.record.솜브라.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_해킹한 적_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.솜브라.영웅별.해킹한 적",
                "$rankplay.record.솜브라.게임.치른 게임"
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        "게임당_EMP 맞힌 적.avg": "$게임당_EMP 맞힌 적",
        "게임당_EMP 맞힌 적.min": "$게임당_EMP 맞힌 적_최소",
        "게임당_EMP 맞힌 적.max": "$게임당_EMP 맞힌 적_최대",

        "게임당_해킹한 적.avg": "$게임당_해킹한 적",
        "게임당_해킹한 적.min": "$게임당_해킹한 적_최소",
        "게임당_해킹한 적.max": "$게임당_해킹한 적_최대"
      }
    },
    {
      $project: {
        "게임당_EMP 맞힌 적": 1,
        "게임당_해킹한 적": 1
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
