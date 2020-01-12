// Express 라이브러리
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const app = express();
const searchRoute = require("./routes/searchRoute");
const usersRoute = require("./routes/usersRoute");
const avgRoute = require("./routes/avgRoute");
const feedbackRoute = require("./routes/feedbackRoute");
const PORT = process.env.PORT || 5000;

///////               몽고 DB 연결                 /////
// MongoDB Atlas 연결
mongoose.connect(
  "mongodb+srv://test:temppwd@overfetch-beta-release-noxxr.mongodb.net/test?retryWrites=true",
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
app.use("/profile", searchRoute);
app.use("/users", usersRoute);
app.use("/avg", avgRoute);
app.use("/feedback", feedbackRoute);

//build mode
app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// heroku dyno를 5분 주기로 계속 깨우는 Interval 설정
setInterval(function() {
  http.get("https://overfetch.herokuapp.com");
}, 1000 * 60 * 5);

/* server run */
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
