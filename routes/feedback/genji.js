const express = require("express");
const router = express.Router();

// path: /feedback/메이
// 고드름 명중률
router.get(`/${encodeURI("용검으로 처치")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기로 처치한 적은 비슷한 다른 유저들보다 낮습니다.
    궁극기를 자주 채우지 못하는 경우엔, 겐지에 대한 기본 숙련도 향상이 절실히 필요합니다. 겐지의 기본적인 딜 사이클을 학습하는 게
    좋을 것으로 생각이 됩니다. 하지만 다행히도, 겐지는 오버워치가 서비스를 시작한 이래로 꾸준히 티어권에 위치한 캐릭터입니다. 굉장히 많은 자료가 유튜브에 있고, 
    사설방에도 겐지 연습방이 상당 수 있으니, 그곳에서 학습을 하여 기본기를 다지는 연습부터 하셔야 할 것 같습니다.
    그렇지 않다면 궁극기 활용에 문제가 있는 것으로, 진입을 위한 루트를 좀 더 생각하고, 궁극기 사용과 동시에 초기화 되는 질풍참을 적극 이용해보도록 의식하는 것이 
    필요하다고 생각합니다.`
  });
});

router.get(`/${encodeURI("용검으로 처치")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기로 처치한 적은 비슷한 다른 유저들과 비슷합니다.
    용검 이후 딜 사이클에 대해 인지하고 계실 것으로 생각이 됩니다. 하지만, 좀처럼 결과가 따르지 않았겠죠. 그런 님에게 저희는 다음과 같은 조언을 해봅니다.
    상대의 스킬 체크를 하려고 노력해봅시다. 겐지의 궁극기는 잠재적 위력이 엄청나지만, 수비 또한 어렵지 않은 편입니다. 아나의 수면총, 로드호그의 갈고리, 라인하르트
    의 궁극기 등, cc기를 체크하려는 노력을 하거나, 가급적 회피 하려는 노력이 필요하다고 조언드리고 싶습니다. 물론 쉬운 일이 아닙니다. 그러니, 진입을 위한 루트를 좀
    더 생각하고, 궁극기 사용과 동시에 초기화 되는 질풍참을 적극 이용해보도록 의식하는 것이 필요하다고 생각합니다.`
  });
});

router.get(`/${encodeURI("용검으로 처치")}/high`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기로 처치한 적은 비슷한 다른 유저보다 높습니다.
    단숨에 거리를 좁혀 큰 피해를 입히고, 수 차례 POTG를 차지하셨을 확률이 높습니다. 조금 더 빛을 발하고 싶으시다면, 팀원과의 호응을 위한 의사소통 개선을
    하시는 건 어떨지 권유해봅니다. 겐지의 궁극기는 아시다시피, 굉장히 리스크가 큰 대신 리턴 값도 큰 스킬 입니다. 그렇기에 팀원의 서포트가 빈약하다면 
    큰 위험을 안고 갈 수 밖에 없습니다.`
  });
});

module.exports = router;
