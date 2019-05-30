const express = require("express");
const router = express.Router();

router.get(`/${encodeURI("죽이는 타이어로 처치")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기로 처치한 적은 비슷한 다른 플레이어보다 적습니다. 
    궁극기를 활용하는 법을 잘 몰라, 바닥으로만 타이어를 움직이는 정직함을 보이지는 않나요? 혹은 기본기가 부족하여, 자동으로 차는 궁극기 게이지 100퍼센트가 다 찰 때까지 
    기다려야하진 않으신가요? 조금 힘드시겠지만, 정크랫에 대한 기초를 다루고, 많은 궁극기 사용 경험을 통해, 위협적인 루트를 깨닫는 방법외엔 그닥 개선할 방법이 없을 것 같습니다. 
    전자의 경우엔 정크랫 고유의 궤적이나 맞추는 방법을 위해 인공지능전이나 훈련장을 사용하는 방법을, 후자의 경우엔 빠른 궁극기 쿨타임을 갖는 사설 매치를 이용하신다면 좋을 것 
    같습니다.`
  });
});

router.get(`/${encodeURI("죽이는 타이어로 처치")}/middle`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기로 처치한 적은 비슷한 다른 플레이어들과 큰 차이가 없습니다. 
    궁극기를 활용하는 방법은 알고 있으시지만, 지나친 욕심으로 손해를 보는 경우가 종종 있습니다. 죽이는 타이어는 본체인 정크랫이 그자리에 멈추는 대신 타이어가 이동, 
    큰 피해를 입히는 스킬입니다. 하지만, 너무 많은 동시킬을 노리시다가 타이어 폭발에도 실패하고 본체까지 사망하는 경우가 발생하곤 했을 것 같습니다. 궁극기를 사용했는데 
    상황이 여의치 않다면? 1~2명을 전투에서 제외시키고, 기본 공격기로 팀에 기여하는 선택을 하는 판단력을 키운다면 좋을 것 같습니다. 이외, 상대의 적의 위치를 브리핑하고 
    팀과의 의사소통을 통해 보다 안전하게 타이어를 옮길 수 있다는 점을 항상 기억하셨으면 합니다.`
  });
});

router.get(`/${encodeURI("죽이는 타이어로 처치")}/high`, (req, res, next) => {
  res.json({
    feedback: `님의 궁극기로 처치한 적은 비슷한 다른 플레이어들보다 많은 편입니다. 
    궁극기를 충전하는 속도도 타 플레이어들보다 뛰어나며, 죽이는 타이어의 루트 또한 굉장히 잘 잡아 팀파이트에 크게 기여합니다. 해당 부분에 대하여 마땅히 드릴 조언이 없을 정도로, 
    죽이는 타이어를 잘 활용하고 계십니다.`
  });
});

router.get(`/${encodeURI("충격 지뢰로 처치")}/low`, (req, res, next) => {
  res.json({
    feedback: `님의 충격 지뢰로 처치한 적의 수는 평균보다 낮은 편입니다. 
    충격 지뢰는 생존성과 딜량 모두를 챙길 수 있는 스킬입니다. K/D가 낮으시다면 덫과의 연계보다 충격 지뢰를 생존용으로 활용하세요. 
    안정적인 포지션을 통해 쉴새없이 몰아치는 기본공격을 통해 죽이는 타이어를 최대한 빠르게 모으세요!
    덫과 충격 지뢰의 콤보를 활용하세요. 충격 지뢰는 최대 2개까지 충전할 수 있기 때문에 하나는 생존용으로 활용하면서 조금 더 과감하게 플레이하셔도 좋습니다.`
  });
});

module.exports = router;
