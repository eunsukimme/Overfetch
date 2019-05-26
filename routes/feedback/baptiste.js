const express = require("express");
const router = express.Router();

router.get(`/${encodeURI("불사 장치로 사망 저지")}/low`, (req, res, next) => {
  res.json({
    feedback: `님이 불사 장치로 살리신 아군 플레이어 수는 상대적으로 낮습니다. 
    아군 탱커가 집중공격을 받아서 노파심에 불사장치를 쓴 경우가 있지 않나요? 불사장치는 
    적군의 강력한 중력자탄-용의 일격과 같은 콤보가 들어왔을 때 한 턴 벌어준다는 느낌으로 
    쓴다면 아군 세이브를 훨씬 더 많이 할 수 있을 것입니다! 또한 불사장치는 아군의 생명력을 
    20% 이하로 내려가지 않는 것이 그 목적인 스킬이므로 다시 힐을 빠르게 지원해주는 것이 
    아군을 살리는 지름길입니다.`
  });
});

router.get(`/${encodeURI("자가 치유")}/low`, (req, res, next) => {
  res.json({
    feedback: `님, 우선 바티스트의 생체탄 발사기는 자신에게 힐이 되지 않으며 범위가 넓지만 
    명중하기 어렵다는 단점이 있습니다. 이러한 부분을 메꾸기 위해서는 치유 파동을 적극적으로 
    활용해야 합니다. 그러나 루시우와 달리 범위 장판이 유지되는 것이 아니라 스킬을 시전한 
    순간 범위 내 아군들에게 힐이 들어가므로 이 부분을 염두해야 더 많은 힐량을 제공할 수 
    있을 것입니다.`
  });
});

module.exports = router;