const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 5000;
const db = mongoose.connection;

db.on('error', console.error);
db.once('opne', () => {
    console.log("Connected to mongod server");
})
mongoose.connect('mongodb://localhost/overfetch');

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.send('Hello world~');
})

// Add new user on DB
app.post('/users', (req, res, next) => {
    const user = new User();
    user.name = req.body.name;
    user.tag = req.body.tag;
    user.quickplay.test = '';
    user.rank.test = '';
    
    user.save( (err) => {
        if(err){
            console.error(err);
            res.json({ result: 0 });
            return;
        }
        res.json({ result: 1 });
    })
});
// GET user info
app.get('/users', (req, res, next) => {
    // if query string exists
    if(req.query.name && req.query.tag){
        const _name = req.query.name;
        const _tag = req.query.tag;

        User.findOne({ name: _name, tag: _tag }, (err, user) => {
            if(err) return res.status(500).json({ error: err });
            if(!user) return res.status(404).json({ error: 'user not found ' });
            res.json(user);
        });
    }
    // else send all user
    else{
        User.find((err, users) => {
            if(err) return res.status(500).send({ error: 'database failure' });
            res.json(users);
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
})