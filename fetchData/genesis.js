/**
 *  맨 처음 DB에 사용자 데이터를 집어넣기 위한 코드
 *  OP.GG의 순위표로부터 유저 name을 가져온 뒤, 그 name으로
 *  www.playoverwatch.com 에 검색하여 나온 사용자들을
 *  DB에 집어넣는다
 */
const cheerio = require("cheerio");
const axios = require("axios");
const mongoose = require("mongoose");
const FetchManager = require("./fetchData");
const User = require("../models/user");
const Error = require("../models/error");
require("dotenv").config();
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const checkError = require("../routes/profileRouter").checkError;

///////               몽고 DB 연결                 /////
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log("Connected to mongod server");
});
mongoose.connect(
  `mongodb+srv://${username}:${password}@overfetch-noxxr.mongodb.net/main?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);
// 로컬 DB 연결
//mongoose.connect("mongodb://localhost:27017/overfetch");
/////////////////////////////////////////////////////

const pages = [];
for (let i = 1; i <= 5; i++) {
  pages.push(i);
}

const genesisData = async () => {
  for (let page of pages) {
    await getUserNames(page);
  }
};

const getUserNames = async page => {
  try {
    // page는 OP.GG의 순위표의 각 페이지를 말함
    console.log(
      "=============== page#" + page + " 크롤링 시작! ==============="
    );
    console.log(Date());
    const url = `https://overwatch.op.gg/leaderboards?platform=pc&role_id=0&page=${page}`;
    console.log("GET " + url);
    const urlencoded = encodeURI(url);

    const result = await axios
      .get(urlencoded, {
        origin: "",
        validateStatus: status => true
      })
      .then(res => res.data)
      .catch(error => {
        console.log(error);
      });
    const $ = cheerio.load(result);

    // 100 명의 유저 정보가 담긴 cheerio object 배열
    const userList = $("body")
      .find(".l-container")
      .find("#LeaderBoardsLayout")
      .find("table > tbody")
      .children();
    // 각각의 유저블록에 대해 이름 접근
    // promises는 데이터 수집이 정상적이든 비정상적이든 종료된 결과
    // name 또는 saved error of name 이 들어간다
    let names = [];
    userList.each((i, el) => {
      const name = $(el)
        .find(".ContentCell-Player")
        .find("b")
        .text();
      names.push(name);
    });

    for (let name of names) {
      await findUsersAtHomepage(name);
    }
    console.log(
      "=============== page#" + page + " 크롤링 완료! ==============="
    );
    console.log(Date());
    return page;
  } catch (error) {
    console.log(error);
  }
};

// isUserExists는 해당 이름의 유저가 존재하면 true, 아니라면 false 를 리턴한다
const isUserExists = async name => {
  const result = await User.findOne({ name: name })
    .then(user => {
      if (!user) {
        return new Promise(resolve => {
          resolve(false);
        });
      }
      return new Promise(resolve => {
        resolve(true);
      });
    })
    .catch(error => {
      return new Promise(resolve => {
        resolve(false);
      });
    });
  return new Promise(resolve => {
    resolve(result);
  });
};

// isUserDuplicate는 유저가 중복되면 true, 아니라면 false를 반환한다
const isUserDuplicate = async (name, tag) => {
  try {
    const user = await User.findOne({ name: name, tag: tag });
    return user ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const findUsersAtHomepage = async name => {
  // const isExists = await isUserExists(name);
  // if (isExists == true) {
  //   // 해당하는 이름의 유저가 DB에 존재하므로 넘어간다
  //   // 이름이 유사한 것들도 이미 다 저장되있으므로
  //   console.log(`이름이 <${name}> 인 유저가 DB에 존재하여 넘어갑니다...`);
  //   return new Promise(resolve => {
  //     resolve(true);
  //   });
  // }
  /*const result = await User.findOne({ name: name }, async (err, user) => {
        if(err) return new Promise((resolve) => resolve(err));
        if(user){
            // 해당하는 이름의 유저가 DB에 존재하므로 넘어간다
            // 이름이 유사한 것들도 이미 다 저장되있으므로
            console.log(`이름이 <${name}> 인 유저가 DB에 존재하여 넘어갑니다...`);
            return new Promise((resolve) => {
                resolve(true);
            })
        }
        // 해당 이름의 유저가 DB에 존재하지 않는다면 넘어간다
        else{*/
  const token = "KR6Q1Kx3Fs16Y26GD0jcknmbjqnDZZcjeh";
  const url =
    "https://playoverwatch.com/search/account-by-name/" +
    name +
    "?access_token=" +
    token;
  const urlencoded = encodeURI(url);

  const users = await axios
    .get(urlencoded, {
      origin: "",
      validateStatus: status => true
    })
    .then(res => res.data)
    .catch(error => {
      return error;
    });

  // 블리자드 내부 서버 요류
  if (users.error) {
    const newError = new Error();
    newError.message = `${name} - ${users.error}`;
    newError.save(err => {
      if (err) {
        return err;
      }
      console.log("saved error of " + name + ": " + users.error);
      return "saved error of " + name + ": " + users.error;
    });
    return name;
  }
  console.log("이름이 <" + name + ">인 유저들의 데이터 수집이 시작됩니다...");
  // promises는 fetch여부에 따라 true 또는 flase 또는 error 가 들어간다
  const promises = await users.map(async user => {
    // 만약 그 유저가 공개유저라면 저장
    if (user.isPublic == true) {
      const token = user.name.split("#");
      const _name = token[0]; // 대소문자 구분위해 이름 새로 저장
      const _tag = token[1];
      // tag가 없는 어처구니없는 경우가 있으므로 두 값 중 하나라도 없으면 그냥 넘어간다
      if (_name == undefined || _tag == undefined) {
        return user;
      }

      // 먼저 중복 여부 검사
      const isDuplicate = await isUserDuplicate(_name, _tag);
      if (isDuplicate == true) {
        console.log(`${_name}#${_tag} 유저가 DB에 존재하여 넘어갑니다...`);
        return user;
      }
      // 유저 데이터를 playoverwatch.com 으로부터 긁어온다
      const userInfo = await FetchManager.fetchData(_name, _tag, user.level);
      // 만약 오류가 발생하였다면, 그러나 이미 공개 유저이므로 비공개, 검색 실패 오류는 배제한다
      if (typeof userInfo == "number") {
        const result = checkError(userInfo);
        const newError = new Error();
        newError.name = _name;
        newError.tag = _tag;
        newError.message = result.message;
        try {
          const errorDoc = await Error.find({ name: _name, tag: _tag });
          if (!errorDoc) {
            await newError.save();
            console.log(
              `${_name}#${_tag} 의 데이터를 가져오는데 발생한 에러를 기록했습니다...`
            );
          }
        } catch (error) {
          console.log(error);
        }
        return user;
      }
      // 정상적으로 긁어왔다면 DB에 저장한다
      try {
        await userInfo.save();
        console.log(`${_name}#${_tag} 의 데이터를 성공적으로 저장했습니다!`);
      } catch (error) {
        console.log(error);
      }
    } // 비공개 유저는 무시한다
    return user;
  }); // end of data.map()
  const result = await Promise.all(promises);
  console.log(`이름이 <${name}>인 유저들의 데이터 수집이 완료되었습니다...`);

  return name;
};

// 데이터 생성 시작
(async () => {
  console.log("Genesis data ...");
  await genesisData();
  console.log("Done");
})();
