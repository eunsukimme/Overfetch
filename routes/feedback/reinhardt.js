const express = require("express");
const router = express.Router();

router.get(`/${encodeURI("막은 피해")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 막은 피해는 비슷한 플레이어의 평균에 못미치는 수치입니다.
    님은 라인하르트로 지나치게 공격적인 플레이를 하시지 않나 하는 생각이 듭니다. 방벽이 최대로 충전되어있음에도 불구하고, 눈앞의 적을 잡기 위해
    무작정 돌진부터 누르진 않으시나요? 라인하르트의 핵심은 방벽을 통해 아군을 보호하고, 임무에 기여하는 것이라고 생각합니다.
    조금 더 개인을 위한 플레이보다는 팀을 위한 플레이에 기여해주시면 좋겠습니다.`
  });
});

router.get(`/${encodeURI("막은 피해")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님의 막은 피해는 비슷한 플레이어의 평균과 비슷한 정도입니다.
    혹시 방벽이 파괴되기 직전임에도, 최전선에서 피해를 막고 있진 않나요? 라인하르트가 구성된 팀은, 라인
    하르트가 사망할 시, 상당히 힘이 빠지기 마련입니다. 방벽이 파괴되기 직전이라면 어느정도 뒤로 빼며,
    힐러의 케어를 받고, 잠시간의 재정비 시간을 갖도록 해보는 게 좋을 것 같습니다. 탱커라고 무조건 맞는게
    능사는 아닙니다. 조금 더 생존을 염두에 두시면 좋겠습니다.`
  });
});

router.get(`/${encodeURI("막은 피해")}/high`, (req, res, next) => {
  res.json({
    feedback: `님의 막은 피해는 비슷한 플레이어에 비해 월등한 수준입니다.
    아군 보호 및 임무 기여에 많은 시간을 할애하며, 방벽 컨트롤도 제때하며, 죽는 횟수 또한 어느정도 낮을 것이
    라고 생각합니다. 하지만, 궁극기 처치 기여 및 딜 수치가 너무 지나치게 낮다면, 해당 부분에 대해선 어느정도 개선이
    필요할 것이라고 생각이 듭니다. 이 정도 수준의 유저분에겐 일일이 설명하지 않으셔도, 그 방법을 알 것이라고 생각
    합니다.`
  });
});

router.get(`/${encodeURI("대지분쇄로 처치")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기로 처치한 적의 수는 비슷한 플레이어의 평균에 못 미칩니다.
    틈틈히 화염강타 및 근접한 적에게 기본 공격을 가함으로써, 궁극기 게이지 수급을 신경 써주실 것을 권유합니다. 또한 궁극기를 사용하기 전에
    좀 더 정확한 브리핑 및 아군의 지원 가능 여부, 위협적인 적의 위치파악이 필요할 것 같습니다. 아무리 4~5인궁을 사용하셔도, 
    함께할 팀원이 없다면 한 없이 약해지는 영웅이다 보니까요.`
  });
});

router.get(`/${encodeURI("대지분쇄로 처치")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기로 처치한 적의 수는 비슷한 플레이어의 평균에 근접합니다.
    어느정도 궁각을 잡을 줄 아는 분이라고 생각이 듭니다. 하지만, 어쩌면 중요한 타이밍에 궁극기가 충전이 덜 되어
    낭패를 보셨던 경험이 어느 정도 있었을 것이라고 생각이 드는데요, 해서 저희는 화염강타의 적중률에 대한 피드백을 제의해봅니다.
    화염강타는 데미지도 데미지지만, 라인하르트의 궁극기를 채우는데 꽤 큰 도움이 되는 스킬입니다. 해당 부분을
    좀 더 신경 쓰신다면, 이 수치가 좀 더 개선 될 것 같습니다.`
  });
});

router.get(`/${encodeURI("대지분쇄로 처치")}/high`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기로 처치한 적의 수는 비슷한 플레이어에 비해 높습니다.
    궁각도 잘 잡으시는 것 같고, 장시간 생존하며, 화염강타 및 여러 궁극기 게이지를 채우는 기술의 적중률이 높으실 것이라고 생각이 듭니다.
    해당 부분에서 딱히 흠잡을 부분은 없습니다.`
  });
});

module.exports = router;
