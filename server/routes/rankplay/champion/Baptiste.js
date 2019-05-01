const express = require("express");
const router = express.Router();
const User = require("../../../models/user");

/* 바티스트 영웅별 스키마
"영웅별": 
{
"공격력 증폭": 32638,
"공격력 증폭 - 10분당 평균": 1.08,
"공격력 증폭 - 한 게임 최고기록": 1926,
"보조 발사 적중률": 29,
"불사 장치로 사망 저지": 152,
"불사 장치로 사망 저지 - 10분당 평균": 0.01,
"불사 장치로 사망 저지 - 한 게임 최고기록": 12,
"자가 치유": 51033,
"자가 치유 - 10분당 평균": 1.69,
"자가 치유 - 한 게임 최고기록": 2123,
"증폭 매트릭스 도움": 126,
"증폭 매트릭스 도움 - 10분당 평균": 0,
"증폭 매트릭스 도움 - 한 게임 최고기록": 6,
"증폭 매트릭스 사용": 238,
"증폭 매트릭스 사용 - 10분당 평균": 0.01,
"증폭 매트릭스 사용 - 한 게임 최고기록": 12,
"치유 명중률": 62,
"치유 명중률 - 한 게임 최고기록": 90,
"치유 증폭": 3385,
"치유 증폭 - 10분당 평균": 0.11,
"치유 증폭 - 한 게임 최고기록": 383
}
*/

