const cheerio = require("cheerio");
const axios = require("axios");
const User = require("../models/user");
const mongoose = require("mongoose");
const token = "KR6Q1Kx3Fs16Y26GD0jcknmbjqnDZZcjeh";

const ERROR_RESULT = {
  PROFILE_NOT_FOUND: -1,
  INTERNALL_SERVER_ERROR: -2,
  REQUEST_FAILED: -3,
  API_SERVER_ERROR: -4,
  PRIVATE_USER: -5,
  TCP_CONNECTION_ERROR: -6,
  UNKNOWN_ERROR: -7,
  DATABASE_ERROR: -8
};

const CHAMPION_DROPDOWN_VALUE = {
  "0x02E00000FFFFFFFF": "모든영웅",
  "0x02E000000000013B": "아나",
  "0x02E0000000000200": "애쉬",
  "0x02E0000000000015": "바스티온",
  "0x02E0000000000221": "바티스트",
  "0x02E0000000000195": "브리기테",
  "0x02E000000000007A": "D-Va",
  "0x02E000000000012F": "둠피스트",
  "0x02E0000000000029": "겐지",
  "0x02E0000000000005": "한조",
  "0x02E0000000000065": "정크랫",
  "0x02E0000000000079": "루시우",
  "0x02E0000000000042": "맥크리",
  "0x02E00000000000DD": "메이",
  "0x02E0000000000004": "메르시",
  "0x02E00000000001A2": "모이라",
  "0x02E000000000013E": "오리사",
  "0x02E0000000000008": "파라",
  "0x02E0000000000002": "리퍼",
  "0x02E0000000000007": "라인하르트",
  "0x02E0000000000040": "로드호그",
  "0x02E000000000006E": "솔저",
  "0x02E000000000012E": "솜브라",
  "0x02E0000000000016": "시메트라",
  "0x02E0000000000006": "토르비욘",
  "0x02E0000000000003": "트레이서",
  "0x02E000000000000A": "위도우메이커",
  "0x02E0000000000009": "윈스턴",
  "0x02E00000000001CA": "레킹볼",
  "0x02E0000000000068": "자리야",
  "0x02E0000000000020": "젠야타",
  "0x02E000000000023B": "시그마"
};

const getLevel = async (_name, _tag) => {
  /* 레벨 정보 가져오기 */
  let url =
    "https://playoverwatch.com/ko-kr/search/account-by-name/" +
    _name +
    "?access_token=" +
    token;
  let urlencoded = encodeURI(url);
  const users = await axios
    .get(urlencoded, {
      origin: "",
      validateStatus: status => true
    })
    .then(res => res.data)
    .catch(error => {
      if (error in ERROR_RESULT) {
        return error;
      } else if (error.response) {
        console.log("에러 response 필드");
        console.log(error.response.data);
        console.log(error.resopnse.status);
        console.log(error.response.headers);
        return ERROR_RESULT.API_SERVER_ERROR;
      } else if (error.request) {
        console.log("에러 request 필드");
        console.log(error.request);
        return ERROR_RESULT.REQUEST_FAILED;
      } else {
        console.log("Error", error.message);
        return ERROR_RESULT.UNKNOWN_ERROR;
      }
    });
  // 만약 users가 에러라면 바로 리턴한다
  if (users.error) {
    return "INTERNALL_SERVER_ERROR";
  }
  // users를 순회하면서 _tag와 일치하는 유처를 찾는다
  let level = "PROFILE_NOT_FOUND";
  await users.some(user => {
    // tag에 해당하는 유저 찾았으면
    user.name.includes(_tag)
      ? // 만약 그 유저가 공개라면
        user.isPublic === true
        ? (level = user.level) // level 정보를 가져온다
        : (level = "PRIVATE_USER") // 그렇지 않으면 비공개 유저이다
      : undefined;

    // tag에 해당하는 유저 찾으면 바로 종료
    return user.name.includes(_tag);
  });

  console.log(`level of ${_name}#${_tag}: ${level}`);
  return new Promise(resolve => {
    resolve(level);
  });
};

