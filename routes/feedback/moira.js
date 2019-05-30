const express = require("express");
const router = express.Router();

router.get(`/${encodeURI("자가 치유")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 자가 치유는 평균보다 낮습니다. 자가 치유는 융화 및 생체 구슬에도 
    적용이 됩니다. 자가 치유가 낮다는 것은 융화와 구슬을 딜링에 조금 더 집중하고 있다는 
    뜻으로 해석이 됩니다. 무리하게 딜을 하다 포지션이 불안정해지고 적군에게 죽게 되는 것이죠. 
    우선 모이라의 소멸이 최상급의 생존기로 꼽히는만큼 위험할 때는 무조건 사용하시기 바랍니다. 
    또한 아군 힐러와의 소통을 통해 스킬들을 아끼는 모습 또한 보여주세요. 아군이 구슬과 
    융화를 함께 맞을 수 있는 포지션에 위치한다면 평균 수치가 더 올라갈 것입니다.`
  });
});

router.get(`/${encodeURI("자가 치유")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님의 자가 치유는 평균입니다. 자가 치유는 융화 및 생체 구슬에도 적용이 
    됩니다. 자가 치유가 평균적인 수치에 속한다는 것은 딜링을 아슬아슬하게 넣다가 생체 
    구슬이나 융화를 급하게 쓴다는 의미이기도 합니다. 힐러의 생존이 우선적이긴 하지만 
    포지션을 조금 더 안정적으로 잡으면서 스킬을 한 번 더 아끼는 움직임을 보여주세요. 
    더 많은 아군을 살릴 수 있을 것이며 또한 평균 수치도 조금 더 올라가게 될 것입니다.`
  });
});

router.get(`/${encodeURI("자가 치유")}/high`, (req, res, next) => {
  res.json({
    feedback: `님의 자가 치유는 평균보다 높습니다. 자가 치유는 융화 및 생체 구슬에도 
    적용이 됩니다. 오랫동안 생존하고 체력이 치명상이더라도 최대한 생존에 집중한다는 
    뜻이겠죠. 단, 자가 치유에 신경쓰다보면 오히려 아군의 체력을 신경쓰지 못하는 경우가 
    있습니다. 즉, 모이라의 불안정한 힐량을 커버할 수 있는 생체 구슬과 융화를 자가 치유에 
    무리하게 활용한다면 아군 케어가 힘든 것이죠. 이 부분을 염두하면서 게임을 한다면 수치가 
    유지되면서도 더 많은 아군을 살릴 수 있을 것입니다.`
  });
});

router.get(`/${encodeURI("융화로 치유")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 융화 치유는 평균 이하입니다. 이말인즉슨 무리하게 딜러들과 난전을 
    벌이다가 죽은 경우가 많다는 뜻이기도 합니다. 우선 폭발적인 힐량으로 융화를 빠르게 
    모을 수 있도록 하는 것이 급선무입니다. 이후 생존에 신경쓰면서 아군에게 우선적으로 
    활용한다면 더 많은 수치를 기록할 수 있을 것입니다.`
  });
});

router.get(`/${encodeURI("융화로 치유")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님의 융화 치유는 평균적입니다. 아군과 적군에게 방출하는 비율이 비슷하다는 
    뜻이겠죠. 아무래도 융화를 사용하다보면 적군의 피가 빠르게 깎이면서 킬을 내는 상황이 
    많아 아군에게 주기보다 적군에게 사용하는 경우가 많을 수 있습니다. 하지만 모이라의 
    본분은 힐러이므로 아군 케어에 조금 더 집중하는 모습을 보여주세요. 그렇다면 수치가 
    조금 더 높아질 것입니다.`
  });
});

router.get(`/${encodeURI("융화로 치유")}/high`, (req, res, next) => {
  res.json({
    feedback: `님의 융화 치유는 평균보다 높습니다. 한타 때마다 융화 사이클을 돌리면서 
    계속 힐을 주기 때문에 수치가 높은 것은 당연한 것이라 볼 수 있습니다. 현재처럼 아군들을 
    케어하는 포지션을 잡으면서 모이라의 생체 손아귀 게이지를 채우기 위해 적군을 공격하는 
    경우도 많을 것입니다. 모이라의 1대1 능력이 강하다보니 무리하게 들어가다가 죽는 경우가 
    많은데요, 이 부분만 조심하신다면 수치는 계속 유지될 것으로 보입니다.`
  });
});

router.get(`/${encodeURI("융화로 처치")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 융화 처치 수는 평균 이하입니다. 아군 케어에 조금 더 신경을 쓰고 
    계신다는거죠. 가장 이상적인 활용은 아군과 적군이 일직선으로 대치하고 있을 때 한꺼번에 
    맞춘다는 것입니다. 피없는 아군들을 케어하는 것도 중요하지만 융화를 통해 적군 딜러들에게 
    압박을 넣는 것 또한 중요합니다. 융화의 데미지 역시 초당 70으로 꽤 높으니 아군과 적군 
    모두에게 맞추려는 움직임을 보여주세요!`
  });
});

router.get(`/${encodeURI("융화로 처치")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님의 융화 처치 수는 평균적입니다. 즉, 아군 케어와 적군에게 공격하는 
    비율이 비슷하다는 뜻이죠. 만약 아군의 체력 상황이 여유롭다면 조금 더 과감하게 
    공격하시는 것도 추천드립니다. 융화는 자가 치유도 되기 때문에 딜러들과의 1대1 상황에서도 
    크게 밀리지 않습니다. 조금 더 과감한 플레이를 통해 적 딜러들을 공격한다면 더 높은 
    수치를 기록하실 수 있을 것입니다.`
  });
});

router.get(`/${encodeURI("융화로 처치")}/high`, (req, res, next) => {
  res.json({
    feedback: `님의 융화 처치 수는 평균보다 높습니다. 즉, ~님은 적 딜러들에게 융화를 
    많이 맞춘다는 것인데요. 융화로 힐과 딜을 어느 상황에 활용해야 하는지 확실하게 알고 
    계신다는 뜻이죠. 단, 융화 상태에서는 어떤 스킬도 쓸 수 없다는 것을 알고 계실 것입니다. 
    무리하게 딜러들을 죽이려 하기 보다는 최대한 아군을 케어하면서 상황이 여유롭다면 
    딜러들에게 융화를 방출하세요! 조금 더 안정적인 융화 사용을 한다면 지금처럼 좋은 수치를 
    유지할 것입니다.`
  });
});

module.exports = router;
