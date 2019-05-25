const express = require("express");
const router = express.Router();

// path: /feedback/메이
// 고드름 명중률
router.get(`/${encodeURI("황야의 무법자로 처치")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기 처치는 다른 플레이어의 처치량보다 낮습니다.
    기본적으로 궁극기 위치선정도 별로이며, 차징 속도 또한 더딜 가능성이 높습니다. 궁극기 한방보다는 맥크리의 기본에 충실하시는 것을 우선순위에 두신다면 좋을 것 같
    습니다. 에임이나 빠른 반응 속도, 그리고 넓은 시야가 그것이라고 말씀드리고 싶으며, 궁극기 또한, 너무 예측이 쉬운 곳 보다는, 궁극기 시전 이후, 
    팀원의 케어를 빠르게 받을 수 있는 동시에, 아주 순간적인 대처가 어려운 곳을 위주로 생각해보시면 좋을 것 같습니다.`
  });
});

router.get(`/${encodeURI("황야의 무법자로 처치")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기 처치는 다른 플레이어의 처치량과 큰 차이가 없습니다.
    혹시, 오버워치 하이라이트 영상을 즐겨보시나요? 맥크리의 궁극기는 정말 극적인 그림을 만들어내는데 있어 분명 재미있는 궁극기는 맞습니다. 하지만, 과거와 달리
    유저 수준이 상당히 높아진 지금, 그러한 욕심 가득한 플레이는 다소 독이 될 수 있다는 점을 알려드리고 싶습니다. 맥크리는 궁극기 시전중 완전히 무방비 상태가 되며
    나 여기있다 하고 위치까지 보여줍니다. 탱커까지 모두 노리다간 방벽에 막히거나, 그 전에 죽기 십상이죠. 즉, 요컨대, 맥크리의 궁극기는 주력기가 아닌, 교전에서 1~2
    명을 죽이거나, 전장에서 이탈시키는 보조기로 활용하시고, 일반 공격에 조금 더 치중한 플레이를 하시도록 하는 게 좋을 것 같습니다.`
  });
});

router.get(`/${encodeURI("황야의 무법자로 처치")}/high`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기 처치는 다른 플레이어의 처치량보다 높은 편입니다.
    시대가 바뀐 지금, 맥크리의 궁극기는 하이리스크 하이리턴 보다는 로우리스크 미들리턴을 추구하는 방향으로 바뀌었습니다. 님은 그런 상황에서 정확한 명중률로
    빠르게 궁극기를 충전하고, 교전에 앞서 빠르게 한 두명을 이탈시키는 데 능합니다. 종종 옛날처럼 크게 성공하는 그림도 나오며, POTG를 종종 차지하는 일도 있을
    것 같습니다. 저희로서도 딱히 드릴 조언은 없는 것 같습니다. `
  });
});

module.exports = router;
