const FetchManager = require('./fetchData/fetchData');

// Express 라이브러리
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const cors = require('cors');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 5000;
///////               몽고 DB 연결                 /////
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log("Connected to mongod server");
})
mongoose.connect('mongodb://localhost/overfetch');
/////////////////////////////////////////////////////

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// GET user info
app.get('/users', async (req, res, next) => {
    // if query string exists
    if(req.query.name && req.query.tag){
        next();
    }
    else{
        console.log('유저 이름과 배틀태그를 넘겨주세요');
        return res.send('유저 이름과 배틀태그를 넘겨주세요');
    }
});
app.get('/users', (req, res, next) => {
    const _name = req.query.name;
    const _tag = req.query.tag;
    const _update = req.query.update;
    // DB 내 유저 검색
    User.findOne({ name: _name, tag: _tag }, (err, user) => {
        if(err) return res.status(500).json({ error: err });
        if(!user) {
            console.log('유저 정보 못 찾음...');
            next();
        }
        if(user){
            if(_update == 'true'){
                console.log('유저 정보 갱신 중...');
                next();
            }
            else{
                console.log('유저 찾음. 정보 전달 후 종료함');
                return res.json(user);
            }
        }
    });
});
app.get('/users', asyncHandler( async (req, res, next) => {
    const _name = req.query.name;
    const _tag = req.query.tag;
    const _update = req.query.update;

    try{
        const userInfo = await FetchManager.fetchData(_name, _tag);
        if(typeof userInfo == 'number'){
            switch(userInfo){
                case FetchManager.ERROR_RESULT.PROFILE_NOT_FOUND:
                    return res.status(404).json({ error: '해당 닉네임과 배틀태그의 유저가 존재하지 않습니다' }); break;
                case FetchManager.ERROR_RESULT.INTERNALL_SERVER_ERROR:
                    return res.status(500).json({ error: '블리자드 내부 서버 오류로 사용자 정보를 불러올 수 없습니다. 잠시 뒤 시도하세요 '}); break;
                case FetchManager.ERROR_RESULT.REQUEST_FAILED:
                    return res.status(400).json({ error: '페이지 요청 오류' }); 
                case FetchManager.ERROR_RESULT.API_SERVER_ERROR:
                    return res.status(500).json({ error: 'API서버 오류' });
                case FetchManager.ERROR_RESULT.UNKNOWN_ERROR:
                    return res.status(520).json({ error: '알 수 없는 오류' });
            }
        }
        else{
            // 갱신된 유저 정보 전달
            if(_update == 'true'){
                let userToUpdate = {};
                userToUpdate = Object.assign(userToUpdate, userInfo._doc);
                delete userToUpdate._id;    // id 중복 방지를 위한 오브젝트 재할당

                User.findOneAndUpdate({name: _name, tag: _tag}, userToUpdate, { new: true }, (err, user) => {
                    if(err){
                        console.log(err);
                        return res.json({ error: err });
                    }
                    return res.status(201).json(user);
                });
            }
            // 유저 정보 새롭게 저장
            else{
                userInfo.save( (err) => {
                    if(err){
                        console.error(err);
                        return res.json({ error: err });
                    }
                    return res.status(201).json(userInfo);
                });
            }
        }
    }
    catch(error){
        console.error(error);
    }
}));

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
})