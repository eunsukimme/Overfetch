const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const FetchManager = require('../fetchData/fetchData');
const User = require('../models/user');

// path: /search
// GET user info
router.get('/', async (req, res, next) => {
    // if query string exists
    if(req.query.name && req.query.tag){
        next();
    }
    else{
        console.log('유저 이름과 배틀태그를 넘겨주세요');
        return res.send('유저 이름과 배틀태그를 넘겨주세요');
    }
});

router.get('/', (req, res, next) => {
    const _name = req.query.name;
    const _tag = req.query.tag;
    const _update = req.query.update;
    const _genesis = req.query.genesis;
    // DB 내 유저 검색
    User.findOne({ name: _name, tag: _tag }, (err, user) => {
        if(err) return res.status(500).json({ error: err });
        if(!user) {
            console.log('유저 정보 못 찾음...');
            next();
        }
        if(user){
            if(_update == 'true' || _genesis == 'true'){
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
router.get('/', asyncHandler( async (req, res, next) => {
    const _name = req.query.name;
    const _tag = req.query.tag;
    const _update = req.query.update;
    const _genesis = req.query.genesis;

    try{
        const userInfo = await FetchManager.fetchData(_name, _tag);
        if(typeof userInfo == 'number'){
            switch(userInfo){
                case FetchManager.ERROR_RESULT.PROFILE_NOT_FOUND:
                    return res.status(404).json({ error: '해당 닉네임과 배틀태그의 유저가 존재하지 않습니다' });
                case FetchManager.ERROR_RESULT.INTERNALL_SERVER_ERROR:
                    return res.status(500).json({ error: '블리자드 내부 서버 오류로 사용자 정보를 불러올 수 없습니다. 잠시 뒤 시도하세요 '});
                case FetchManager.ERROR_RESULT.REQUEST_FAILED:
                    return res.status(400).json({ error: '페이지 요청 오류' }); 
                case FetchManager.ERROR_RESULT.API_SERVER_ERROR:
                    return res.status(500).json({ error: 'API서버 오류' });
                case FetchManager.ERROR_RESULT.PRIVATE_USER:
                    return res.status(403).json({ error: "비공개 사용자 입니다. 오버워치 인게임 [설정> 소셜> 프로필 공개설정] 에서 '공개'로 설정하셔야 전적 확인이 가능 합니다"});
                case FetchManager.ERROR_RESULT.TCP_CONNECTION_ERROR: 
                    return res.status(503).json({ error: 'TCP CONNECTION ERROR'});
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

module.exports = router;