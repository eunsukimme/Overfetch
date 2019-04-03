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
const User = require('../models/user');
const Error = require('../models/error');

///////               몽고 DB 연결                 /////
/*const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log("Connected to mongod server");
})
mongoose.connect('mongodb://localhost/overfetch', {useNewUrlParser: true});*/
/////////////////////////////////////////////////////

// 2019-04-02 16:00 시 기준 3페이지 까지(포함) 크롤링 완료됨

const genesisData = async () => {
    for(let page = 4 ; page < 6; page++){
        await getUserNames(page);
    }
}

const getUserNames = async (page) => {
    try{
        // page는 OP.GG의 순위표의 각 페이지를 말함
        console.log('=============== page#'+page+' 크롤링 시작! ===============');
        console.log(Date());
        const url = 'https://overwatch.op.gg/leaderboards/global/rank/' + page;
        console.log('GET '+url);
        const urlencoded = encodeURI(url);

        await axios.get(urlencoded, {
            origin: '',
            validateStatus: status => true,
        })
        .then(res => res.data)
        .then( async (body) => {
            const $ = cheerio.load(body);

            // 100 명의 유저 정보가 담긴 cheerio object 배열
            const userList = $('body').find('.l-container').find('#LeaderBoardsLayout')
                            .find('table > tbody').children();
            // 각각의 유저블록에 대해 이름 접근
            // promises는 데이터 수집이 정상적이든 비정상적이든 종료된 결과
            // name 또는 saved error of name 이 들어간다
            const cheerioObject = userList.map( async (i, el) => {
                const name = $(el).find('.ContentCell-Player').find('b').text();
                const result = await findUsersAtHomepage(name);
                return new Promise((resolve) => {
                    resolve(result);
                })
            })
            const promises = cheerioObject.toArray();
            await Promise.all(promises);
        })
        console.log('=============== page#'+page+' 크롤링 완료! ===============');
        console.log(Date());
        return new Promise((resolve) => {
            resolve(true);
        })
    }
    catch(error){
        console.log('async/await error: '+error);
    }
    
}

const findUsersAtHomepage = async (name) => {
    const token = 'KR6Q1Kx3Fs16Y26GD0jcknmbjqnDZZcjeh';
    const url = 'https://playoverwatch.com/search/account-by-name/'+name
                +'?access_token='+token;
    const urlencoded = encodeURI(url);

    const result = await axios.get(urlencoded, {
        origin: '',
        validateStatus: status => true,
    })
    .then(res => res.data)
    .then(async data => {
        if(data.error){
            const newError = new Error();
            newError.message = `${name} - ${data.error}`;
            newError.save( (err) => {
                if(err) {
                    return err;
                }
                console.log('saved error of '+name+': '+data.error);
                return 'saved error of '+name+': '+data.error;
            });
        }
        else{
            // promises는 fetch여부에 따라 true 또는 false가 들어간다
            const promises = await data.map( async (el) => {
                // 만약 그 유저가 공개유저라면 저장
                if(el.isPublic == true){
                    const token = el.name.split('#');
                    const _name = token[0]; // 대소문자 구분위해 이름 새로 저장
                    const tag = token[1];

                    // 먼저 중복 여부 검사
                    User.findOne({ name: _name, tag: tag }, (err, user) => {
                        if(err) return false;
                        if(user){
                            console.log(`${_name}#${tag} 유저가 DB에 존재하여 넘어갑니다...`);
                            return true;
                        }
                    })

                    // 유저 데이터를 playoverwatch.com 으로부터 긁어온다
                    const userInfo = await FetchManager.fetchData(_name, tag, el.level);
                    // 만약 오류가 발생하였다면, 그러나 이미 공개 유저이므로 비공개, 검색 실패 오류는 배제한다
                    if(typeof userInfo == 'number'){
                        const newError = new Error();
                        newError.name = _name;
                        newError.tag = tag;
                        switch(userInfo){
                            case FetchManager.ERROR_RESULT.PROFILE_NOT_FOUND: {
                                newError.message = '프로필을 찾을 수 없습니다. 닉네임과 배틀태그를 확인해 주세요';
                                break;
                            }
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
                            case FetchManager.ERROR_RESULT.PRIVATE_USER:{
                                newError.message = "비공개 사용자 입니다. 오버워치 인게임 [설정> 소셜> 프로필 공개설정] 에서 '공개'로 설정하셔야 전적 확인이 가능 합니다";
                                break;
                            }
                            case FetchManager.ERROR_RESULT.TCP_CONNECTION_ERROR: {
                                newError.message = "TCP CONNECTION CLOSED";
                                break;
                            }
                            case FetchManager.ERROR_RESULT.UNKNOWN_ERROR: {
                                newError.message = '알 수 없는 오류';
                                break;
                            }
                            default: {
                                newError.message = userInfo;
                                break;
                            }
                        }
                        Error.find({ name: _name, tag: tag }, (err, errorDoc) => {
                            if(err) return new Promise((resolve) => resolve(err));
                            if(!errorDoc){
                                newError.save( (err) => {
                                    if(err){
                                        console.log(err);
                                        return new Promise((resolve) => {
                                            resolve(err);
                                        });
                                    }
                                    console.log(_name+'#'+tag+'의 데이터를 가져오는데 발생한 에러를 기록했습니다...');
                                    return new Promise((resolve) => {
                                        resolve(false);
                                    });
                                });      
                            }
                        })
                    }
                    // 정상적으로 긁어왔다면 DB에 저장한다
                    else{
                        userInfo.save( (err) => {
                            if(err){
                                console.log(err);
                                return new Promise((resolve) => {
                                    resolve(err);
                                });
                            }
                            console.log(_name+'#'+tag+' 의 데이터를 성공적으로 저장했습니다!');
                            return new Promise((resolve) => {
                                resolve(true);
                            });
                        });          
                    }
                }   // 비공개 유저는 무시한다
            });  // end of data.forEach()
            await Promise.all(promises);
            console.log(`이름이 <${name}>인 유저들의 데이터 수집이 완료되었습니다...`);
            return name;
        }   // end of data.error check
    }) // end of then(data=> {})
    .catch((error) => {
        return error;
    });
    return new Promise( (resolve) => {
        resolve(result);
    });
}

/*( async () => {
    console.log('Genesis data ...');
    await genesisData();
    console.log('Done');
})();*/

/*( async () => {
    const promises = [];
    const url = 'https://overwatch.op.gg/leaderboards/global/rank/1';
    const urlencoded = encodeURI(url);
    console.log('Start');
    await axios.get(urlencoded, {
        origin: '',
        validateStatus: status => true,
    })
    .then(res => res.data)
    .then( async (body) => {
        const $ = cheerio.load(body);

        // 100 명의 유저 정보가 담긴 cheerio object 배열
        const userList = $('body').find('.l-container').find('#LeaderBoardsLayout')
                        .find('table > tbody').children();
        userList.each((i, el) => {
            promises.push($(el).find('.ContentCell-Player').find('b').text());
        });
        //await Promise.all(promises);
        console.log(promises);
    });
    console.log('Done');
})();*/