const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* 레킹볼 영웅별 스키마
"영웅별": 
{
// 추가된 것
"갈고리 고정으로 처치"	17
"갈고리 고정으로 처치 - 10분당 평균":	2.49
"갈고리 고정으로 처치 - 한 게임 최고기록":	4

"밀쳐낸 플레이어": 1762,
"밀쳐낸 플레이어 - 10분당 평균": 0.09,
"밀쳐낸 플레이어 - 한 게임 최고기록": 104,

// 추가된 것
"지뢰밭으로 처치"	5
"지뢰밭으로 처치 - 10분당 평균":	0.73
"지뢰밭으로 처치 - 한 게임 최고기록":	2
"파일드라이버로 처치"	11
"파일드라이버로 처치 - 10분당 평균":	1.61
"파일드라이버로 처치 - 한 게임 최고기록":	2
}
*/

// path: /avg/rankplay/champion/레킹볼
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
        "rankplay.record.레킹볼.영웅별": 1,
        "rankplay.record.레킹볼.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.레킹볼.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        "밀쳐낸 플레이어": {
          $avg: "$rankplay.record.레킹볼.영웅별.밀쳐낸 플레이어"
        },
        "밀쳐낸 플레이어 - 10분당 평균": {
          $avg: "$rankplay.record.레킹볼.영웅별.밀쳐낸 플레이어 - 10분당 평균"
        },
        "밀쳐낸 플레이어 - 한 게임 최고기록": {
          $avg:
            "$rankplay.record.레킹볼.영웅별.밀쳐낸 플레이어 - 한 게임 최고기록"
        },

        "게임당_밀쳐낸 플레이어": {
          $avg: {
            $divide: [
              "$rankplay.record.레킹볼.영웅별.밀쳐낸 플레이어",
              "$rankplay.record.레킹볼.게임.치른 게임"
            ]
          }
        },
        "게임당_밀쳐낸 플레이어_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.레킹볼.영웅별.밀쳐낸 플레이어",
                "$rankplay.record.레킹볼.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_밀쳐낸 플레이어_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.레킹볼.영웅별.밀쳐낸 플레이어",
                "$rankplay.record.레킹볼.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_갈고리 고정으로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.레킹볼.영웅별.갈고리 고정으로 처치",
              "$rankplay.record.레킹볼.게임.치른 게임"
            ]
          }
        },
        "게임당_갈고리 고정으로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.레킹볼.영웅별.갈고리 고정으로 처치",
                "$rankplay.record.레킹볼.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_갈고리 고정으로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.레킹볼.영웅별.갈고리 고정으로 처치",
                "$rankplay.record.레킹볼.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_지뢰밭으로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.레킹볼.영웅별.지뢰밭으로 처치",
              "$rankplay.record.레킹볼.게임.치른 게임"
            ]
          }
        },
        "게임당_지뢰밭으로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.레킹볼.영웅별.지뢰밭으로 처치",
                "$rankplay.record.레킹볼.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_지뢰밭으로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.레킹볼.영웅별.지뢰밭으로 처치",
                "$rankplay.record.레킹볼.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_파일드라이버로 처치": {
          $avg: {
            $divide: [
              "$rankplay.record.레킹볼.영웅별.파일드라이버로 처치",
              "$rankplay.record.레킹볼.게임.치른 게임"
            ]
          }
        },
        "게임당_파일드라이버로 처치_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.레킹볼.영웅별.파일드라이버로 처치",
                "$rankplay.record.레킹볼.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_파일드라이버로 처치_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.레킹볼.영웅별.파일드라이버로 처치",
                "$rankplay.record.레킹볼.게임.치른 게임"
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        "게임당_밀쳐낸 플레이어.avg": "$게임당_밀쳐낸 플레이어",
        "게임당_밀쳐낸 플레이어.min": "$게임당_밀쳐낸 플레이어_최소",
        "게임당_밀쳐낸 플레이어.max": "$게임당_밀쳐낸 플레이어_최대",

        "게임당_갈고리 고정으로 처치.avg": "$게임당_갈고리 고정으로 처치",
        "게임당_갈고리 고정으로 처치.min": "$게임당_갈고리 고정으로 처치_최소",
        "게임당_갈고리 고정으로 처치.max": "$게임당_갈고리 고정으로 처치_최대",

        "게임당_지뢰밭으로 처치.avg": "$게임당_지뢰밭으로 처치",
        "게임당_지뢰밭으로 처치.min": "$게임당_지뢰밭으로 처치_최소",
        "게임당_지뢰밭으로 처치.max": "$게임당_지뢰밭으로 처치_최대",

        "게임당_파일드라이버로 처치.avg": "$게임당_파일드라이버로 처치",
        "게임당_파일드라이버로 처치.min": "$게임당_파일드라이버로 처치_최소",
        "게임당_파일드라이버로 처치.max": "$게임당_파일드라이버로 처치_최대"
      }
    },
    {
      $project: {
        "게임당_밀쳐낸 플레이어": 1,
        "게임당_갈고리 고정으로 처치": 1,
        "게임당_지뢰밭으로 처치": 1,
        "게임당_파일드라이버로 처치": 1
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
