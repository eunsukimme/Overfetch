/**
 *  맨 처음 DB에 사용자 데이터를 집어넣기 위한 코드
 *  OP.GG의 순위표로부터 유저 name을 가져온 뒤, 그 name으로
 *  www.playoverwatch.com 에 검색하여 나온 사용자들을 
 *  DB에 집어넣는다
 */
const cheerio = require('cheerio');
const axios = require('axios');
const mongoose = require('mongoose');
const FetchManager = require('./fetchData');
const Error = require('../models/error');

///////               몽고 DB 연결                 /////
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log("Connected to mongod server");
})
mongoose.connect('mongodb://localhost/overfetch');
/////////////////////////////////////////////////////

const genesisData = async () => {
    // page는 OP.GG의 순위표의 각 페이지를 말함
    for(let page = 1; page < 2 ; page++){
        const url = 'https://overwatch.op.gg/leaderboards/global/rank/' + page;
        const urlencoded = encodeURI(url);

        const result = await axios.get(urlencoded, {
            origin: ''
        })
        .then(res => res.data)
        .then(body => {
            console.log('fetching data...');
            const $ = cheerio.load(body);
    
            // 100 명의 유저 정보가 담긴 cheerio object 배열
            const userList = $('body').find('.l-container').find('#LeaderBoardsLayout')
                            .find('table > tbody').children();
            // 각각의 유저블록에 대해 이름 접근
            userList.each( (i, el) => {
                const name = $(el).find('.ContentCell-Player').find('b').text();
                findUsersAtHomepage(name);
            })
        })
        return new Promise( (resolve) => {
            resolve(result);
        })
    }
}

const findUsersAtHomepage = async (name) => {
    //const cors = 'https://cors-anywhere.herokuapp.com/';
    const token = 'KR6Q1Kx3Fs16Y26GD0jcknmbjqnDZZcjeh';
    const url = 'https://playoverwatch.com/search/account-by-name/'+name
                +'?access_token='+token;
    const urlencoded = encodeURI(url);

    await axios.get(urlencoded, {
        origin: ''
    })
    .then(res => res.data)
    .then(data => {
        if(data.error){
            const newError = new Error();
            newError.message = `${name} - ${data.error}`;
            newError.save( (err) => {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log('saved error of'+name+': '+data.error);
            });
        }
        else{
            data.forEach( async (el) => {
                    // 만약 그 유저가 공개유저라면 저장
                if(el.isPublic == true){
                    const token = el.name.split('#');
                    const tag = token[1];
                    // 유저 데이터를 playoverwatch.com 으로부터 긁어온다
                    const userInfo = await FetchManager.fetchData(name, tag, el.level);
                    if(typeof userInfo == 'number'){
                        const newError = new Error();
                        switch(userInfo){
                            case FetchManager.ERROR_RESULT.INTERNALL_SERVER_ERROR: {
                                newError.message = '블리자드 내부 서버 오류로 사용자 정보를 불러올 수 없습니다. 잠시 뒤 시도하세요 ';
                                break;
                            }
                            case FetchManager.ERROR_RESULT.REQUEST_FAILED: {
                                newError.message = '페이지 요청 오류';
                                break;
                            }
                            case FetchManager.ERROR_RESULT.API_SERVER_ERROR: {
                                newError.message = 'API 서버 오류';
                                break;
                            }
                            case FetchManager.ERROR_RESULT.UNKNOWN_ERROR: {
                                newError.message = '알 수 없는 오류';
                                break;
                            }
                        }
                        newError.save( (err) => {
                            if(err){
                                console.log(err);
                                return;
                            }
                            console.log(name+'의 데이터를 가져오는데 발생한 에러를 기록했습니다...');
                        });
                    }
                    // 정상적으로 긁어왔다면 DB에 저장한다
                    else{
                        userInfo.save( (err) => {
                            if(err){
                                console.error(err);
                                return;
                            }
                            console.log(name+'의 데이터를 성공적으로 저장했습니다!');
                        });
                    }
                }   // 비공개 유저는 무시한다
            })  // end of data.forEach()
        }   // end of data.error check
    }) // end of then(data=> {})
    .catch((error) => {
        console.log(error);
    });
}

console.log('genesis data...');
genesisData();