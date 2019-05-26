const express = require("express");
const router = express.Router();

router.get(`/${encodeURI("초월로 치유")}/low`, (req, res, next) => {
  res.json({
    feedback: `님이 초월로 치유한 양은 낮은 편입니다. 젠야타를 할 때 중요한 것은 상대방 궁극기 타이밍에 맞춰 얼마나 초월을 잘 
    써주는가입니다. 보통 아군의 피가 없어서 급하게 초월을 쓰는 경우가 많은데 이는 좋지 
    않습니다. 서브 힐러와 소통하면서 최대한 초월을 아낀 후 상대방의 강력한 대지 분쇄, 
    중력자탄 - 용의 일격 등을 카운터 치세요. 그러면 초월 힐량이 더 많이 올라가게 될 것입니다.`
  });
});

router.get(`/${encodeURI("보조 발사 적중률")}/low`, (req, res, next) => {
  res.json({
    feedback: `님, 젠야타의 파괴의 구슬은 투사체입니다. 즉 멀리 있는 적에게 명중하기 
    어렵다는 뜻이죠. 또한 기동성 좋은 딜러와 1대1 상황을 만들기보다는 아군과 함께 상대 
    탱커에게 부조화의 구슬을 걸어 딜을 넣어주는 것이 명중률을 높이는 방법이죠. 또한 멀리 
    있는 적에게 차징샷을 날리는 것 또한 명중률을 높일 수 있는 방법 중 하나입니다!`
  });
});

module.exports = router;