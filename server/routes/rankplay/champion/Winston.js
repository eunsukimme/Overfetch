const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* 윈스턴 영웅별 스키마
"영웅별": 
{
"근접 공격으로 처치": 1783,
"근접 공격으로 처치 - 10분당 평균": 0.01,
"근접 공격으로 처치 - 한 게임 최고기록": 23,
"막은 피해": 2494638,
"막은 피해 - 10분당 평균": 15.65,
"막은 피해 - 한 게임 최고기록": 22753,
"무기로 처치": 4704,
"밀쳐낸 플레이어": 13864,
"밀쳐낸 플레이어 - 10분당 평균": 0.09,
"밀쳐낸 플레이어 - 한 게임 최고기록": 154,
"원시의 분노 근접 공격 적중률": 48,
"원시의 분노로 처치": 698,
"원시의 분노로 처치 - 10분당 평균": 0,
"원시의 분노로 처치 - 한 게임 최고기록": 12,
"점프 팩으로 처치": 1946,
"점프 팩으로 처치 - 10분당 평균": 0.01,
"점프 팩으로 처치 - 한 게임 최고기록": 21,
"점프로 처치": 1946,
"테슬라 캐논 적중률": 63
}
*/

// path: /avg/rankplay/champion/윈스턴
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
        "rankplay.record.윈스턴.영웅별": 1,
        "rankplay.record.윈스턴.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.윈스턴.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        "근접 공격으로 처치": {
          $avg: "$rankplay.record.윈스턴.영웅별.근접 공격으로 처치"
        },
        "근접 공격으로 처치 - 10분당 평균": {
          $avg:
            "$rankplay.record.윈스턴.영웅별.근접 공격으로 처치 - 10분당 평균"
        },
        "근접 공격으로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.윈스턴.영웅별.근접 공격으로 처치 - 한 게임 최고기록"
        },
        "막은 피해": {
          $avg: "$rankplay.record.윈스턴.영웅별.막은 피해"
        },
        "막은 피해 - 10분당 평균": {
          $avg: "$rankplay.record.윈스턴.영웅별.막은 피해 - 10분당 평균"
        },
        "막은 피해 - 한 게임 최고기록": {
          $avg: "$rankplay.record.윈스턴.영웅별.막은 피해 - 한 게임 최고기록"
        },
        "밀쳐낸 플레이어": {
          $avg: "$rankplay.record.윈스턴.영웅별.밀쳐낸 플레이어"
        },
        "밀쳐낸 플레이어 - 10분당 평균": {
          $avg: "$rankplay.record.윈스턴.영웅별.밀쳐낸 플레이어 - 10분당 평균"
        },
        "밀쳐낸 플레이어 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.윈스턴.영웅별.밀쳐낸 플레이어 - 한 게임 최고기록"
        },
        "원시의 분노로 처치": {
          $avg: "$rankplay.record.윈스턴.영웅별.원시의 분노로 처치"
        },
        "원시의 분노로 처치 - 10분당 평균": {
          $avg:
            "$rankplay.record.윈스턴.영웅별.원시의 분노로 처치 - 10분당 평균"
        },
        "원시의 분노로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.윈스턴.영웅별.원시의 분노로 처치 - 한 게임 최고기록"
        },
        "점프 팩으로 처치": {
          $avg: "$rankplay.record.윈스턴.영웅별.점프 팩으로 처치"
        },
        "점프 팩으로 처치 - 10분당 평균": {
          $avg: "$rankplay.record.윈스턴.영웅별.점프 팩으로 처치 - 10분당 평균"
        },
        "점프 팩으로 처치 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.윈스턴.영웅별.점프 팩으로 처치 - 한 게임 최고기록"
        },
        "무기로 처치": {
          $avg: "$rankplay.record.윈스턴.영웅별.점프 팩으로 처치"
        },

        "테슬라 캐논 적중률": {
          $avg: "$rankplay.record.윈스턴.영웅별.테슬라 캐논 적중률"
        },
        "테슬라 캐논 적중률_최소": {
          $min: {
            $avg: "$rankplay.record.윈스턴.영웅별.테슬라 캐논 적중률"
          }
        },
        "테슬라 캐논 적중률_최대": {
          $max: {
            $avg: "$rankplay.record.윈스턴.영웅별.테슬라 캐논 적중률"
          }
        },
        "원시의 분노 근접 공격 적중률": {
          $avg: "$rankplay.record.윈스턴.영웅별.원시의 분노 근접 공격 적중률"
        },
        "원시의 분노 근접 공격 적중률_최소": {
          $min: {
            $avg: "$rankplay.record.윈스턴.영웅별.원시의 분노 근접 공격 적중률"
          }
        },
        "원시의 분노 근접 공격 적중률_최대": {
          $max: {
            $avg: "$rankplay.record.윈스턴.영웅별.원시의 분노 근접 공격 적중률"
          }
        },
        "게임당_근접 공격으로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.윈스턴.영웅별.근접 공격으로 처치",
              "$rankplay.record.윈스턴.게임.치른 게임"
            ]
          }
        },
        "게임당_근접 공격으로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.윈스턴.영웅별.근접 공격으로 처치",
                "$rankplay.record.윈스턴.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_근접 공격으로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.윈스턴.영웅별.근접 공격으로 처치",
                "$rankplay.record.윈스턴.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_막은 피해": {
          $avg: {
            $divide: [
              "$rankplay.record.윈스턴.영웅별.막은 피해",
              "$rankplay.record.윈스턴.게임.치른 게임"
            ]
          }
        },
        "게임당_막은 피해_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.윈스턴.영웅별.막은 피해",
                "$rankplay.record.윈스턴.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_막은 피해_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.윈스턴.영웅별.막은 피해",
                "$rankplay.record.윈스턴.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_밀쳐낸 플레이어": {
          $avg: {
            $divide: [
              "$rankplay.record.윈스턴.영웅별.밀쳐낸 플레이어",
              "$rankplay.record.윈스턴.게임.치른 게임"
            ]
          }
        },
        "게임당_밀쳐낸 플레이어_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.윈스턴.영웅별.밀쳐낸 플레이어",
                "$rankplay.record.윈스턴.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_밀쳐낸 플레이어_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.윈스턴.영웅별.밀쳐낸 플레이어",
                "$rankplay.record.윈스턴.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_원시의 분노로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.윈스턴.영웅별.원시의 분노로 처치",
              "$rankplay.record.윈스턴.게임.치른 게임"
            ]
          }
        },
        "게임당_원시의 분노로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.윈스턴.영웅별.원시의 분노로 처치",
                "$rankplay.record.윈스턴.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_원시의 분노로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.윈스턴.영웅별.원시의 분노로 처치",
                "$rankplay.record.윈스턴.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_점프 팩으로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.윈스턴.영웅별.점프 팩으로 처치",
              "$rankplay.record.윈스턴.게임.치른 게임"
            ]
          }
        },
        "게임당_점프 팩으로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.윈스턴.영웅별.점프 팩으로 처치",
                "$rankplay.record.윈스턴.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_점프 팩으로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.윈스턴.영웅별.점프 팩으로 처치",
                "$rankplay.record.윈스턴.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_무기로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.윈스턴.영웅별.무기로 처치",
              "$rankplay.record.윈스턴.게임.치른 게임"
            ]
          }
        },
        "게임당_무기로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.윈스턴.영웅별.무기로 처치",
                "$rankplay.record.윈스턴.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_무기로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.윈스턴.영웅별.무기로 처치",
                "$rankplay.record.윈스턴.게임.치른 게임"
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        "게임당_근접 공격으로 처치.avg": "$게임당_근접 공격으로 처치",
        "게임당_근접 공격으로 처치.min": "$게임당_근접 공격으로 처치_최소",
        "게임당_근접 공격으로 처치.max": "$게임당_근접 공격으로 처치_최대",

        "게임당_막은 피해.avg": "$게임당_막은 피해",
        "게임당_막은 피해.min": "$게임당_막은 피해_최소",
        "게임당_막은 피해.max": "$게임당_막은 피해_최대",

        "게임당_밀쳐낸 플레이어.avg": "$게임당_밀쳐낸 플레이어",
        "게임당_밀쳐낸 플레이어.min": "$게임당_밀쳐낸 플레이어_최소",
        "게임당_밀쳐낸 플레이어.max": "$게임당_밀쳐낸 플레이어_최대",

        "게임당_원시의 분노로 처치.avg": "$게임당_원시의 분노로 처치",
        "게임당_원시의 분노로 처치.min": "$게임당_원시의 분노로 처치_최소",
        "게임당_원시의 분노로 처치.max": "$게임당_원시의 분노로 처치_최대",

        "게임당_점프 팩으로 처치.avg": "$게임당_점프 팩으로 처치",
        "게임당_점프 팩으로 처치.min": "$게임당_점프 팩으로 처치_최소",
        "게임당_점프 팩으로 처치.max": "$게임당_점프 팩으로 처치_최대",

        "게임당_무기로 처치.avg": "$게임당_무기로 처치",
        "게임당_무기로 처치.min": "$게임당_무기로 처치_최소",
        "게임당_무기로 처치.max": "$게임당_무기로 처치_최대",

        "테슬라 캐논 적중률.avg": "$테슬라 캐논 적중률",
        "테슬라 캐논 적중률.min": "$테슬라 캐논 적중률_최소",
        "테슬라 캐논 적중률.max": "$테슬라 캐논 적중률_최대",

        "원시의 분노 근접 공격 적중률.avg": "$원시의 분노 근접 공격 적중률",
        "원시의 분노 근접 공격 적중률.min":
          "$원시의 분노 근접 공격 적중률_최소",
        "원시의 분노 근접 공격 적중률.max": "$원시의 분노 근접 공격 적중률_최대"
      }
    },
    {
      $project: {
        "게임당_근접 공격으로 처치": 1,
        "게임당_막은 피해": 1,
        "게임당_밀쳐낸 플레이어": 1,
        "게임당_원시의 분노로 처치": 1,
        "게임당_점프 팩으로 처치": 1,
        "게임당_무기로 처치": 1,
        "테슬라 캐논 적중률": 1,
        "원시의 분노 근접 공격 적중률": 1
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
