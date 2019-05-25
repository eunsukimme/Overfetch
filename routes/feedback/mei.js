const express = require("express");
const router = express.Router();

// path: /feedback/메이
// 고드름 명중률
router.get(`/${encodeURI("보조 발사 적중률")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 고드름 명중률은 비슷한 다른 플레이어의 평균보다 떨어지는 편입니다.
  단거리에서 얼린 적이 아닌 이상, 치명타 명중이 발생하는 경우가 손에 꼽고, 그냥 명중 하는 빈도도 상당히 떨어집니다. 에임을 꾸준히 단련하여, 좋은 기록을 갖을 수 있
  게끔 틈틈히 단련이 필요합니다. 다른 영웅과 다른 메이만의 탄환에 익숙해지려고 의식하는 것이 가장 메이의 고드름 숙련에 있어 가장 중요한 것이 아닌가 생각을 하구요,
  당장에 활약이 어렵다 싶으시다면, 맵에 대한 이해도를 높여 게릴라 위주의 플레이를 해보시는 것 또한 권장드리고 싶습니다.`
  });
});

router.get(`/${encodeURI("보조 발사 적중률")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님의 고드름 명중률은 비슷한 다른 플레이어의 평균치와 차이가 거의 없습니다.
  단거리 혹은 중거리 교전에서의 명중률은 어느 정도 보장이 되지만, 장거리 교전에 들어서면 힘이 쭉 빠지지는 않으신지 생각해봅니다. 메이의 고드름 투사체는
  타 딜러들과는 약간 다른 궤도, 발사 속도를 갖고 있습니다. 메이를 진지하게 긴 시간 동안 파시길 원한다면, 이러한 점에 대한 연구를 통해, 조금 더 다양한 상황에 대비
  할 수 있는 능력을 키워야 한다고 생각합니다.`
  });
});

router.get(`/${encodeURI("보조 발사 적중률")}/high`, (req, res, next) => {
  res.json({
    feedback: `님의 고드름 명중률은 다른 비슷한 플레이어들보다 높습니다.
  메이의 핵심 딜 기술인 고드름의 투사체 및 에임에 대한 이해도가 높은 유저일 것으로 생각이 됩니다. 중장거리 교전은 물론이고 근접한 적 또한 빠르게 무력화
  시킬 수 있는 능력을 갖고 있을 것으로 예상됩니다. 하지만 높은 명중률에 비하여, kd와 딜량이 떨어진다면 포지션을 지나치게 앞 쪽에 잡지는 않는지, 얼음 방패를 너무
  섣부르게, 혹은 너무 아끼지는 않는지 생각해보시고, 조금 더 생존에 힘을 싣는 플레이를 추구 하시는 것이 더 낫지 않을까 생각해봅니다.`
  });
});

router.get(`/${encodeURI("얼린 적")}/low`, (req, res, next) => {
  res.json({
    feedback: `님이 얼린 적은 다른 비슷한 플레이어들보다 적습니다.
    플레이가 지나치게 소극적이거나 지나치게 무모하며, 메이를 잘 활용하고 있다는 느낌이 들지 않습니다. 메이에 대한 기본기를 우선 공부하셔야 할 것 같습니다. 메이를 다루는 많은
    스킬들이 있지만 그 중 가장 흔한 것은 측면에서 적을 얼리고 빠르게 소수 인원을 제거한 뒤, 자신은 방벽과 얼음방패로 살아나가는 전술입니다. 지나친 욕심은 접어두고 위 사이클로 
    한명만 전장에서 이탈 시키겠다는 마인드로 게임을 진행해 보시다가 어느 정도 숙련도가 쌓인다면, 그 때부터 다양한 전술을 구사해보는 것이 좋을 것 같습니다.`
  });
});

router.get(`/${encodeURI("얼린 적")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님이 얼린 적은 다른 비슷한 플레이어들과 비슷합니다.
    메이코패스라고 부르기엔 다소 치사율이 떨어지는 것 같습니다. 메이는 좁은 지형에서의 소규모 교전에선 강하지만, 그렇지 않은 지역에선 다소 위력이 반감되는 경향이 있습니다.
    그렇기에 메이가 충분히 활약하기 위해선, 어느 정도 라인을 민 뒤엔 적극적인 소수 인원 자르기에 기여를 해야합니다. 그렇다면 마땅히 적진에 근접하는 위험을 어느정도는 감수해야
    하고, 그 리스크를 최소화하기 위한 솔루션이 필요합니다. 사운드 플레이를 연습하기, 빙벽을 이용해 이동할 수 있는 지형과, 많은 퇴로 파악하기가 그를 위한 좋은 방법이 될
    것이라고 생각합니다.`
  });
});

router.get(`/${encodeURI("얼린 적")}/high`, (req, res, next) => {
  res.json({
    feedback: `님이 얼린 적은 다른 비슷한 플레이어들보다 많습니다.
    아군 진영으로 파고드는 적에 대한 반응 속도가 빠르며, 적의 루트를 예측할 수 있고, 맵에 대한 이해도가 상당하실 것으로 추측이 됩니다. 일반 공격으로 얼린 적은 물론이며, 궁극기를
    통해서도 상대를 무력화 시키는데 큰 기여를 할 수 있는 실력을 갖고 계십니다. 충분히 잘하고 계시지만, 여기서 조금 더 메이의 성능을 극대화 시키기 위해선, 팀원의 도움이 필요하
    다는 점을 이미 잘 알고 계실 것 같습니다. 틈틈히 궁극기 여부와 여러가지 의사소통 수단을 이용해 아군과 소통하여, 적에게 큰 피해를 줄 수 있게끔 한다면, 지금보다 님의 
    포텐셜이 더욱 커질 것 이라고 감히 예상해봅니다.`
  });
});

module.exports = router;