const CheckError = $ => {
  // 만약 유저 프로필을 찾았다면 body의 클래스는 career-detail 이다
  // 만약 유저 프로필을 못 찾았다면 body의 클래스는 ErrorPage 이다
  return $("body")
    .attr("class")
    .includes("ErrorPage")
    ? ERROR_RESULT.PROFILE_NOT_FOUND
    : // 블리자드 내부 서버 오류로 인해 안 보여지는 경우
    // table 내에 h5 내용이 'overwatch.page.career.stats.undefined' 이다
    $("body")
        .find(".card-stat-block > table")
        .find("h5")
        .text()
        .includes("overwatch.page.career.stats.undefined")
    ? ERROR_RESULT.INTERNALL_SERVER_ERROR
    : // 만약 사용자의 프로필이 비공개인 경우
    // 클래스가 masthead-permission-level-text 인 p 태그의 내용은 '비공개 프로필' 이다.
    $("body")
        .find(".masthead-permission-level-text")
        .text()
        .includes("비공개")
    ? ERROR_RESULT.PRIVATE_USER
    : true;
};

const fetchData = async (_name, _tag, _level = undefined) => {
  // level이 주어지지 않으면 가져온다
  if (_level == undefined) {
    _level = await getLevel(_name, _tag);
    // level을 가져오는 중 오류가 발생하였다면 그대로 돌려준다
    if (_level in ERROR_RESULT) {
      return ERROR_RESULT[_level];
    }
  }
  const url = "https://playoverwatch.com/ko-kr/career/pc/" + _name + "-" + _tag;
  const urlencoded = encodeURI(url);
  const userData = await axios
    .get(urlencoded, {
      origin: "",
      validateStatus: status => true
    })
    .then(res => res.data)
    .catch(error => {
      if (error in ERROR_RESULT) {
        return ERROR_RESULT[error];
      }
      if (error.response) {
        console.log("에러 response 필드");
        console.log(error.response.data);
        console.log(error.resopnse.status);
        console.log(error.response.headers);
        return ERROR_RESULT.API_SERVER_ERROR;
      } else if (error.request) {
        console.log("에러 request 필드");
        console.log(error.request);
        return ERROR_RESULT.REQUEST_FAILED;
      } else {
        console.log("Error", error.message);
        return ERROR_RESULT.UNKNOWN_ERROR;
      }
    });
  console.log(_name + "#" + _tag + " 의 전적을 가져오는 중...");
  const $ = cheerio.load(userData);

  // 먼저 ERROR_RESULT 에 포함되는지 확인한다
  const checkError = CheckError($);
  if (checkError in ERROR_RESULT) {
    return ERROR_RESULT[checkError];
  }

  // 사용자 게임 데이터 생성
  const userInfo = new User();

  /* 크롤링 시작 */
  // 유저 랭크 가져옴
  const _rank = $(".masthead-player-progression")
    .find(".competitive-rank-level")
    .first()
    .text();
  // 유저 아이콘 링크 가져옴
  const _icon = $(".masthead-player")
    .find("img")
    .attr("src");

  // 빠른대전 정보 가져옴
  const _quick_play = await getQuickPlayData($);

  // 경쟁전 정보 가져옴
  const _rank_play = await getRankPlayData($);

  // 크롤링 데이터를 DB 스키마에 저장
  userInfo.quickplay = _quick_play;
  userInfo.rankplay = _rank_play;
  userInfo.name = _name;
  userInfo.tag = _tag;
  userInfo.icon = _icon;
  let rank = {};
  rank.val = _rank;
  userInfo.rank = rank;
  userInfo.level = _level;
  userInfo.update = new Date().toString();
  console.log(_name + "#" + _tag + " 의 전적 수집 완료");
  return userInfo;
};

