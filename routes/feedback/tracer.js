const express = require("express");
const router = express.Router();

router.get(`/${encodeURI("생명력 회복")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 시간역행을 통한 생명력 회복 수치가 낮은 편입니다. 
    한타 구도에서 시간역행을 쓰지 못하고 죽는 경우가 많다는 것으로 분석됨으로 
    측면 플레이를 권장합니다.`
  });
});

/*router.get(`/${encodeURI("생명력 회복")}/middle`, (req, res, next) => {
  res.json({
    feedback: ``
  });
});

router.get(`/${encodeURI("생명력 회복")}/high`, (req, res, next) => {
  res.json({
    feedback: ``
  });
});*/

module.exports = router;
