const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const championRouter = require("./championRoute");

router.use("/champion", championRouter);

// path: /avg/rankplay
router.get("/win_rate", (req, res, next) => {
  const tier = req.query.tier;
  console.log(tier);
  let min, max;
  {
    if (tier == "bronze") {
      min = 500;
      max = 1500;
    } else if (tier == "silver") {
      min = 1500;
      max = 2000;
    } else if (tier == "gold") {
      min = 2000;
      max = 2500;
    } else if (tier == "platinum") {
      min = 2500;
      max = 3000;
    } else if (tier == "diamond") {
      min = 3000;
      max = 3500;
    } else if (tier == "master") {
      min = 3500;
      max = 4000;
    } else if (tier == "grand_master") {
      min = 4000;
      max = 5000;
    } else if (tier == "alltier") {
      min = 0;
      max = 5000;
    } else {
      return res
        .status(400)
        .json({ error: "잘못된 파라미터로 요청하였습니다" });
    }
  }
  let aggregation = User.aggregate([
    {
      $project: {
        rank: 1,
        "rankplay.record.D-Va.게임.승률": 1,
        "rankplay.record.겐지.게임.승률": 1,
        "rankplay.record.둠피스트.게임.승률": 1,
        "rankplay.record.라인하르트.게임.승률": 1,
        "rankplay.record.레킹볼.게임.승률": 1,
        "rankplay.record.로드호그.게임.승률": 1,
        "rankplay.record.루시우.게임.승률": 1,
        "rankplay.record.리퍼.게임.승률": 1,
        "rankplay.record.맥크리.게임.승률": 1,
        "rankplay.record.메르시.게임.승률": 1,
        "rankplay.record.메이.게임.승률": 1,
        "rankplay.record.모이라.게임.승률": 1,
        "rankplay.record.바스티온.게임.승률": 1,
        "rankplay.record.바티스트.게임.승률": 1,
        "rankplay.record.브리기테.게임.승률": 1,
        "rankplay.record.솔저.게임.승률": 1,
        "rankplay.record.솜브라.게임.승률": 1,
        "rankplay.record.시메트라.게임.승률": 1,
        "rankplay.record.아나.게임.승률": 1,
        "rankplay.record.애쉬.게임.승률": 1,
        "rankplay.record.오리사.게임.승률": 1,
        "rankplay.record.위도우메이커.게임.승률": 1,
        "rankplay.record.윈스턴.게임.승률": 1,
        "rankplay.record.자리야.게임.승률": 1,
        "rankplay.record.젠야타.게임.승률": 1,
        "rankplay.record.토르비욘.게임.승률": 1,
        "rankplay.record.트레이서.게임.승률": 1,
        "rankplay.record.파라.게임.승률": 1,
        "rankplay.record.한조.게임.승률": 1
      }
    },
    {
      $match: {
        "rank.val": { $gte: min, $lt: max }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1
        },
        "D-Va": {
          $avg: "$rankplay.record.D-Va.게임.승률"
        },
        겐지: {
          $avg: "$rankplay.record.겐지.게임.승률"
        },
        둠피스트: {
          $avg: "$rankplay.record.둠피스트.게임.승률"
        },
        라인하르트: {
          $avg: "$rankplay.record.라인하르트.게임.승률"
        },
        레킹볼: {
          $avg: "$rankplay.record.레킹볼.게임.승률"
        },
        로드호그: {
          $avg: "$rankplay.record.로드호그.게임.승률"
        },
        루시우: {
          $avg: "$rankplay.record.루시우.게임.승률"
        },
        리퍼: {
          $avg: "$rankplay.record.리퍼.게임.승률"
        },
        맥크리: {
          $avg: "$rankplay.record.맥크리.게임.승률"
        },
        메르시: {
          $avg: "$rankplay.record.메르시.게임.승률"
        },
        메이: {
          $avg: "$rankplay.record.메이.게임.승률"
        },
        모이라: {
          $avg: "$rankplay.record.모이라.게임.승률"
        },
        바스티온: {
          $avg: "$rankplay.record.바스티온.게임.승률"
        },
        바티스트: {
          $avg: "$rankplay.record.바티스트.게임.승률"
        },
        브리기테: {
          $avg: "$rankplay.record.브리기테.게임.승률"
        },
        솔저: {
          $avg: "$rankplay.record.솔저.게임.승률"
        },
        솜브라: {
          $avg: "$rankplay.record.솜브라.게임.승률"
        },
        시메트라: {
          $avg: "$rankplay.record.시메트라.게임.승률"
        },
        아나: {
          $avg: "$rankplay.record.아나.게임.승률"
        },
        애쉬: {
          $avg: "$rankplay.record.애쉬.게임.승률"
        },
        오리사: {
          $avg: "$rankplay.record.오리사.게임.승률"
        },
        위도우메이커: {
          $avg: "$rankplay.record.위도우메이커.게임.승률"
        },
        윈스턴: {
          $avg: "$rankplay.record.윈스턴.게임.승률"
        },
        자리야: {
          $avg: "$rankplay.record.자리야.게임.승률"
        },
        젠야타: {
          $avg: "$rankplay.record.젠야타.게임.승률"
        },
        토르비욘: {
          $avg: "$rankplay.record.토르비욘.게임.승률"
        },
        트레이서: {
          $avg: "$rankplay.record.트레이서.게임.승률"
        },
        파라: {
          $avg: "$rankplay.record.파라.게임.승률"
        },
        한조: {
          $avg: "$rankplay.record.한조.게임.승률"
        }
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
