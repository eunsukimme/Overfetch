const cheerio = require('cheerio');
const axios = require('axios');
const User = require('../models/user');

const ERROR_RESULT = {
    PROFILE_NOT_FOUND: 1,
    INTERNALL_SERVER_ERROR: 2,
    REQUEST_FAILED: 3,
    API_SERVER_ERROR: 4,
    UNKNOWN_ERROR: 5
}

const fetchData = async (_name, _tag) => {

    //const cors = 'https://cors-anywhere.herokuapp.com/';
    const url = /*cors +*/ 'https://playoverwatch.com/ko-kr/career/pc/'
        +_name+'-'+_tag;
    const urlencoded = encodeURI(url);

    const result = await axios.get(urlencoded, 
    {
        origin: ''
    })
    .then(res => res.data)
    .then(body => {
        console.log('fetching data ...');
        const $ = cheerio.load(body);
        // 만약 유저 프로필을 찾았다면 body의 클래스는 career-detail 이다
        // 만약 유저 프로필을 못 찾았다면 body의 클래스는 ErrorPage 이다
        if($('body').attr('class').includes('ErrorPage')){
            return ERROR_RESULT.PROFILE_NOT_FOUND;//res.status(404).json({ error: '프로필을 찾을 수 없습니다. 닉네임과 배틀태그를 확인해 주세요' });
        }
        // 블리자드 내부 서버 오류로 인해 안 보여지는 경우
        // table 내에 h5 내용이 'overwatch.page.career.stats.undefined' 이다
        if($('body').find('.card-stat-block > table').find('h5').text().includes('overwatch.page.career.stats.undefined')){
            return ERROR_RESULT.INTERNALL_SERVER_ERROR//res.status(404).json({ error: '블리자드 내부 서버 오류로 프로필을 찾을 수 없습니다. 잠시 뒤 시도하세요' });
        }
    
        // 사용자 게임 데이터 생성
        const userInfo = new User();
        let _quick_play = {};
        let _rank_play = {};

        /* 크롤링 시작 */
        // 유저 랭크 가져옴
        const _rank = $('.masthead-player-progression').
        find('.competitive-rank > div').html();
        console.log('해당 유저 랭크: ', _rank);
        
        // 빠른대전 상위영웅 정보 가져옴
        const _quickplay_most_champion =  getQuickPlayData($);
        _quick_play['mostChampion'] = _quickplay_most_champion;
        // 빠른대전 통계 정보 가져옴
        // TODO

        // 경쟁전 상위영웅 정보 가져옴
        const _rankplay_most_champion =  getRankPlayData($);
        _rank_play['mostChampion'] = _rankplay_most_champion;
        // 경쟁전 통계 정보 가져옴
        // TODO

        // 크롤링 데이터를 DB 스키마에 저장
        userInfo.quickplay = _quick_play;
        userInfo.rankplay = _rank_play;
        userInfo.name = _name;
        userInfo.tag = _tag;
        userInfo.rank = _rank;
        console.log('유저정보 수집 완료. API 서버에게 넘겨준다');
        return userInfo;
    })
    .catch((error) => {
        if(error.response){
            console.log('에러 response 필드');
            console.log(error.response.data);
            console.log(error.resopnse.status);
            console.log(error.response.headers);
            return ERROR_RESULT.API_SERVER_ERROR;
        }
        else if(error.request){
            console.log('에러 request 필드');
            console.log(error.request);
            return ERROR_RESULT.REQUEST_FAILED;
        }
        else{
            console.log('Error', error.message);
            return ERROR_RESULT.UNKNOWN_ERROR;
        }
        console.log(error.config);
    });

    return new Promise( (resolve) => {
        resolve(result);
    })
}

const getQuickPlayData = (_$) => {
    console.log('fetching quickplay data...');
    const $ = _$;

    // 빠른대전 정보 크롤링 시작
    // 빠른대전 상위영웅에 해당되는 오브젝트 생성
    const _most_champion = {};
    
    const quickplay_list = $('#quickplay').find($('hr')).nextUntil('button', '.progress-category');

    quickplay_list.each( (i, el) => {
        let category;
        let category_result = {};
        /// data-category-id ///
        switch(i){
            case 0: // 0x0860000000000021 = 플레이시간
                category = 'byPlaytime'; break;
            case 1: // 0x0860000000000039 = 승리한 게임
                category = 'byWinGame'; break;
            case 2: // 0x086000000000002F = 명중률
                category = 'byHitRate'; break;
            case 3: // 0x08600000000003D2 = 목숨당 처치
                category = 'byKD'; break;
            case 4: // 0x08600000000003E2 = 치명타 명중률
                category = 'byCriticalHitRate'; break;
            case 5: // 0x0860000000000346 = 동시 처치
                category = 'byMultiKill'; break;
            case 6: // 0x086000000000031C = 임무 기여 처치
                category = 'byMissionContributeKill'; break;
        }
        $(el).find('.ProgressBar').each( (i, el) =>{
            let championName = $(el).find('div > div').find('.ProgressBar-title').text();
            // 챔피언 이름이 D.Va 인 경우 '.'이 들어가면 안됨. '-'으로 변경
            if(championName == "D.Va") championName = 'D-Va';
            const championValue = $(el).find('div > div').find('.ProgressBar-description').text();
            category_result[championName] = championValue;
        });
        _most_champion[category] = category_result;
    });
    console.log('quickplay data 수집 완료');
    return _most_champion;
}

const getRankPlayData = (_$) => {
    console.log('fetch rankplay data...');
    const $ = _$;

    // 빠른대전 정보 크롤링 시작
    // 빠른대전 상위영웅에 해당되는 오브젝트 생성
    const _most_champion = {};
    
    const competitive_list = $('#competitive').find($('hr')).nextUntil('button', '.progress-category');

    competitive_list.each( (i, el) => {
        let category;
        let category_result = {};
        /// data-category-id ///
        switch(i){
            case 0: // 0x0860000000000021 = 플레이시간
                category = 'byPlaytime'; break;
            case 1: // 0x0860000000000039 = 승리한 게임
                category = 'byWinGame'; break;
            case 2: // 0x086000000000002F = 명중률
                category = 'byHitRate'; break;
            case 3: // 승률 -> 경쟁전에만 추가됨
                category = 'byWinRate'; break;
            case 4: // 0x08600000000003D2 = 목숨당 처치
                category = 'byKD'; break;
            case 5: // 0x08600000000003E2 = 치명타 명중률
                category = 'byCriticalHitRate'; break;
            case 6: // 0x0860000000000346 = 동시 처치
                category = 'byMultiKill'; break;
            case 7: // 0x086000000000031C = 임무 기여 처치
                category = 'byMissionContributeKill'; break;
        }
        $(el).find('.ProgressBar').each( (i, el) =>{
            let championName = $(el).find('div > div').find('.ProgressBar-title').text();
            // 챔피언 이름이 D.Va 인 경우 '.'이 들어가면 안됨. '-'으로 변경
            if(championName == "D.Va") championName = 'D-Va';
            const championValue = $(el).find('div > div').find('.ProgressBar-description').text();
            category_result[championName] = championValue;
        });
        _most_champion[category] = category_result;
    });
    console.log('rankplay data 수집완료');
    return _most_champion;
}

module.exports = { fetchData, ERROR_RESULT };