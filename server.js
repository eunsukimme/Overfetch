// Express 라이브러리
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const app = express();
const apiRouter = require("./routes/apiRouter");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

///////               몽고 DB 연결                 /////
// MongoDB Atlas 연결
mongoose.connect(
  `mongodb+srv://${username}:${password}@overfetch-noxxr.mongodb.net/main?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);
// 로컬 DB 연결
/*mongoose.connect("mongodb://localhost:27017/overfetch", {
  useNewUrlParser: true
});*/
const db = mongoose.connection;
db.on("error", () => {
  console.log("Can't connect to mongodb server");
});
db.on("open", () => {
  console.log("Connected to mongod server");
});
/////////////////////////////////////////////////////

//production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

/* router split */
app.use("/api", apiRouter);

//build mode
app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// heroku dyno를 5분 주기로 계속 깨우는 Interval 설정
setInterval(function() {
  http.get("http://overfetch.herokuapp.com");
}, 1000 * 60 * 5);

/* server run */
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
