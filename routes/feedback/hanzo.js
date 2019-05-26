const express = require("express");
const router = express.Router();

router.get(`/${encodeURI("폭풍 화살로 처치")}/low`, (req, res, next) => {
  res.json({
    feedback: `한조는 다른 캐릭터와 달리 활을 통해 데미지를 입히는 딜러입니다. 
    기본적으로 화살의 탄속과 적의 움직임을 예측하면서 공격해야 하기 때문에 명중하기 어려운 
    부분이 많습니다. 그렇기 때문에 한조는 벽타기를 활용하여 고지대를 점령하고 측면을 통해 
    적에게 딜을 해야 명중률이 높아지죠. 정면에서는 탱커 싸움을 도와주고 측면과 고지대에서 
    힐러들과 딜러들을 공격한다면 명중률과 딜량이 더욱 상승할 수 있을 것입니다.`
  });
});

router.get(`/${encodeURI("용의 일격으로 처치")}/low`, (req, res, next) => {
  res.json({
    feedback: `용의 일격은 자리야의 중력자탄과 연계하는 것이 가장 좋습니다. 
    또한 적과 가깝지만 엄폐할 수 있는 벽에서 용의 일격을 쓴다면 더 많은 적들을 킬할 수 
    있을 것입니다.`
  });
});

module.exports = router;