// path: /avg/rankplay/champion/바티스트
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
        "rankplay.record.바티스트.영웅별": 1,
        "rankplay.record.바티스트.게임": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max },
        "rankplay.record.바티스트.게임.치른 게임": { $gt: 9 }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        /*'공격력 증폭': {
                    $avg: '$rankplay.record.바티스트.영웅별.공격력 증폭'
                },
                '공격력 증폭 - 10분당 평균': {
                    $avg: '$rankplay.record.바티스트.영웅별.공격력 증폭 - 10분당 평균'
                },
                '공격력 증폭 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.바티스트.영웅별.공격력 증폭 - 한 게임 최고기록'
                },
                '보조 발사 적중률': {
                    $avg: '$rankplay.record.바티스트.영웅별.보조 발사 적중률'
                },
                '불사 장치로 사망 저지': {
                    $avg: '$rankplay.record.바티스트.영웅별.불사 장치로 사망 저지'
                },
                '불사 장치로 사망 저지 - 10분당 평균': {
                    $avg: '$rankplay.record.바티스트.영웅별.불사 장치로 사망 저지 - 10분당 평균'
                },
                '불사 장치로 사망 저지 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.바티스트.영웅별.불사 장치로 사망 저지 - 한 게임 최고기록'
                },
                '자가 치유': {
                    $avg: '$rankplay.record.바티스트.영웅별.자가 치유'
                },
                '자가 치유 - 10분당 평균': {
                    $avg: '$rankplay.record.바티스트.영웅별.자가 치유 - 10분당 평균'
                },
                '자가 치유 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.바티스트.영웅별.자가 치유 - 한 게임 최고기록'
                },
                '증폭 매트릭스 도움': {
                    $avg: '$rankplay.record.바티스트.영웅별.증폭 매트릭스 도움'
                },
                '증폭 매트릭스 도움 - 10분당 평균': {
                    $avg: '$rankplay.record.바티스트.영웅별.증폭 매트릭스 도움 - 10분당 평균'
                },
                '증폭 매트릭스 도움 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.바티스트.영웅별.증폭 매트릭스 도움 - 한 게임 최고기록'
                },
                '증폭 매트릭스 사용': {
                    $avg: '$rankplay.record.바티스트.영웅별.증폭 매트릭스 사용'
                },
                '증폭 매트릭스 사용 - 10분당 평균': {
                    $avg: '$rankplay.record.바티스트.영웅별.증폭 매트릭스 사용 - 10분당 평균'
                },
                '증폭 매트릭스 사용 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.바티스트.영웅별.증폭 매트릭스 사용 - 한 게임 최고기록'
                },
                '치유 명중률': {
                    $avg: '$rankplay.record.바티스트.영웅별.치유 명중률'
                },
                '치유 명중률 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.바티스트.영웅별.치유 명중률 - 한 게임 최고기록'
                },
                '치유 증폭': {
                    $avg: '$rankplay.record.바티스트.영웅별.치유 증폭'
                },
                '치유 증폭 - 10분당 평균': {
                    $avg: '$rankplay.record.바티스트.영웅별.치유 증폭 - 10분당 평균'
                },
                '치유 증폭 - 한 게임 최고기록': {
                    $avg: '$rankplay.record.바티스트.영웅별.치유 증폭 - 한 게임 최고기록'
                },*/

        "보조 발사 적중률": {
          $avg: "$rankplay.record.바티스트.영웅별.보조 발사 적중률"
        },
        "보조 발사 적중률_최소": {
          $min: {
            $avg: "$rankplay.record.바티스트.영웅별.보조 발사 적중률"
          }
        },
        "보조 발사 적중률_최대": {
          $max: {
            $avg: "$rankplay.record.바티스트.영웅별.보조 발사 적중률"
          }
        },
        "게임당_공격력 증폭": {
          $avg: {
            $divide: [
              "$rankplay.record.바티스트.영웅별.공격력 증폭",
              "$rankplay.record.바티스트.게임.치른 게임"
            ]
          }
        },
        "게임당_공격력 증폭_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.바티스트.영웅별.공격력 증폭",
                "$rankplay.record.바티스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_공격력 증폭_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.바티스트.영웅별.공격력 증폭",
                "$rankplay.record.바티스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_불사 장치로 사망 저지": {
          $avg: {
            $divide: [
              "$rankplay.record.바티스트.영웅별.불사 장치로 사망 저지",
              "$rankplay.record.바티스트.게임.치른 게임"
            ]
          }
        },
        "게임당_불사 장치로 사망 저지_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.바티스트.영웅별.불사 장치로 사망 저지",
                "$rankplay.record.바티스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_불사 장치로 사망 저지_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.바티스트.영웅별.불사 장치로 사망 저지",
                "$rankplay.record.바티스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자가 치유": {
          $avg: {
            $divide: [
              "$rankplay.record.바티스트.영웅별.자가 치유",
              "$rankplay.record.바티스트.게임.치른 게임"
            ]
          }
        },
        "게임당_자가 치유_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.바티스트.영웅별.자가 치유",
                "$rankplay.record.바티스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_자가 치유_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.바티스트.영웅별.자가 치유",
                "$rankplay.record.바티스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_증폭 매트릭스 도움": {
          $avg: {
            $divide: [
              "$rankplay.record.바티스트.영웅별.증폭 매트릭스 도움",
              "$rankplay.record.바티스트.게임.치른 게임"
            ]
          }
        },
        "게임당_증폭 매트릭스 도움_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.바티스트.영웅별.증폭 매트릭스 도움",
                "$rankplay.record.바티스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_증폭 매트릭스 도움_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.바티스트.영웅별.증폭 매트릭스 도움",
                "$rankplay.record.바티스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_증폭 매트릭스 사용": {
          $avg: {
            $divide: [
              "$rankplay.record.바티스트.영웅별.증폭 매트릭스 사용",
              "$rankplay.record.바티스트.게임.치른 게임"
            ]
          }
        },
        "게임당_증폭 매트릭스 사용_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.바티스트.영웅별.증폭 매트릭스 사용",
                "$rankplay.record.바티스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_증폭 매트릭스 사용_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.바티스트.영웅별.증폭 매트릭스 사용",
                "$rankplay.record.바티스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_치유 증폭": {
          $avg: {
            $divide: [
              "$rankplay.record.바티스트.영웅별.치유 증폭",
              "$rankplay.record.바티스트.게임.치른 게임"
            ]
          }
        },
        "게임당_치유 증폭_최소": {
          $min: {
            $avg: {
              $divide: [
                "$rankplay.record.바티스트.영웅별.치유 증폭",
                "$rankplay.record.바티스트.게임.치른 게임"
              ]
            }
          }
        },
        "게임당_치유 증폭_최대": {
          $max: {
            $avg: {
              $divide: [
                "$rankplay.record.바티스트.영웅별.치유 증폭",
                "$rankplay.record.바티스트.게임.치른 게임"
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

        "게임당_불사 장치로 사망 저지.avg": "$게임당_불사 장치로 사망 저지",
        "게임당_불사 장치로 사망 저지.min":
          "$게임당_불사 장치로 사망 저지_최소",
        "게임당_불사 장치로 사망 저지.max":
          "$게임당_불사 장치로 사망 저지_최대",

        "게임당_자가 치유.avg": "$게임당_자가 치유",
        "게임당_자가 치유.min": "$게임당_자가 치유_최소",
        "게임당_자가 치유.max": "$게임당_자가 치유_최대",

        "게임당_증폭 매트릭스 도움.avg": "$게임당_증폭 매트릭스 도움",
        "게임당_증폭 매트릭스 도움.min": "$게임당_증폭 매트릭스 도움_최소",
        "게임당_증폭 매트릭스 도움.max": "$게임당_증폭 매트릭스 도움_최대",

        "게임당_증폭 매트릭스 사용.avg": "$게임당_증폭 매트릭스 사용",
        "게임당_증폭 매트릭스 사용.min": "$게임당_증폭 매트릭스 사용_최소",
        "게임당_증폭 매트릭스 사용.max": "$게임당_증폭 매트릭스 사용_최대",

        "게임당_치유 증폭.avg": "$게임당_치유 증폭",
        "게임당_치유 증폭.min": "$게임당_치유 증폭_최소",
        "게임당_치유 증폭.max": "$게임당_치유 증폭_최대",

        "보조 발사 적중률.avg": "$보조 발사 적중률",
        "보조 발사 적중률.min": "$보조 발사 적중률_최소",
        "보조 발사 적중률.max": "$보조 발사 적중률_최대"
      }
    },
    {
      $project: {
        "게임당_공격력 증폭": 1,
        "게임당_불사 장치로 사망 저지": 1,
        "게임당_자가 치유": 1,
        "게임당_증폭 매트릭스 도움": 1,
        "게임당_증폭 매트릭스 사용": 1,
        "게임당_치유 증폭": 1,
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