const makeValueNumeric = async championValue => {
  /* non-numeric value들(시간, 백분율)을 numeric value로 바꿔준다 */
  // 1. 시간 (00:00:00) 값을 초(sec)으로 합산한 값을 저장한다(1분 = 60초, 1시간 = 60분 = 3600초)
  //    즉, ':'로 값들을 파싱한 후 시간 값에 3600을 곱한 값과 분 값에 60을 곱한 값과 초 값을 모두 더한 값을 저장
  if (championValue.includes(":")) {
    championValue = await convertTimeToSec(championValue);
  }
  // 2. 백분율 (00%)값을 순수 정수 값으로 바꿔준다
  //    즉, %를 제거하고 number로 바꿔준다
  else if (championValue.includes("%")) {
    const percentage = championValue.split("%");
    championValue = percentage[0];
  }
  // 이 외에 값은 모두 일반 정수의 스트링 표현이므로 Number 래퍼를 씌워서 정수로 바꿔준다
  championValue = Number(championValue);
  return new Promise(resolve => {
    resolve(championValue);
  });
};

const convertTimeToSec = time => {
  let totalSec = 0;
  const times = time.split(":");
  // 1시간 이상이라면 00:00:00 형태고, 1시간 미만은 00:00 형태로 저장됨
  // 즉, times의 length가 3이라면 1시간 이상이고 2라면 1시간 미만이다
  if (times.length == 3) {
    const hour = Number(times[0]);
    const min = Number(times[1]);
    const sec = Number(times[2]);
    totalSec = hour * 3600 + min * 60 + sec;
  } else {
    const min = Number(times[0]);
    const sec = Number(times[1]);
    totalSec = min * 60 + sec;
  }
  return new Promise(resolve => {
    resolve(totalSec);
  });
};

const getQuickPlayData = async _$ => {
  //console.log('fetching quickplay data...');
  const $ = _$;

  // 빠른대전 정보 크롤링 시작
  let _quickplay = {};
  // 빠른대전 상위영웅에 해당되는 오브젝트 생성
  let _most_champion = {};
  // 빠른대전 Stats를 저장하는 오브젝트 생성
  let _quickplay_record = {};

  // 빠른대전 상위영웅 크롤링 시작
  const quickplay_list = $("#quickplay")
    .find($("hr"))
    .nextUntil("button", ".progress-category");

  quickplay_list.each((i, el) => {
    let category;
    let category_result = {};
    /// data-category-id ///
    switch (i) {
      case 0: // 0x0860000000000021 = 플레이시간
        category = "byPlaytime";
        break;
      case 1: // 0x0860000000000039 = 승리한 게임
        category = "byWinGame";
        break;
      case 2: // 0x086000000000002F = 명중률
        category = "byHitRate";
        break;
      case 3: // 0x08600000000003D2 = 목숨당 처치
        category = "byKD";
        break;
      case 4: // 0x08600000000003E2 = 치명타 명중률
        category = "byCriticalHitRate";
        break;
      case 5: // 0x0860000000000346 = 동시 처치
        category = "byMultiKill";
        break;
      case 6: // 0x086000000000031C = 임무 기여 처치
        category = "byMissionContributeKill";
        break;
    }
    $(el)
      .find(".ProgressBar")
      .each(async (i, el) => {
        let championName = $(el)
          .find("div > div")
          .find(".ProgressBar-title")
          .text();
        // 챔피언 이름이 D.Va 인 경우 '.'이 들어가면 안됨. '-'으로 변경
        if (championName == "D.Va") championName = "D-Va";
        if (championName == "솔저: 76") championName = "솔저";
        let championValue = $(el)
          .find("div > div")
          .find(".ProgressBar-description")
          .text();
        // 시간과 백분율, 스트링 값들을 다 numeric하게 바꿔준다(DB aggregation을 위하여)
        championValue = await makeValueNumeric(championValue);
        category_result[championName] = championValue;
      });
    _most_champion[category] = category_result;
  });
  _quickplay["mostChampion"] = _most_champion;
  //console.log('quickplay most champion data 수집 완료');

  // 빠른대전 Stats 크롤링 시작
  const quickplay_allStats = $("#quickplay")
    .find("section")
    .next()
    .find("hr")
    .nextAll();

  quickplay_allStats.each((i, el) => {
    const category_id = $(el).data("category-id");
    const table = $(el).children();
    const stats = {};
    table.each((i, el) => {
      const title = $(el)
        .find("table > thead")
        .text();
      const body = $(el)
        .find("table > tbody")
        .children();
      const title_table = {};
      body.each(async (i, el) => {
        const key = $(el)
          .find("td")
          .first()
          .text();
        let value = $(el)
          .find("td")
          .next()
          .text();
        value = await makeValueNumeric(value);
        title_table[key] = value;
      });
      stats[title] = title_table;
    });
    _quickplay_record[CHAMPION_DROPDOWN_VALUE[category_id]] = stats;
  });
  _quickplay["record"] = _quickplay_record;
  //console.log('quickplay record data 수집 완료');

  return _quickplay;
};

