const express = require('express');
const router = express.Router();

const User = require('../models/user');

// path: /users
router.get('/:sort/:page', (req, res, next) => {
    // sort는 level 혹은 rank(default)이다
    let sort = req.params.sort;
    // rank순 정렬은 val 프로퍼티로 준다
    if(sort == 'rank'){
        sort = '-rank.val'; // rank값 내림차순으로 정렬
    }
    if(sort == 'level'){
        sort = '-level';    // level값 내림차순으로 정렬
    }
    let page = req.params.page;
    let userCountperPage = 100; // 한 페이지에 보여줄 유저 수

    User.find({}).select("name tag level rank imageSrc icon")
    .sort(sort).skip(userCountperPage*(page-1)).limit(userCountperPage).exec((err, users) => {
        if(err) return res.json({error: err});
        return res.json(users);
    });
});

module.exports = router;