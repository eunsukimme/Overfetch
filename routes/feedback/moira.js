const express = require("express");
const router = express.Router();

router.get(`/${encodeURI("자가 치유")}/low`, (req, res, next) => {
  res.json({
    feedback: `님이 자가 치유한 양은 평균보다 낮습니다. 
    모이라의 힐은 게이지가 정해져 있기 때문에 이 부분을 인지하지 않으면 한타 때 힐을 
    하지 못하는 경우가 생깁니다. 또한 힐보다 딜에 집중하여 평균 힐량이 낮은 경우가 
    많은데요. 생체 구슬 역시 부패(딜)보다 재생(힐)에 집중하는 것이 좋습니다!`
  });
});

router.get(`/${encodeURI("융화로 치유")}/low`, (req, res, next) => {
  res.json({
    feedback: `님, 모이라의 궁극기는 다른 캐릭터보다 빠르게 채울 수 있다는 것이 장점입니다. 
    그러나 융화를 사용할 때 다른 스킬을 사용하지 못한다는 점과 모이라의 위치가 노출된다는 
    문제 때문에 융화가 끝나기도 전에 사망하는 경우가 많습니다. 아군과 적군에게 딜과 힐을 
    전부 하려다가 이런 불상사가 발생할 수 있으니 아군에게 우선적으로 사용합시다.`
  });
});

module.exports = router;
