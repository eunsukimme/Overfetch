const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* 자리야 영웅별 스키마
"영웅별": 
{
"고에너지로 처치": 239,
"고에너지로 처치 - 10분당 평균": 0.03,
"고에너지로 처치 - 한 게임 최고기록": 33,
"기본 발사 적중률": 39,
"막은 피해": 94057,
"막은 피해 - 10분당 평균": 10.02,
"막은 피해 - 한 게임 최고기록": 7445,
"방벽 씌우기": 521,
"방벽 씌우기 - 10분당 평균": 0.06,
"방벽 씌우기 - 한 게임 최고기록": 41,
"보조 발사 적중률": 34,
"중력자탄으로 처치": 65,
"중력자탄으로 처치 - 10분당 평균": 0.01,
"중력자탄으로 처치 - 한 게임 최고기록": 10,
"평균 에너지": 48,
"평균 에너지 - 한 게임 최고기록": 78
}
*/

// path: /avg/rankplay/champion/자리야
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
        "rankplay.record.자리야.영웅별": 1,
        "rankplay.record.자리야.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.자리야.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        "고에너지로 처치": {
          $avg: "$rankplay.record.자리야.영웅별.고에너지로 처치"
        },
        "고에너지로 처치 - 10분당 평균": {
          $avg: "$rankplay.record.자리야.영웅별.고에너지로 처치 - 10분당 평균"
        },
        "고에너지로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.자리야.영웅별.고에너지로 처치 - 한 게임 최고기록"
        },
        "막은 피해": {
          $avg: "$rankplay.record.자리야.영웅별.막은 피해"
        },
        "막은 피해 - 10분당 평균": {
          $avg: "$rankplay.record.자리야.영웅별.막은 피해 - 10분당 평균"
        },
        "막은 피해 - 한 게임 최고기록": {
          $avg: "$rankplay.record.자리야.영웅별.막은 피해 - 한 게임 최고기록"
        },
        "방벽 씌우기": {
          $avg: "$rankplay.record.자리야.영웅별.방벽 씌우기"
        },
        "방벽 씌우기 - 10분당 평균": {
          $avg: "$rankplay.record.자리야.영웅별.방벽 씌우기 - 10분당 평균"
        },
        "방벽 씌우기 - 한 게임 최고기록": {
          $avg: "$rankplay.record.자리야.영웅별.방벽 씌우기 - 한 게임 최고기록"
        },
        "중력자탄으로 처치": {
          $avg: "$rankplay.record.자리야.영웅별.중력자탄으로 처치"
        },
        "중력자탄으로 처치 - 10분당 평균": {
          $avg: "$rankplay.record.자리야.영웅별.중력자탄으로 처치 - 10분당 평균"
        },
        "중력자탄으로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.자리야.영웅별.중력자탄으로 처치 - 한 게임 최고기록"
        },

        "보조 발사 적중률": {
          $avg: "$rankplay.record.자리야.영웅별.보조 발사 적중률"
        },
        "보조 발사 적중률_최소": {
          $min: {
            $avg: "$rankplay.record.자리야.영웅별.보조 발사 적중률"
          }
        },
        "보조 발사 적중률_최대": {
          $max: {
            $avg: "$rankplay.record.자리야.영웅별.보조 발사 적중률"
          }
        },
        "기본 발사 적중률": {
          $avg: "$rankplay.record.자리야.영웅별.기본 발사 적중률"
        },
        "기본 발사 적중률_최소": {
          $min: {
            $avg: "$rankplay.record.자리야.영웅별.기본 발사 적중률"
          }
        },
        "기본 발사 적중률_최대": {
          $max: {
            $avg: "$rankplay.record.자리야.영웅별.기본 발사 적중률"
          }
        },
        "게임당_고에너지로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.자리야.영웅별.고에너지로 처치",
              "$rankplay.record.자리야.게임.치른 게임"
            ]
          }
        },
        "게임당_고에너지로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.자리야.영웅별.고에너지로 처치",
                "$rankplay.record.자리야.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_고에너지로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.자리야.영웅별.고에너지로 처치",
                "$rankplay.record.자리야.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_막은 피해": {
          $avg: {
            $divide: [
              "$rankplay.record.자리야.영웅별.막은 피해",
              "$rankplay.record.자리야.게임.치른 게임"
            ]
          }
        },
        "게임당_막은 피해_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.자리야.영웅별.막은 피해",
                "$rankplay.record.자리야.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_막은 피해_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.자리야.영웅별.막은 피해",
                "$rankplay.record.자리야.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_방벽 씌우기": {
          $avg: {
            $divide: [
              "$rankplay.record.자리야.영웅별.방벽 씌우기",
              "$rankplay.record.자리야.게임.치른 게임"
            ]
          }
        },
        "게임당_방벽 씌우기_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.자리야.영웅별.방벽 씌우기",
                "$rankplay.record.자리야.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_방벽 씌우기_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.자리야.영웅별.방벽 씌우기",
                "$rankplay.record.자리야.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_중력자탄으로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.자리야.영웅별.중력자탄으로 처치",
              "$rankplay.record.자리야.게임.치른 게임"
            ]
          }
        },
        "게임당_중력자탄으로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.자리야.영웅별.중력자탄으로 처치",
                "$rankplay.record.자리야.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_중력자탄으로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.자리야.영웅별.중력자탄으로 처치",
                "$rankplay.record.자리야.게임.치른 게임"
              ]
            }
          }
        },
        "평균 에너지": {
          $avg: "$rankplay.record.자리야.영웅별.평균 에너지"
        },
        "평균 에너지_최소": {
          $min: {
            $avg: "$rankplay.record.자리야.영웅별.평균 에너지"
          }
        },
        "평균 에너지_최대": {
          $max: {
            $avg: "$rankplay.record.자리야.영웅별.평균 에너지"
          }
        }
      }
    },
    {
      $addFields: {
        "게임당_고에너지로 처치.avg": "$게임당_고에너지로 처치",
        "게임당_고에너지로 처치.min": "$게임당_고에너지로 처치_최소",
        "게임당_고에너지로 처치.max": "$게임당_고에너지로 처치_최대",

        "게임당_막은 피해.avg": "$게임당_막은 피해",
        "게임당_막은 피해.min": "$게임당_막은 피해_최소",
        "게임당_막은 피해.max": "$게임당_막은 피해_최대",

        "게임당_방벽 씌우기.avg": "$게임당_방벽 씌우기",
        "게임당_방벽 씌우기.min": "$게임당_방벽 씌우기_최소",
        "게임당_방벽 씌우기.max": "$게임당_방벽 씌우기_최대",

        "게임당_중력자탄으로 처치.avg": "$게임당_중력자탄으로 처치",
        "게임당_중력자탄으로 처치.min": "$게임당_중력자탄으로 처치_최소",
        "게임당_중력자탄으로 처치.max": "$게임당_중력자탄으로 처치_최대",

        "평균 에너지.avg": "$평균 에너지",
        "평균 에너지.min": "$평균 에너지_최소",
        "평균 에너지.max": "$평균 에너지_최대",

        "보조 발사 적중률.avg": "$보조 발사 적중률",
        "보조 발사 적중률.min": "$보조 발사 적중률_최소",
        "보조 발사 적중률.max": "$보조 발사 적중률_최대",

        "기본 발사 적중률.avg": "$기본 발사 적중률",
        "기본 발사 적중률.min": "$기본 발사 적중률_최소",
        "기본 발사 적중률.max": "$기본 발사 적중률_최대"
      }
    },
    {
      $project: {
        "게임당_고에너지로 처치": 1,
        "게임당_막은 피해": 1,
        "게임당_방벽 씌우기": 1,
        "게임당_중력자탄으로 처치": 1,
        "평균 에너지": 1,
        "보조 발사 적중률": 1,
        "기본 발사 적중률": 1
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
