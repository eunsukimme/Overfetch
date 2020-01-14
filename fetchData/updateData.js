const mongoose = require("mongoose");
const FetchManager = require("./fetchData");
const User = require("../models/user");
const Error = require("../models/error");
require("dotenv").config();
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

///////               몽고 DB 연결                 /////
const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log("Connected to mongod server");
});
mongoose.connect(
  `mongodb+srv://${username}:${password}@overfetch-noxxr.mongodb.net/main?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);
///////////////////////////////////////////////////////////

const users_per_page = 100; // 각 페이지당 100 명의 유저 존재

const updateUserData = async page_mul_users_per_page => {
  console.log(
    `=============== 페이지#${page_mul_users_per_page /
      users_per_page} 업데이트 시작 =============== `
  );
  // 각 페이지에 존재하는 유저(100명씩) 업데이트시킴
  const result = await User.find(
    {},
    "name tag level",
    { skip: page_mul_users_per_page - users_per_page, limit: users_per_page },
    async (err, users) => {
      if (err) console.log(err);
      if (users) {
        const result = users.map(async user => {
          const name = user.name;
          const tag = user.tag;
          const level = user.level;
          const new_user_data = await FetchManager.fetchData(name, tag, level);

          let userToUpdate = {};
          userToUpdate = Object.assign(userToUpdate, new_user_data._doc);
          delete userToUpdate._id; // id 중복 방지를 위한 오브젝트 재할당

          // 유저의 이름과 태그로 해당 document 업데이트
          return User.findOneAndUpdate(
            { name: name, tag: tag },
            userToUpdate,
            { new: true },
            (err, user) => {
              if (err) {
                console.log(err);
                return new Promise(resolve => {
                  resolve(false);
                });
              }
              console.log(`${name}#${tag} 업데이트 완료!`);
              return new Promise(resolve => {
                resolve(true);
              });
            }
          );
        });
        await Promise.all(result);
        console.log(
          `=============== 페이지#${page_mul_users_per_page /
            users_per_page} 업데이트 완료 ===============`
        );
        return new Promise(resolve => {
          resolve(true);
        });
      }
    }
  );
  return new Promise(resolve => {
    resolve(result);
  });
};

const updateAll = async () => {
  const user_count = await User.estimatedDocumentCount((err, count) => {
    if (err) console.log(err);
    else return count;
  });
  console.log(user_count);

  const pages = []; // 업데이트 시킬 페이지
  const page_count = user_count / users_per_page; // 페이지의 수

  for (let i = 1; i <= page_count; i++) {
    pages.push(i);
  }

  for (let page of pages) {
    await updateUserData(page * users_per_page); // 각 페이지의 유저 업데이트
  }
};

updateAll();
