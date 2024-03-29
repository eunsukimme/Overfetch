const express = require("express");
const router = express.Router();

router.get(`/${encodeURI("소리 방벽 제공")}/low`, (req, res, next) => {
  res.json({
    feedback: `님이 제공한 소리 방벽 횟수는 평균보다 낮습니다. 
    루시우의 벽타기를 활용하여 적군을 교란시키는 플레이도 좋지만 우선적으로는 힐량과 
    이동속도 증가를 통해 소리방벽의 자원을 모으는 것이 중요합니다. 또한 소리방벽을 
    모았다 하더라도 활용하는 타이밍을 제대로 잡지 못해 아군이 방벽을 받지 못하는 경우 
    역시 발생합니다. 이런 문제점을 해결하기 위해서는 적군의 위협적인 궁극기가 무엇인지 
    파악한 후 쓰는 방법, 혹은 한타가 시작됐을 때 빠르게 밀고 가기 위해 쓰는 방법 
    이 두 가지를 생각하면서 쓰신다면 조금 더 많은 아군에게 방벽을 제공할 수 있을 것입니다.`
  });
});

router.get(`/${encodeURI("소리 방벽 제공")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님은 방벽 제공량이 평균에 근접해 있습니다. 소리방벽을 팀원들에게 언제 
    제공해야하는지 알고 계시지만 한타에서 아군이 전부 제공받지 못하거나 선딜레이 때 사망 
    혹은 CC기를 맞고 쓰지 못한 경우도 많을 것입니다. 이런 문제를 해결하기 위해서는 벽타기를 
    조금 더 적극적으로 활용하여 소리방벽이 캔슬되지 않도록 하는 것이 중요합니다. 2018 
    오버워치 월드컵 4강 한국 대 영국의 4세트 마지막 한타 때 아나모 선수의 소리방벽이 좋은 
    보기가 될 것입니다.`
  });
});

router.get(`/${encodeURI("소리 방벽 제공")}/high`, (req, res, next) => {
  res.json({
    feedback: `님은 소리방벽을 언제 켜야할지 정확히 알고 계십니다. 소리방벽의 활용도가 
    높기 때문에 불리한 한타를 뒤집었던 경우도 많을 것입니다. 조금 더 방벽 제공량을 높이고 
    싶다면 아군 힐러들과의 호흡을 맞추는 것이 제일 중요합니다. 젠야타의 초월이 끝난 이후 
    소리방벽을 사용한다면 6명 모두에게 방벽이 들어가면서 더 많은 방벽 제공량을 기록할 
    것입니다.`
  });
});

router.get(`/${encodeURI("자가 치유")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 자가치유는 평균에 근접하지 못했습니다. 평균에 도달하기 위해서는 
    루시우의 파동 범위를 조금 더 정확하게 숙지하실 필요가 있습니다. 이후 파동을 상황에 맞게 
    판단하되 팀원과의 콜을 활용하여 이동속도를 높이시는 방법을 추천드립니다. 무리하게 
    이동속도를 높이려다 자가치유를 하지 못하고 죽는 경우도 많으니 이 점을 항상 유의하면서 
    플레이하시기 바랍니다.`
  });
});

router.get(`/${encodeURI("자가 치유")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님의 자가치유는 평균적인 지표를 보이고 있습니다. 자가치유의 수치를 더 
    높이시고 싶다면 아군 주변, 특히 힐러들을 우선순위로 케어하면서 게임을 하세요. 아군 
    힐러를 보호하기 위해 치유의 파동을 조금 더 적극적으로 활용해야 하기 때문에 자연스럽게 
    수치가 올라갈 것입니다.`
  });
});

router.get(`/${encodeURI("자가 치유")}/high`, (req, res, next) => {
  res.json({
    feedback: `님의 자가치유는 평균보다 훨씬 높습니다. 게임에서 생존을 우선시하면서 한타에 
    참여하니 자연스러운 결과라 볼 수 있습니다. 조금 더 자가치유의 수치는 이 정도로 유지해도 
    문제 없으니 벽타기를 통해 적보다 한 발 더 앞서 움직이는 것을 추천드립니다.`
  });
});

module.exports = router;
