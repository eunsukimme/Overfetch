const express = require("express");
const router = express.Router();

router.get(`/${encodeURI("저격 치명타")}/low`, (req, res, next) => {
  res.json({
    feedback: `님, 생각보다 저격의 명중률이 낮다면 노줌으로 애쉬를 플레이 해보세요! 애쉬의 노줌은 공격력과 연사력이 매우 좋습니다.`
  });
});

/*router.get(`/${encodeURI("저격 치명타")}/middle`, (req, res, next) => {
  res.json({
    feedback: ``
  });
});

router.get(`/${encodeURI("저격 치명타")}/high`, (req, res, next) => {
  res.json({
    feedback: ``
  });
});*/

router.get(`/${encodeURI("다이너마이트로 처치")}/low`, (req, res, next) => {
  res.json({
    feedback: `님, 애쉬의 다이너마이트는 총 170의 화력을 자랑하는 핵심적인 스킬입니다. 평타뿐만 아니라 다이너마이트를 최대한 많은 적에게 터뜨리면서 궁극기 자원을 빠르게 모으는 것이 핵심입니다.`
  });
});

/*router.get(`/${encodeURI("다이너마이트로 처치")}/middle`, (req, res, next) => {
  res.json({
    feedback: ``
  });
});

router.get(`/${encodeURI("다이너마이트로 처치")}/high`, (req, res, next) => {
  res.json({
    feedback: ``
  });
});*/

router.get(`/${encodeURI("밥으로 처치")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 밥으로 처치한 적의 수는 낮은 편입니다. 적군들이 반응하기 어렵게 측면에서 활용하거나 거점, 화물에서 버티는 적들에게 사용하면 킬 캐치력이 조금 더 올라갈 것입니다.`
  });
});

module.exports = router;
