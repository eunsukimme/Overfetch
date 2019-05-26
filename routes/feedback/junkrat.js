const express = require("express");
const router = express.Router();

router.get(`/${encodeURI("죽이는 타이어로 처치")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 죽이는 타이어 처치 수는 적은 편입니다. 죽이는 타이어를 안전한 위치에서 사용했을 때 적들이 반응할 확률이 높아집니다. 하이리스크 하이리턴 의 플레이를 하는 것이 중요합니다. 맵의 구석진 곳에 은폐해서 적과 위치가 가까워졌을 때 활용해보세요! 조금 더 많은 킬을 낼 수 있을 것입니다!`
  });
});

/*router.get(`/${encodeURI("죽이는 타이어로 처치")}/middle`, (req, res, next) => {
  res.json({
    feedback: ``
  });
});

router.get(`/${encodeURI("죽이는 타이어로 처치")}/high`, (req, res, next) => {
  res.json({
    feedback: ``
  });
});*/

router.get(`/${encodeURI("충격 지뢰로 처치")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 충격 지뢰로 처치한 적의 수는 평균보다 낮은 편입니다. 
    충격 지뢰는 생존성과 딜량 모두를 챙길 수 있는 스킬입니다. K/D가 낮으시다면 덫과의 연계보다 충격 지뢰를 생존용으로 활용하세요. 
    안정적인 포지션을 통해 쉴새없이 몰아치는 기본공격을 통해 죽이는 타이어를 최대한 빠르게 모으세요!
    덫과 충격 지뢰의 콤보를 활용하세요. 충격 지뢰는 최대 2개까지 충전할 수 있기 때문에 하나는 생존용으로 활용하면서 조금 더 과감하게 플레이하셔도 좋습니다.`
  });
});

module.exports = router;
