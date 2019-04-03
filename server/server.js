// Express 라이브러리
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const homeRoute = require('./routes/homeRoute');
const usersRoute = require('./routes/usersRoute');
const PORT = process.env.PORT || 5000;
///////               몽고 DB 연결                 /////
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log("Connected to mongod server");
})
mongoose.connect('mongodb://localhost/overfetch', {useNewUrlParser: true});
/////////////////////////////////////////////////////

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/* router split */
app.use('/', homeRoute);
app.use('/users', usersRoute);

/* server run */
app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
})