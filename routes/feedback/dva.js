const express = require("express");
const router = express.Router();

router.get(`/${encodeURI("막은 피해")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 매트릭스로 막아낸 피해는 다른 플레이어에 비해 현저히 떨어집니다.
    기본적으로, 디바가 돌격영웅으로 윈스턴과 함께 애용되긴 하나, 적진에 침투하여 상대 진영을
    확실히 흔들긴 위해선, 일부 피해를 매트릭스로 흡수하는 플레이가 필수불가결 합니다.
    혹여, 적진에 진입하고 순식간에 파괴되는 메카를 보고 마음 아파하진 않으셨는지요?
    비록, 다소 너프가 되긴 했지만, 매트릭스는 디바의 가장 핵심적인 스킬로, 조금 더 의식하고 사용하신다면
    보다 나은 결과가 따를 것으로 예상이 됩니다.`
  });
});

router.get(`/${encodeURI("막은 피해")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님의 매트릭스로 막아낸 피해는 다른 플레이어의 평균에 근접합니다.
    맵에 대한 이해도를 키워, 특정 딜러들이 자주 서는 위치를 중점적으로 매트릭스를 전개하여
    상대 딜러를 견제하고, 파라, 위도우메이커 등 한발 한발의 데미지가 강력한 탄환을 위주로 막는 등의 플레이를 통해 
    아군, 그리고 자신을 보호한다면 보다 나은 플레이가 될 것이라고 점쳐봅니다.`
  });
});

router.get(`/${encodeURI("막은 피해")}/high`, (req, res, next) => {
  res.json({
    feedback: `님의 매트릭스로 막아낸 피해는 다른 플레이어의 평균 수치보다 높습니다.
    순수하게 많은 피해량을 막아내는 능력은 이미 검증이 되었으니, 상대의 궁극기 타이밍을
    예측하여, 매트릭스를 어느정도 아끼는 등 좀 더 타 챔피언에 대한 이해도를 키우신다면, 
    조금 더 극적인 활약을 기대 할 수 있을 것이라고 예상됩니다.`
  });
});

router.get(`/${encodeURI("자폭으로 처치")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기로 처치한 적의 수는 다른 플레이어에 비해 현저히 떨어집니다.
    혹시, 메카가 파괴되자마자, 새로운 메카 호출을 위해 급하게 자폭을 누르시진 않나요? 개활지에서 모두가 대처할
    수 있는 방향으로 메카를 날리시진 않으시나요? 님의 플레이에서 가장 시급한 것은 아무래도, 인내심이 아닐까
    생각이 해봅니다. 디바의 자폭은 굉장히 위협적인 스킬임에는 분명하지만, 어떻게 활용하느냐에 따라 그 성능이 천차만별
    로 달라지는 스킬입니다. 기본적인 디바에 대한 이해도 또한 중요하지만, 좀 더 사려하여 궁극기를 활용하시면 좋을 것 
    같습니다.`
  });
});

router.get(`/${encodeURI("자폭으로 처치")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기로 처치한 적의 수는 다른 플레이어의 평균에 근접합니다.
    흔히 말하는 궁각을 어느정도 알고 있는 플레이어일 것이라고 예상됩니다. 하지만, 비슷한 플레이어 중에서
    최고라고 부르기엔 다소 무리가 있는데요, 저희는 님을 최고로 만들기 위해, 두가지 플레이를 제시하고자 합니다.
    첫째, 궁극기를 빨리 채우기 위한, 에임 개선 및 침투 타이밍 계산을 연습하실 것을 제의해봅니다.
    둘째, 맵에 대한 이해도를 조금 더 키워, 예상치 못한 곳에서의 한방을 노려보실 것을 제의해봅니다.`
  });
});

router.get(`/${encodeURI("자폭으로 처치")}/high`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기로 처치한 적의 수는 다른 플레이어의 평균보다 높습니다.
    맵에 대한 이해도가 전반적으로 높고, 에임이나, 특수 탄환 적중 및 전반적인 활약 또한 평균보다
    높아, 궁극기를 다른 플레이어보다 빨리 채울 수 있었을 것이라고 생각이 듭니다. 여러차례 potg를
    얻으며, 결정적인 한타의 끝을 장식했을 것이라고 믿어 의심치 않습니다.`
  });
});

module.exports = router;