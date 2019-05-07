// Express 라이브러리
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const searchRoute = require("./routes/searchRoute");
const usersRoute = require("./routes/usersRoute");
const avgRoute = require("./routes/avgRoute");
const PORT = process.env.PORT || 5000;
///////               몽고 DB 연결                 /////
const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log("Connected to mongod server");
});
// MongoDB Atlas 연결
mongoose.connect(
  "mongodb+srv://test:temppwd@overfetch-beta-release-noxxr.mongodb.net/test?retryWrites=true",
  { useNewUrlParser: true }
);
// 로컬 DB 연결
/*mongoose.connect("mongodb://localhost:27017/overfetch", {
  useNewUrlParser: true
});*/
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
app.use("/search", searchRoute);
app.use("/users", usersRoute);
app.use("/avg", avgRoute);

//build mode
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

/* server run */
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
