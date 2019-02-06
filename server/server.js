const request = require('request');
const cheerio = require('cheerio');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 5000;
const db = mongoose.connection;

db.on('error', console.error);
db.once('open', () => {
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
    user.rand = req.body.rank;
    user.quickplay = {};
    user.rank = {};
    
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
app.get('/users', async (req, res, next) => {
    // if query string exists
    if(req.query.name && req.query.tag){
        next();
    }
    // 만약 name, tag가 담긴 query가 존재하지 않으면 모든 유저 보내줌
    else{
        // else send all user
        console.log('유저 이름과 배틀태그를 넘겨주세요');
        return res.send('유저 이름과 배틀태그를 넘겨주세요');
        /*User.find((err, users) => {
            if(err) {
                return res.status(500).send({ error: 'database failure' });
            }
            return res.json(users);
        }); */
    }
});

app.get('/users', (req, res, next) => {
    const _name = req.query.name;
    const _tag = req.query.tag;

    User.findOne({ name: _name, tag: _tag }, (err, user) => {
        if(err) return res.status(500).json({ error: err });
        if(!user) {
            next();
        }
        if(user){
            console.log('유저 찾음. 정보 전달 후 종료함');
            return res.json(user);
        }
    });
});

app.get('/users', (req, res, next) => {
    const _name = req.query.name;
    const _tag = req.query.tag;

    console.log("can't find user. request new user info to Playoverwatch.com...");
    const cors = 'https://cors-anywhere.herokuapp.com/';
    const url = cors + 'https://playoverwatch.com/ko-kr/career/pc/'
        +_name+'-'+_tag;
    const urlencoded = encodeURI(url);
    const options = {
        url: urlencoded,
        headers: {
            origin: ''
        }
    };

    request(options, (err, response, body) => {
        console.log('requesting new user info...');
        if(err) return response.status(500).json({ error: err });
        const $ = cheerio.load(body);

        // 만약 유저 프로필을 찾았다면 body의 클래스는 career-detail 이다
        // 만약 유저 프로필을 못 찾았다면 body의 클래스는 ErrorPage 이다
        if($('body').attr('class').includes('ErrorPage')){
            return res.status(404).json({ error: '프로필을 찾을 수 없습니다. 닉네임과 배틀태그를 확인해 주세요' });
        }
        // 블리자드 내부 서버 오류로 인해 안 보여지는 경우
        // table 내에 h5 내용이 'overwatch.page.career.stats.undefined' 이다
        console.log($('body').find('.card-stat-block > table').find('h5').text());
        if($('body').find('.card-stat-block > table').find('h5').text().includes('overwatch.page.career.stats.undefined')){
            return res.status(404).json({ error: '블리자드 내부 서버 오류로 프로필을 찾을 수 없습니다. 잠시 뒤 시도하세요' });
        }
    
        // DB저장할 사용자 정보 생성
        const userInfo = new User();

        /* 크롤링 시작 */
        // 스키마에 해당되는 오브젝트 생성
        const _quick_play = {}

        const rank = $('.masthead-player-progression').
        find('.competitive-rank > div').html();
        console.log('해당 유저 랭크: ', rank);
        // 빠른대전 정보 크롤링
        // 빠른대전 스키마에 해당되는 오브젝트 생성
        const _most_champion = {};
        
        // 플레이타임 정보 크롤링 & 오브젝트 생성
        const _by_playtime = {};
        const quickplay_list_byPlaytime = $('#quickplay').
                    find($('.is-active')).find('.ProgressBar');
        console.log('빠른대전 Most Champion - 플레이시간');
        quickplay_list_byPlaytime.each( (i, el) => {
            let championName = $(el).find('div > div').find('.ProgressBar-title').text();
            if(championName == "D.Va"){
                championName = "D-Va";
            }
            const championValue = $(el).find('div > div').find('.ProgressBar-description').text();
            console.log(championName, '-', championValue);
            _by_playtime[championName] = championValue;
        });
        console.log(_by_playtime);

        _most_champion.byPlayTime = _by_playtime;

        _quick_play.mostChampion = _most_champion;

        userInfo.quickplay = _quick_play;

        userInfo.name = _name;
        userInfo.tag = _tag;
        userInfo.rank = rank;

        // user 오브젝트를 DB에 저장
        userInfo.save( (err) => {
            if(err){
                console.error(err);
                return res.json({ error: err });
            }
            return res.status(201).json({ success: '새로운 유저 정보를 생성하였습니다' });
        });
    });
})

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
})