const getRankPlayData = async _$ => {
  //console.log('fetch rankplay data...');
  const $ = _$;

  // 경쟁전 정보 크롤링 시작
  let _rankplay = {};
  // 경쟁전 상위영웅에 해당되는 오브젝트 생성
  let _most_champion = {};
  // 경쟁전 Stats를 저장하는 오브젝트 생성
  let _rankplay_record = {};

  const competitive_list = $("#competitive")
    .find($("hr"))
    .nextUntil("button", ".progress-category");

  competitive_list.each((i, el) => {
    let category;
    let category_result = {};
    /// data-category-id ///
    switch (i) {
      case 0: // 0x0860000000000021 = 플레이시간
        category = "byPlaytime";
        break;
      case 1: // 0x0860000000000039 = 승리한 게임
        category = "byWinGame";
        break;
      case 2: // 0x086000000000002F = 명중률
        category = "byHitRate";
        break;
      case 3: // 승률 -> 경쟁전에만 추가됨
        category = "byWinRate";
        break;
      case 4: // 0x08600000000003D2 = 목숨당 처치
        category = "byKD";
        break;
      case 5: // 0x08600000000003E2 = 치명타 명중률
        category = "byCriticalHitRate";
        break;
      case 6: // 0x0860000000000346 = 동시 처치
        category = "byMultiKill";
        break;
      case 7: // 0x086000000000031C = 임무 기여 처치
        category = "byMissionContributeKill";
        break;
    }
    $(el)
      .find(".ProgressBar")
      .each(async (i, el) => {
        let championName = $(el)
          .find("div > div")
          .find(".ProgressBar-title")
          .text();
        // 챔피언 이름이 D.Va 인 경우 '.'이 들어가면 안됨. '-'으로 변경
        if (championName == "D.Va") championName = "D-Va";
        if (championName == "솔저: 76") championName = "솔저";
        let championValue = $(el)
          .find("div > div")
          .find(".ProgressBar-description")
          .text();
        championValue = await makeValueNumeric(championValue);
        category_result[championName] = championValue;
      });
    _most_champion[category] = category_result;
  });
  _rankplay["mostChampion"] = _most_champion;
  //console.log('rankplay most champion data 수집 완료');

  // 경쟁전 Stats 크롤링 시작
  const rankplay_allStats = $("#competitive")
    .find("section")
    .next()
    .find("hr")
    .nextAll();

  rankplay_allStats.each((i, el) => {
    const category_id = $(el).data("category-id");
    const table = $(el).children();
    const stats = {};
    table.each((i, el) => {
      const title = $(el)
        .find("table > thead")
        .text();
      const body = $(el)
        .find("table > tbody")
        .children();
      const title_table = {};
      body.each(async (i, el) => {
        const key = $(el)
          .find("td")
          .first()
          .text();
        let value = $(el)
          .find("td")
          .next()
          .text();
        value = await makeValueNumeric(value);
        title_table[key] = value;
      });
      stats[title] = title_table;
    });
    _rankplay_record[CHAMPION_DROPDOWN_VALUE[category_id]] = stats;
  });
  _rankplay["record"] = _rankplay_record;
  //console.log('rankplay reocrd data 수집 완료');

  return _rankplay;
};

module.exports = { fetchData, ERROR_RESULT };
