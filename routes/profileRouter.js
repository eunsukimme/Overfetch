const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const FetchManager = require("../fetchData/fetchData");
const User = require("../models/user");

// path: /api/profile
// GET user info
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
// 각 에러에 맞게 status와 message를 object에 담아 반환해주는 함수
const checkError = errorInfo => {
  switch (errorInfo) {
    case FetchManager.ERROR_RESULT.PROFILE_NOT_FOUND:
      // 만약 기존에 존재하는 유저가 있어서(리더보드 클릭 등)
      return {
        status: 404,
        message: "해당 닉네임과 배틀태그의 유저가 존재하지 않습니다"
      };
    case FetchManager.ERROR_RESULT.INTERNALL_SERVER_ERROR:
      return {
        status: 500,
        message:
          "블리자드 내부 서버 오류로 사용자 정보를 불러올 수 없습니다. 잠시 뒤 시도하세요"
      };
    case FetchManager.ERROR_RESULT.REQUEST_FAILED:
      return {
        status: 400,
        message: "페이지 요청 오류"
      };
    case FetchManager.ERROR_RESULT.API_SERVER_ERROR:
      return {
        status: 500,
        message: "API 서버 오류"
      };
    case FetchManager.ERROR_RESULT.PRIVATE_USER:
      return {
        status: 403,
        message:
          "비공개 사용자 입니다. 오버워치 인게임 [설정> 소셜> 프로필 공개설정] 에서 '공개'로 설정하셔야 전적 확인이 가능 합니다"
      };
    case FetchManager.ERROR_RESULT.TCP_CONNECTION_ERROR:
      return {
        status: 503,
        message: "TCP CONNECTION ERROR"
      };
    case FetchManager.ERROR_RESULT.UNKNOWN_ERROR:
      return {
        status: 520,
        message: "알 수 없는 오류"
      };
    case FetchManager.ERROR_RESULT.DATABASE_ERROR:
      return {
        status: 500,
        message: "데이터베이스 오류"
      };
  }
};

// 입력이 올바르게 들어왔는지 확인하는 미들웨어
const checkInput = (req, res, next) => {
  if (req.params.name && req.params.tag) {
    return next();
  }
  console.log("유저 이름과 배틀태그를 넘겨주세요");
  return res.send("유저 이름과 배틀태그를 넘겨주세요");
};
// 기존에 존재하는 유저인지 확인하는 미들웨어
const checkUserExistence = async (req, res, next) => {
  const _name = req.params.name;
  const _tag = req.params.tag;
  let _update = req.query.update ? req.query.update : undefined;
  let _genesis = req.query.genesis ? req.query.genesis : undefined;

  try {
    const user = await User.findOne({ name: _name, tag: _tag });
    return user // 유저가 DB에 존재하면
      ? _update == "true" || _genesis == "true" // update또는 genesis 파라미터가 존재하면
        ? next() // 다음으로 넘어가서 데이터를 크롤링한다
        : res.json(user) // 그런 파라미터가 없으면 그냥 유저 반환한다
      : next(); // 유저가 없으니 다음으로 넘어가서 크롤링한다
  } catch (error) {
    console.log(error);
    return res.status(520).json({ error: "데이터베이스 오류" });
  }
};

// 유저를 검색하는 요청을 핸들링하는 라우트
router.get(
  "/:name/:tag",
  checkInput, // 입력 값 validation
  checkUserExistence, // 기존에 존재하는 유저면 반환
  asyncHandler(async (req, res, next) => {
    const _name = req.params.name;
    const _tag = req.params.tag;
    let _update = req.query.update ? req.query.update : undefined;
    let _genesis = req.query.genesis ? req.query.genesis : undefined;

    try {
      const userInfo = await FetchManager.fetchData(_name, _tag);
      // 만약 오류로 인해 유저 정보를 가져오지 못 했을 경우
      if (typeof userInfo == "number") {
        // 기존에 저장되 있는 유저 정보가 있다면 삭제한다(기존에 저장되있는 유저가 비공개 or 없어진 경우일 수 있음)
        User.findOneAndDelete(
          { name: _name, tag: _tag },
          { useFindAndModify: false }
        ).exec();
        const result = checkError(userInfo);
        return res.status(result.status).json({ error: result.message });
      }
      // 갱신 요청의 파라미터가 true라면 새롭게 가져온 데이터를 저장한다
      if (_update == "true") {
        let userToUpdate = {};
        userToUpdate = Object.assign(userToUpdate, userInfo._doc);
        delete userToUpdate._id; // id 중복 방지를 위한 오브젝트 재할당
        try {
          const user = await User.findOneAndUpdate(
            { name: _name, tag: _tag },
            userToUpdate,
            { new: true }
          );
          return res.status(201).json(user);
        } catch (error) {
          console.log(error);
          return res.json({ error: error });
        }
      }
      // 아무런 파라미터가 존재하지 않는다면 새로운 유저 정보를 저장한다
      else {
        try {
          const user = await userInfo.save();
          return res.status(201).json(user);
        } catch (error) {
          console.log(error);
          return res.json({ error: error });
        }
      }
    } catch (error) {
      console.error(error);
      return res.json({ error: error });
    }
  })
);

module.exports = router;
