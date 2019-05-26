const express = require("express");
const router = express.Router();

router.get(`/${encodeURI("부활한 플레이어")}/low`, (req, res, next) => {
  res.json({
    feedback: `님이 부활시킨 플레이어 수는 평균보다 낮습니다. 
    기본적으로 난전 상황에서 부활을 하는 것은 매우 위험한 행동입니다. 하지만 주변 엄폐물이
     있거나 아군이 님을 지킬 수 있다고 판단될 경우 부활을 사용해야 합니다. 현재 부활을 
     사용하는 횟수가 평균보다 작으므로 아군을 살려 한타 때 최대한 수적으로 유리한 상황을
      만드셔야 합니다.`
  });
});

module.exports = router;
