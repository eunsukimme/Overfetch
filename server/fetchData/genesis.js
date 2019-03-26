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

const genesisData = async () => {
    let page = 1;
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
        .find('table > tbody');
        console.log(userList);

    })
    return new Promise( (resolve) => {
        resolve(result);
    })
}

module.exports = { genesisData };