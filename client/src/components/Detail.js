import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Champion } from "./champion/Champion";
import "./css/detail/detail.css";
import "./css/detail/user-detail-top.css";
import "./css/detail/user-detail-chart.css";
import "./css/detail/user-champions.css";
import * as d3 from "d3";
import { colorbrewer } from "../lib/colorbrewer";
import styled from "styled-components";

const TopButton = styled.button`
  display: none;
  position: fixed;
  bottom: 50px;
  right: 50px;
  background-color: white;
  color: black;
  z-index: 99;
  width: 50px;
  height: 50px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  :hover {
    border: 1px solid white;
    background-color: #222222;
    color: white;
    transition-duration: 0.5s;
  }
`;

const GenerateRankIcon = rank => {
  return rank < 1500
    ? "Bronze"
    : rank < 2000
    ? "Silver"
    : rank < 2500
    ? "Gold"
    : rank < 3000
    ? "Platinum"
    : rank < 3500
    ? "Diamond"
    : rank < 4000
    ? "Master"
    : rank < 5000
    ? "Grandmaster"
    : undefined;
};

export class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      champions: {},
      loading: false,
      error: false,
      buttons: [],
      championComponents: {},
      diff_time: "",
      most: [],
      mostComponents: [],
      chartName: "user-detail-play"
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  /**
   *
   * @param {한글 챔피언 이름} name
   * @dev 주어진 한글 챔피언 이름을 영어로 변환한다
   */
  convertChampionName(name) {
    if (name === "아나") return "ana";
    else if (name === "애쉬") return "ashe";
    else if (name === "바티스트") return "baptiste";
    else if (name === "바스티온") return "bastion";
    else if (name === "브리기테") return "brigitte";
    else if (name === "D-Va") return "dva";
    else if (name === "둠피스트") return "doomfist";
    else if (name === "겐지") return "genji";
    else if (name === "한조") return "hanzo";
    else if (name === "정크랫") return "junkrat";
    else if (name === "루시우") return "lucio";
    else if (name === "맥크리") return "mccree";
    else if (name === "메이") return "mei";
    else if (name === "메르시") return "mercy";
    else if (name === "모이라") return "moira";
    else if (name === "오리사") return "orisa";
    else if (name === "파라") return "pharah";
    else if (name === "리퍼") return "reaper";
    else if (name === "라인하르트") return "reinhardt";
    else if (name === "로드호그") return "roadhog";
    else if (name === "솔저") return "soldier-76";
    else if (name === "솜브라") return "sombra";
    else if (name === "시메트라") return "symmetra";
    else if (name === "토르비욘") return "torbjorn";
    else if (name === "트레이서") return "tracer";
    else if (name === "위도우메이커") return "widowmaker";
    else if (name === "윈스턴") return "winston";
    else if (name === "레킹볼") return "wrecking-ball";
    else if (name === "자리야") return "zarya";
    else if (name === "젠야타") return "zenyatta";
    else if (name === "시그마") return "sigma";
  }

  /**
   * @dev 컴포넌트 마운트 시 실행
   */
  async componentDidMount() {
    this.scrollToTop();
    // 스크롤 함수 바인딩
    window.addEventListener("scroll", this.handleScroll);
    await this.fetchData();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  /**
   * @dev 사용자의 게임 데이터를 가져온다
   */
  async fetchData() {
    // 영웅별 통계
    await this.getChampionRecord();
    // 모스트 챔피언
    await this.getMostRecord();
    // 플레이 통계(파이 차트)
    await this.getPlaytimeRecord();
    await this.getWinGameRecord();
    await this.getHitRateRecord();
    await this.getWinRateRecord();
    await this.getKDRecord();
    await this.getCriticalHitRateRecord();
    await this.getMultiKillRecord();
    await this.getMissionContributeKill();
    return new Promise(resolve => {
      resolve(true);
    });
  }

  /**
   * @dev 영웅별 통계를 가져오고, 컴포넌트를 생성해서 state 에 할당한다
   */
  async getChampionRecord() {
    this.setState({ loading: true });

    // 유저의 경쟁전 플레이 영웅이름을 가져온다
    const heros = Object.keys(this.props.data.rankplay.record);
    const except = heros.indexOf("모든영웅");
    heros.splice(except, 1); // 모든영웅 필드 제거

    // 경쟁전 플레이 영웅별로 시각화할 레코드를 가져온다
    const result = await heros.map(async hero => {
      // 해당 영웅의 플레이 정보(영웅별)가 존재하지 않거나
      // 치른 게임 수가 0 이라면 해당 레코드는 가져오지 않는다
      let play = this.props.data.rankplay.record[hero].게임["치른 게임"];
      let champion_info = this.props.data.rankplay.record[hero].영웅별;
      if (play === 0 || champion_info === undefined) {
        return;
      }

      // 존재하는 각 영웅이름 의 레코드를 가져온다
      // 이때, 랭크 정보가 포함되지 않은 유저는 전 랭크에 대해서 가져온다
      let rankInfo;
      if (
        this.props.data.rank.val === undefined ||
        this.props.data.rank.val === null
      ) {
        rankInfo = "alltier";
      } else {
        rankInfo = this.props.data.rank.val;
      }
      const url = "/api/avg/rankplay/champion/" + hero + "?rank=" + rankInfo;
      const result = await fetch(url)
        .then(res => res.json())
        .then(data => {
          this.setState(prevState => ({
            champions: {
              ...prevState.champions,
              [hero]: hero
            }
          }));

          this.setState(prevState => ({
            championComponents: {
              ...prevState.championComponents,
              [hero]: (
                <Champion
                  championName={hero}
                  userData={this.props.data}
                  championData={data}
                />
              )
            }
          }));

          return new Promise(resolve => {
            resolve(true);
          });
        })
        .catch(error => {
          //this.setState({ error: true });
          console.log(error);
          return new Promise(resolve => {
            resolve(false);
          });
        });
      return new Promise(resolve => {
        resolve(result);
      });
    });
    await Promise.all(result);
    this.setState({ loading: false });

    // 각 영웅별 아이콘을 공홈으로부터 가져온다
    const _buttons = Object.keys(this.state.champions).map(el => {
      const image_src = `https://d1u1mce87gyfbn.cloudfront.net/hero/${this.convertChampionName(
        el
      )}/icon-portrait.png`;
      return (
        <div className="champion-button" key={el}>
          <Link
            className="champion-button-link"
            to={`${this.props.match.url}/${el}`}
            //            onClick={this.scrollToChampionRef}
          >
            <img
              className="champion-button-image"
              src={image_src}
              alt={`${el}`}
            />
            <p>{el}</p>
          </Link>
        </div>
      );
    });
    this.setState({ buttons: _buttons });

    /* 현재 날짜와 최근 업데이트 시각을 비교한다 */
    const now = Date.now();
    const last_update = new Date(this.props.data.update).getTime();
    const diff_millisec = now - last_update;
    let diff_hour = diff_millisec / 1000 / 60 / 60;

    diff_hour = diff_hour.toFixed(0);

    this.setState({
      diff_time: diff_hour
    });

    return new Promise(resolve => {
      resolve(true);
    });
  }

  /**
   * @dev 모스트 통계를 가져오고 그래프를 그린다(Top3)
   */
  async getMostRecord() {
    const mosts = this.props.data.rankplay.mostChampion;
    // most_criteria는 모든 모스트 기준을 저장한다
    const most_criteria = Object.keys(mosts);

    const sorted = []; // 플레이 시간 기준 상위 챔피언을 순서대로 정렬해 저장하는 배열
    // 각 기준을 돌면서 플레이 시간 기준을 찾는다
    await most_criteria.some(el => {
      if (el === "byPlaytime") {
        // 해당하는 키(영웅이름)의 값(플레이시간)을 배열에 저장한다
        for (let key in mosts[el]) {
          sorted.push([key, mosts[el][key]]);
        }
        // 배열을 내림차순(큰 수가 앞에)으로 정렬
        sorted.sort(function(a, b) {
          return b[1] - a[1];
        });
      }
      // 순회 종료
      return el === "byPlaytime";
    });
    this.setState({
      most: sorted
    });

    // 스케일링을 위한 플레이 시간의 최소, 최대 값을 저장한다
    const minimum = sorted[sorted.length - 1][1];
    const maximum = sorted[0][1];
    const timeScale = d3
      .scaleLinear()
      .domain([minimum, maximum])
      .range([2, 68])
      .clamp(true);

    // 이제 state의 most 에는 플레이시간 별 상위 영웅이 저장되있음
    // 이 영웅들 중 앞 3 원소들의 데이터만 우리의 관심이 있다
    // 이미지, K/D 정보를 가져온다
    let limit = 3;
    // 만약 모스트가 3 보다 적다면 그 길이만큼 가져온다
    if (this.state.most.length < 3) limit = this.state.most.length;
    for (let i = 0; i < limit; i++) {
      const champion_name = this.state.most[i][0];
      const champion_playtime = this.state.most[i][1];

      // 이제 시간 값을 계산한다
      // champion-playtime 에 저장된 값은 플레이 시간 단위가 초(sec)이다
      // 이를 시간:분:초 로 표기하려면, 먼저 시간은 3600초(1분 * 60 = 60초 * 60 = 3600)
      // 즉 시간은 champion_playtime을 3600으로 나눈 몫이다
      // 그리고 분은 60초(1분 * 1 = 60 * 1 = 60)
      // 즉 시간으로 나눈 나머지를 다시 60으로 나눈 몫이다
      // 마지막으로 그 나머지가 초가 된다
      const hour = (champion_playtime / 3600).toFixed(0);
      const min = ((champion_playtime % 3600) / 60).toFixed(0);
      const sec = ((champion_playtime % 3600) % 60).toFixed(0);
      const playtime = {}; // prop으로 넘겨줄 시간 오브젝트
      playtime.hour = hour;
      playtime.min = min;
      playtime.sec = sec;

      // 이제 KD 값을 가져온다
      // 영웅의 KD 필드는 mostChampion -> byKD 필드에 존재한다
      const KD = this.props.data.rankplay.mostChampion.byKD[champion_name];

      // 마지막으로 이 모든 값을 그려준다
      // 먼저 svg 를 생성해준다
      const background_imageSrc = `../../../document/champion_profile/${this.convertChampionName(
        champion_name
      )}.PNG`;
      const most_graph = d3
        .select(".user-detail-most")
        .append("div")
        .attr("class", "svg-most-background")
        .style("background-image", `url(${background_imageSrc})`)
        .style("background-size", "100% 100%")
        .style("background-repeat", "no-repeat")
        .append("svg")
        .attr("id", `most_${i}`)
        .attr("class", "svg-most")
        .attr("width", "520px")
        .attr("height", "160px")
        .attr("display", "block")
        .style("border", "1px solid #444444");

      // 해당 svg 에 영웅 이름, KD, 플레이타임 정보를 넣어준다
      // 먼저 영웅 이름을 넣어준다
      most_graph
        .append("text")
        .attr("y", 60)
        .attr("x", 30)
        .attr("class", "text most-title")
        .html(champion_name);

      // KD 정보를 넣어준다
      // 색을 스케일링 해준다
      const colorQuantize = d3
        .scaleQuantize()
        .domain([0, 6])
        .range(colorbrewer.Oranges[3]);

      most_graph
        .append("text")
        .attr("y", 90)
        .attr("x", 30)
        .attr("class", "text most-kd")
        .style("fill", d => colorQuantize(KD))
        .html(`KD: ${KD}`);

      // playtime 정보를 넣어준다
      // 이때 playtime 은 막대 그래프를 포함하므로
      // g 태그를 먼저 넣어준다
      const most_graph_g = most_graph
        .append("g")
        .attr("class", "svg-most-g")
        .attr("transform", "translate(0, 130)");

      // 이 g 에다 text는 playtime을, 그래프로 이를 나타내준다
      most_graph_g
        .append("text")
        .attr("class", "text")
        .attr("x", 30)
        .html("Playtime: ");

      // g 에다 rect 로 그래프를 그려준다
      most_graph_g
        .append("rect")
        .attr("height", 16)
        .attr("x", 100)
        .attr("y", -14)
        .transition()
        .duration(1000)
        .attr("width", `${timeScale(champion_playtime)}%`)
        .style("fill", "#d65a31");

      // rect 옆에 텍스트로 플레이 시간을 나타내준다
      most_graph_g
        .append("text")
        .attr("class", "text")
        .attr("x", `${timeScale(champion_playtime) + 24}%`)
        .style("fill", "#d65a31")
        .html(d => {
          if (hour > 0) {
            return `${hour}h`;
          } else if (min > 0) {
            return `${min}m`;
          } else if (sec > 0) {
            return `${sec}s`;
          }
        });
    }
  }

  /**
   * @dev 주어진 이름의 챔피언이 어느 범주에 속하는지 체크한다
   */
  getChampionType(champion_name) {
    const tank = [
      "D-Va",
      "오리사",
      "라인하르트",
      "로드호그",
      "윈스턴",
      "레킹볼",
      "자리야",
      "시그마"
    ];
    const damage = [
      "애쉬",
      "바스티온",
      "둠피스트",
      "겐지",
      "한조",
      "정크랫",
      "맥크리",
      "메이",
      "파라",
      "리퍼",
      "솔저",
      "솜브라",
      "시메트라",
      "토르비욘",
      "트레이서",
      "위도우메이커"
    ];
    const support = [
      "아나",
      "바티스트",
      "브리기테",
      "루시우",
      "메르시",
      "모이라",
      "젠야타"
    ];
    // 챔피언

    if (tank.includes(champion_name)) return "tank";
    else if (damage.includes(champion_name)) return "damage";
    else if (support.includes(champion_name)) return "support";
    else {
      return -1;
    }
  }

  /**
   *
   * @param {차트를 그릴 기준 지표} criteria
   * @param {평균값 계산 여부} avg
   * @dev 어떠한 기준의 통계를 세 범주(돌격, 공격, 지원)로 나눈 뒤 값을 누적시킨다
   */
  async accumulateChampionValue(criteria, avg = false) {
    const keys = Object.keys(this.props.data.rankplay.mostChampion[criteria]);

    // 해당 영웅의 플레이 시간을 세 범주(돌격, 공격, 지원)로 나누어 저장한다
    let tank = 0;
    let tank_count = 0;
    let damage = 0;
    let damage_count = 0;
    let support = 0;
    let support_count = 0;

    const result = await keys.map(el => {
      const champion_name = el;
      const champion_value = this.props.data.rankplay.mostChampion[criteria][
        el
      ];
      const champion_type = this.getChampionType(champion_name);
      // 영웅의 타입에 해당하는 변수에 시간을 누적한다
      if (champion_type === "tank") {
        tank += champion_value;
        tank_count += 1;
      } else if (champion_type === "damage") {
        damage += champion_value;
        damage_count += 1;
      } else if (champion_type === "support") {
        support += champion_value;
        support_count += 1;
      } else {
        return -1;
      }

      return new Promise(resolve => {
        resolve(true);
      });
    });
    if (result.includes(-1)) {
      return -1;
    }
    await Promise.all(result);

    return new Promise(resolve => {
      if (avg === false) {
        resolve([tank, damage, support]);
      } else if (avg === true) {
        resolve([
          tank / tank_count,
          damage / damage_count,
          support / support_count
        ]);
      }
    });
  }

  /**
   *
   * @param {돌격 영웅 누적값} _tank
   * @param {공격 영웅 누적값} _damage
   * @param {지원 영웅 누적값} _support
   * @param {그림을 그릴 위치} where
   * @param {기준 지표} criteria
   * @dev 주어진 파라미터를 바탕으로 파이 차트를 그린다
   */
  createPieChart(_tank, _damage, _support, where, criteria) {
    const tank = _tank;
    const damage = _damage;
    const support = _support;

    // 범주의 값을 파이 차트로 나타낸다
    const width = 360;
    const height = 360;
    // 데이터 생성
    const data = [
      { name: "tank", value: tank, color: "#10316b" },
      { name: "damage", value: damage, color: "#d65a31" },
      { name: "support", value: support, color: "#0b8457" }
    ];
    // 중앙에 공간이 없고 반지름이 width의 절반인 호를 생성
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2);

    // 반지름이 width의 0.8 배이고 또한 중앙에 그만큼에 공간을 할당하여
    // 라벨이 위치할 호를 생성
    const arcLabel = (() => {
      const radius = (Math.min(width, height) / 2) * 0.7;
      return d3
        .arc()
        .innerRadius(radius)
        .outerRadius(radius);
    })();

    // 큰 값이 먼저 오도록 정렬하고, 그 값을 할당
    const pie = d3
      .pie()
      .sort((a, b) => b.value - a.value)
      .value(d => d.value);

    // 데이터를 기반으로 각도를 계산한다
    const arcs = pie(data);

    // svg를 그린다
    const svg = d3
      .select(`.user-detail-${where}`)
      .append("svg")
      .style("width", width)
      .style("height", height)
      .attr("text-anchor", "middle")
      .attr("class", `svg-${criteria}`);
    // text-anchor 텍스트의 정렬을 설정합니다 ( start | middle | end | inherit )

    // svg 안에 파이 차트를 그릴 g를 생성
    const g = svg
      .append("g")
      // 원을 중앙에 위치시키기 위해 g 태그를 이동시킨다
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // 위에서 데이터를 바탕으로 생성한 호를 path 의 데이터로 바인딩한다
    g.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      // 이전과 동일하게 가상 path 요소를 만들고 그래프 데이터와 매핑하여 엘리먼트를 추가합니다.
      .attr("fill", d => {
        return d.data.color;
      })
      // 다른 그래프와 다르게 .data 라는 객체가 추가되어 있는데, 위에 arcs 변수를 선언할때
      // .pie(data)가 {data, value, index, startAngle, endAngle, padAngle} 의 값을 가지고 있습니다.
      .attr("stroke", "black")
      .attr("d", arc)
      .append("title")
      .text(d => `${d.data.name}: ${d.data.value}`);

    const text = g
      .selectAll("text")
      .data(arcs)
      .enter()
      .append("text")
      // startAngle과 endAngle 사이에 text 요소를 넣어서 설명을 추가한다
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .attr("dy", "0.35em");

    // 먼저 범주 이름을 굵은 글씨로 추가한다
    // 각도가 0.1 이상인 것에 한해서만 제목을 추가한다
    text
      .filter(d => d.endAngle - d.startAngle > 0.1)
      .append("tspan")
      .attr("x", 0)
      .attr("y", "-0.7em")
      .style("font-size", "1.5rem")
      .style("font-weight", "bold")
      .text(d => d.data.name);

    // 그리고 각도가 0.25 이상인 것에 한해서(글씨가 들어갈 공간이 있는 것에서)
    // 플레이 시간을 나타낸다
    text
      .filter(d => d.endAngle - d.startAngle > 0.25)
      .append("tspan")
      .attr("x", 0)
      .attr("y", "0.7em")
      .attr("fill-opacity", 0.7)
      .attr("font-weight", "bold")
      .style("font-size", "1.2rem")
      .text(d => {
        if (criteria === "byPlaytime") {
          const hour = (d.value / 3600).toFixed(0);
          const min = ((d.value % 3600) / 60).toFixed(0);
          const sec = ((d.value % 3600) % 60).toFixed(0);
          if (hour > 0) return `${hour}h ${min}m ${sec}s`;
          else if (min > 0) return `${min}min ${sec}s`;
          else if (sec > 0) return `${sec}sec`;
        } else if (criteria === "byWinGame") {
          return d.value;
        } else if (criteria === "byHitRate") {
          return d.value.toFixed(1);
        } else if (criteria === "byWinRate") {
          return d.value.toFixed(1);
        } else if (criteria === "byKD") {
          return d.value.toFixed(2);
        } else if (criteria === "byCriticalHitRate") {
          return d.value.toFixed(1);
        } else if (criteria === "byMultiKill") {
          return d.value;
        } else if (criteria === "byMissionContributeKill") {
          return d.value;
        }
      });

    return new Promise(resolve => {
      resolve(true);
    });
  }

  /**
   *
   * @param {유저 랭크 구간} rank
   * @param {그림을 그릴 위치} where
   * @param {기준 지표} criteria
   */
  async createBarChart(rank, where, criteria) {
    const url = `/api/avg/rankplay/${where}?tier=${rank}`;

    let rate_info;
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        rate_info = data;
      })
      .catch(error => {
        return alert(
          "통계 정보를 가져오는 중 에러가 발생하였습니다. 잠시 뒤 시도하세요"
        );
      });

    // 반환된 값은 배열이다. 첫 번째 값을 참조하여 data에 접근한다
    rate_info = rate_info[0];

    // 승률 기준 모스트 챔피언 레코드의 키(영웅 이름)들을 가져온다
    const keys = Object.keys(this.props.data.rankplay.mostChampion[criteria]);
    // 각 영웅 이름들을 순회하면서 그래프를 그린다
    let max = 100;
    if (where === "kd") max = 5;
    const championYScale = d3
      .scaleLinear()
      .domain([0, max])
      .range([40, 360])
      .clamp(true);
    const width = 300;
    const height = 400;
    const bar_width = 50;

    // 먼저 svg 영역을 그려준다
    keys.map(el => {
      const my_val = this.props.data.rankplay.mostChampion[criteria][el];
      // 라인하르트, 브리기테, 모이라, 윈스턴은 명중률에 대한 정보가 존재하지 않는다
      // 이처럼 존재하지 않는 값에 대해 참조하면 오류가 발생하므로
      // 바로 리턴해버린다
      if (rate_info[el] === null) {
        return false;
      }
      // 또, 해당 기준에서 값이 0인 영웅은 의미 없으므로 포함시키지 않는다
      else if (my_val === 0) {
        return false;
      }
      // 마지막으로 해당 영웅의 플레이 수가 0이면 포함시키지 않는다
      else if (
        this.props.data.rankplay.record[el] === undefined ||
        this.props.data.rankplay.record[el].게임["치른 게임"] === 0
      ) {
        return false;
      }
      const avg = rate_info[el].toFixed(1);

      let percentage; // 상위 몇 % 인지를 나타내는 변수
      const topPercentageScale = d3
        .scaleLinear()
        .domain([max, avg])
        .range([1, 50])
        .clamp(true);
      const bottomPercentageScale = d3
        .scaleLinear()
        .domain([0, avg])
        .range([99, 49])
        .clamp(true);
      if (Number(my_val) < Number(avg)) {
        percentage = bottomPercentageScale(my_val);
      } else if (Number(my_val) >= Number(avg)) {
        percentage = topPercentageScale(my_val);
      }
      const dataSet = [[my_val, percentage], 0, avg, max];

      const svg = d3
        .select(`.user-detail-${where}`)
        .append("svg")
        .attr("class", `svg-${criteria}`)
        .attr("class", "bar-chart")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid lightgray");

      // svg 의 타이틀을 붙여준다. 여기서는 챔피언 이름이다
      svg
        .append("text")
        .attr("y", 24)
        .attr("class", "text chart-header")
        .html(el);

      // 치른 게임 횟수를 나타내준다
      svg
        .append("text")
        .attr("y", height - 30)
        .attr("class", "text")
        .html(() => {
          let play = this.props.data.rankplay.record[el].게임["치른 게임"];
          if (play === undefined || play === 0) {
            return `게임 수: 0`;
          }
          return `게임 수: ${play}`;
        });

      // svg 안에 g 를 그려준다
      const rate_g = svg.append("g").attr("class", `${where}-g`);

      // 해당 g 안에 레퍼런스 g와 그래프를 그릴 g 두개를 생성한다
      // 먼저 레퍼런스 g 를 그려준다
      const reference_g = rate_g
        .selectAll("g")
        .data(["플레이어", "최소", "평균", "최대"])
        .enter()
        .append("g")
        .attr("class", `${where}-reference-g`);
      reference_g
        .append("rect")
        .attr("width", 20)
        .attr("height", 5)
        .attr("y", (d, i) => height / 3 - 30 * i + 34)
        .style("fill", (d, i) => {
          if (i === 0) return "#10316b";
          else if (i === 1) return "#0b8457";
          else if (i === 2) return "#eac100";
          else if (i === 3) return "#d65a31";
        });
      reference_g
        .append("text")
        .attr("x", 25)
        .attr("y", (d, i) => height / 3 - 30 * i + 40)
        .attr("class", "text")
        .style("font-size", "14px")
        .html(d => d);

      // 이제 막대 영역을 그려준다
      const bar_g = rate_g
        .append("g")
        .attr("class", `${where}-chart-g`)
        .selectAll("g")
        .data(dataSet)
        .enter()
        .append("g")
        .attr("class", (d, i) => {
          if (i === 0) return "bar my_bar";
          return "bar";
        })
        .attr("transform", `translate(${width / 2 - bar_width / 2} , 0)`);

      // 각 g 에 막대 할당
      bar_g
        .append("rect")
        .attr("width", bar_width)
        .attr("y", (d, i) => {
          if (i === 0) {
            return height - championYScale(d[0]);
          }
          return height - championYScale(d);
        })
        .style("fill", (d, i) => {
          if (i === 0) return "#10316b";
          else if (i === 1) return "#0b8457";
          else if (i === 2) return "#eac100";
          else if (i === 3) return "#d65a31";
        })
        .transition()
        .duration(1500)
        .attr("height", (d, i) => {
          if (i === 0) {
            return championYScale(d[0]);
          }
          return 5;
        });

      // 각 bar 에 라벨(값) 생성
      bar_g
        .append("text")
        .text((d, i) => {
          if (i === 0) return d[0];
          return d;
        })
        .attr("y", (d, i) => {
          if (i === 0) return height - championYScale(d[0]) + 10;
          return height - championYScale(d) + 10;
        })
        .attr("x", (d, i) => {
          if (i === 0) {
            return -30;
          }
          return 60;
        })
        .attr("class", (d, i) => {
          if (i === 0) return "my_text text";
          return "text";
        })
        .style("text-anchor", "left");

      function mouseOver(d) {
        d3.select(this).style("stroke", "white");

        if (typeof d === "object" && d[1] !== undefined) {
          const per = d[1].toFixed(0);

          d3.select(this.parentNode)
            .append("text")
            .attr("class", "text modal")
            .attr("x", -70)
            .attr("y", 320)
            .html(`상위 ${per}%`);
        }
      }
      function mouseOut(d) {
        d3.select(this).style("stroke", "none");
        d3.select(this.parentNode)
          .select(".modal")
          .remove();
      }

      // 각 막대에 마우스 오버 함수 생성
      d3.selectAll(`.${where}-g`)
        .selectAll("rect")
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut);

      return true;
    });
  }

  /**
   * @dev 사용자의 플레이 통계(돌격, 공격, 지원)를 가져와서 파이 차트를 그린다
   */
  async getPlaytimeRecord() {
    const champions = await this.accumulateChampionValue("byPlaytime");
    if (champions === -1) {
      alert("잘못된 타입의 영웅이 입력되었습니다. 프로필 정보를 갱신해 주세요");
      return;
    }
    const tank = champions[0];
    const damage = champions[1];
    const support = champions[2];

    this.createPieChart(tank, damage, support, "play", "byPlaytime");
  }

  /**
   * @dev 사용자의 승리한 게임 통계를 가져와서 파이 차트를 그린다
   */
  async getWinGameRecord() {
    const champions = await this.accumulateChampionValue("byWinGame");
    if (champions === -1) {
      alert("잘못된 타입의 영웅이 입력되었습니다. 프로필 정보를 갱신해 주세요");
      return;
    }
    const tank = champions[0];
    const damage = champions[1];
    const support = champions[2];

    this.createPieChart(tank, damage, support, "wingame", "byWinGame");
  }

  /**
   * @dev 사용자의 명중률 통계를 가져와서 파이 차트를 그린다
   */
  async getHitRateRecord() {
    let rank = this.props.data.rank.val;
    // 랭크 값을 티어로 변환하여 해당 구간 승률을 가져온다

    if (rank === undefined) {
      rank = "alltier";
    } else if (rank < 1500) {
      rank = "bronze";
    } else if (rank < 2000) {
      rank = "silver";
    } else if (rank < 2500) {
      rank = "gold";
    } else if (rank < 3000) {
      rank = "platinum";
    } else if (rank < 3500) {
      rank = "diamond";
    } else if (rank < 4000) {
      rank = "master";
    } else if (rank < 5000) {
      rank = "grand_master";
    } else {
      return alert("잘못된 유저 랭크 정보입니다. 유저 정보를 갱신해 주세요");
    }

    this.createBarChart(rank, "hit_rate", "byHitRate");
  }

  /**
   * @dev 사용자의 승률 통계를 가져와서 파이 차트를 그린다
   */
  async getWinRateRecord() {
    let rank = this.props.data.rank.val;
    // 랭크 값을 티어로 변환하여 해당 구간 승률을 가져온다

    if (rank === undefined) {
      rank = "alltier";
    } else if (rank < 1500) {
      rank = "bronze";
    } else if (rank < 2000) {
      rank = "silver";
    } else if (rank < 2500) {
      rank = "gold";
    } else if (rank < 3000) {
      rank = "platinum";
    } else if (rank < 3500) {
      rank = "diamond";
    } else if (rank < 4000) {
      rank = "master";
    } else if (rank < 5000) {
      rank = "grand_master";
    } else {
      return alert("잘못된 유저 랭크 정보입니다. 유저 정보를 갱신해 주세요");
    }

    this.createBarChart(rank, "win_rate", "byWinRate");
  }

  /**
   * @dev 사용자의 K/D 통계를 가져와서 파이 차트를 그린다
   */
  async getKDRecord() {
    let rank = this.props.data.rank.val;
    // 랭크 값을 티어로 변환하여 해당 구간 승률을 가져온다

    if (rank === undefined) {
      rank = "alltier";
    } else if (rank < 1500) {
      rank = "bronze";
    } else if (rank < 2000) {
      rank = "silver";
    } else if (rank < 2500) {
      rank = "gold";
    } else if (rank < 3000) {
      rank = "platinum";
    } else if (rank < 3500) {
      rank = "diamond";
    } else if (rank < 4000) {
      rank = "master";
    } else if (rank < 5000) {
      rank = "grand_master";
    } else {
      return alert("잘못된 유저 랭크 정보입니다. 유저 정보를 갱신해 주세요");
    }

    this.createBarChart(rank, "kd", "byKD");
  }

  /**
   * @dev 사용자의 치명타 명중률 통계를 가져와서 파이 차트를 그린다
   */
  async getCriticalHitRateRecord() {
    let rank = this.props.data.rank.val;
    // 랭크 값을 티어로 변환하여 해당 구간 승률을 가져온다

    if (rank === undefined) {
      rank = "alltier";
    } else if (rank < 1500) {
      rank = "bronze";
    } else if (rank < 2000) {
      rank = "silver";
    } else if (rank < 2500) {
      rank = "gold";
    } else if (rank < 3000) {
      rank = "platinum";
    } else if (rank < 3500) {
      rank = "diamond";
    } else if (rank < 4000) {
      rank = "master";
    } else if (rank < 5000) {
      rank = "grand_master";
    } else {
      return alert("잘못된 유저 랭크 정보입니다. 유저 정보를 갱신해 주세요");
    }

    this.createBarChart(rank, "critical_hit_rate", "byCriticalHitRate");
  }

  /**
   * @dev 사용자의 멀티킬 통계를 가져와서 파이 차트를 그린다
   */
  async getMultiKillRecord() {
    const champions = await this.accumulateChampionValue("byMultiKill");
    if (champions === -1) {
      alert("잘못된 타입의 영웅이 입력되었습니다. 프로필 정보를 갱신해 주세요");
      return;
    }
    const tank = champions[0];
    const damage = champions[1];
    const support = champions[2];

    this.createPieChart(tank, damage, support, "multi-kill", "byMultiKill");
  }

  /**
   * @dev 사용자의 임무 기여 처치 통계를 가져와서 파이 차트를 그린다
   */
  async getMissionContributeKill() {
    const champions = await this.accumulateChampionValue(
      "byMissionContributeKill"
    );
    if (champions === -1) {
      alert("잘못된 타입의 영웅이 입력되었습니다. 프로필 정보를 갱신해 주세요");
      return;
    }
    const tank = champions[0];
    const damage = champions[1];
    const support = champions[2];

    this.createPieChart(
      tank,
      damage,
      support,
      "mission-contribute-kill",
      "byMissionContributeKill"
    );
  }

  /**
   *
   * @param {event Object} e
   * @dev 갱신 버튼을 눌렸을 때 유저 정보를 새로 가져온 뒤 그려준다
   */
  async handleClick(e) {
    this.setState({ loading: true });
    await this.props.onClick();
    this.setState({ loading: false });
  }

  /**
   *
   * @param {event Object} e
   * @dev 플레이 통계 옵션을 선택할 때 마다 state 를 변경해주고
   *      해당 통계 그래프를 화면에 나타내준다
   *
   */
  async handleDropdownChange(e) {
    document.getElementsByClassName(
      this.state.chartName
    )[0].parentElement.style.display = "none";

    await this.setState({
      chartName: e.target.value
    });

    document.getElementsByClassName(
      this.state.chartName
    )[0].parentElement.style.display = "block";
  }

  /**
   *
   * @param {event Object} e 스크롤 할 때 발생하는 이벤트
   * @dev 유저가 스크롤을 하면 맨 위로 올리는 버튼을 보이게 만든다
   */
  handleScroll(e) {
    // 스크롤을 100 이상 하면
    const topButton = document.getElementById("leaderboard-button-to-top");
    if (topButton !== null) {
      if (
        document.body.scrollTop > 500 ||
        document.documentElement.scrollTop > 500
      ) {
        topButton.style.display = "block";
      } else {
        topButton.style.display = "none";
      }
    }
  }

  scrollToTop(e) {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  render() {
    const error = this.state.error;
    const loading = this.state.loading;

    if (error) {
      return (
        <div className="error">
          <p>error!!!</p>
        </div>
      );
    } else if (loading) {
      return (
        <div className="loading">
          <p>게임 데이터를 가져오는 중...</p>
          <div className="lds-dual-ring" />
        </div>
      );
    }
    return (
      <Router>
        <div className="user-detail">
          <div className="section-header-container main-header">
            <div className="section-header">
              <div className="header-bar main-bar" />
              <div className="header-parahgraph">현재 시즌 데이터</div>
              <div className="header-bar main-bar" />
            </div>
          </div>
          <div className="user-detail-top">
            <div className="user-detail-card-container">
              <div className="user-detail-card">
                <img
                  className="user-icon"
                  src={this.props.data.icon}
                  alt="icon"
                />
                <h1 className="user-data user-name">{this.props.data.name}</h1>
                <h3 className="user-data">Lv. {this.props.data.level}</h3>
                <h4 className="user-data">
                  마지막 갱신: {this.state.diff_time} 시간 전
                </h4>
                <img
                  className="user-data user-rank-image"
                  src={`https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-${GenerateRankIcon(
                    this.props.data.rank.val
                  )}Tier.png`}
                  alt="rank icon"
                />
                <h2 className="user-data">rank. {this.props.data.rank.val}</h2>
                <button
                  className="user-data update-button"
                  onClick={this.handleClick}
                  name="update"
                >
                  갱신
                </button>
              </div>
            </div>
            <div className="user-detail-most-container">
              <div className="user-detail-most-header">Most Champion Top 3</div>
              <div className="user-detail-most" />
            </div>
          </div>

          <div className="section-header-container">
            <div className="section-header">
              <div className="header-bar" />
              <div className="header-parahgraph">플레이 통계</div>
              <select
                value={this.state.chartName}
                className="user-detail-dropdown"
                onChange={this.handleDropdownChange}
              >
                <option value="user-detail-play">플레이 시간</option>
                <option value="user-detail-wingame">승리한 게임</option>
                <option value="user-detail-win_rate">승률</option>
                <option value="user-detail-hit_rate">명중률</option>
                <option value="user-detail-kd">KD</option>
                <option value="user-detail-critical_hit_rate">
                  치명타 명중률
                </option>
                <option value="user-detail-multi-kill">멀티 킬</option>
                <option value="user-detail-mission-contribute-kill">
                  임무 기여 처치
                </option>
              </select>
            </div>
          </div>
          <div
            className="user-detail-chart-container"
            style={{ display: "block" }}
          >
            <div className="user-detail-play" />
          </div>
          <div className="user-detail-chart-container">
            <div className="user-detail-wingame" />
          </div>
          <div className="user-detail-chart-container">
            <div className="user-detail-win_rate" />
          </div>
          <div className="user-detail-chart-container">
            <div className="user-detail-hit_rate" />
          </div>
          <div className="user-detail-chart-container">
            <div className="user-detail-kd" />
          </div>
          <div className="user-detail-chart-container">
            <div className="user-detail-critical_hit_rate" />
          </div>
          <div className="user-detail-chart-container">
            <div className="user-detail-multi-kill" />
          </div>
          <div className="user-detail-chart-container">
            <div className="user-detail-mission-contribute-kill" />
          </div>

          <div className="section-header-container">
            <div className="section-header">
              <div className="header-bar" />
              <div className="header-parahgraph">영웅별 통계</div>
            </div>
          </div>

          <div className="user-champions-buttons">{this.state.buttons}</div>
        </div>
        <div className="user-champions" ref={this.championRef}>
          <Route
            path={`${this.props.match.url}/아나`}
            render={props => this.state.championComponents.아나}
          />
          <Route
            path={`${this.props.match.url}/애쉬`}
            render={props => this.state.championComponents.애쉬}
          />
          <Route
            path={`${this.props.match.url}/바티스트`}
            render={props => this.state.championComponents.바티스트}
          />
          <Route
            path={`${this.props.match.url}/바스티온`}
            render={props => this.state.championComponents.바스티온}
          />
          <Route
            path={`${this.props.match.url}/브리기테`}
            render={props => this.state.championComponents.브리기테}
          />
          <Route
            path={`${this.props.match.url}/D-Va`}
            render={props => this.state.championComponents["D-Va"]}
          />
          <Route
            path={`${this.props.match.url}/둠피스트`}
            render={props => this.state.championComponents.둠피스트}
          />
          <Route
            path={`${this.props.match.url}/겐지`}
            render={props => this.state.championComponents.겐지}
          />
          <Route
            path={`${this.props.match.url}/한조`}
            render={props => this.state.championComponents.한조}
          />
          <Route
            path={`${this.props.match.url}/정크랫`}
            render={props => this.state.championComponents.정크랫}
          />
          <Route
            path={`${this.props.match.url}/루시우`}
            render={props => this.state.championComponents.루시우}
          />
          <Route
            path={`${this.props.match.url}/맥크리`}
            render={props => this.state.championComponents.맥크리}
          />
          <Route
            path={`${this.props.match.url}/메이`}
            render={props => this.state.championComponents.메이}
          />
          <Route
            path={`${this.props.match.url}/메르시`}
            render={props => this.state.championComponents.메르시}
          />
          <Route
            path={`${this.props.match.url}/모이라`}
            render={props => this.state.championComponents.모이라}
          />
          <Route
            path={`${this.props.match.url}/오리사`}
            render={props => this.state.championComponents.오리사}
          />
          <Route
            path={`${this.props.match.url}/파라`}
            render={props => this.state.championComponents.파라}
          />
          <Route
            path={`${this.props.match.url}/리퍼`}
            render={props => this.state.championComponents.리퍼}
          />
          <Route
            path={`${this.props.match.url}/라인하르트`}
            render={props => this.state.championComponents.라인하르트}
          />
          <Route
            path={`${this.props.match.url}/로드호그`}
            render={props => this.state.championComponents.로드호그}
          />
          <Route
            path={`${this.props.match.url}/솔저`}
            render={props => this.state.championComponents.솔저}
          />
          <Route
            path={`${this.props.match.url}/솜브라`}
            render={props => this.state.championComponents.솜브라}
          />
          <Route
            path={`${this.props.match.url}/시그마`}
            render={props => this.state.championComponents.시그마}
          />
          <Route
            path={`${this.props.match.url}/시메트라`}
            render={props => this.state.championComponents.시메트라}
          />
          <Route
            path={`${this.props.match.url}/토르비욘`}
            render={props => this.state.championComponents.토르비욘}
          />
          <Route
            path={`${this.props.match.url}/트레이서`}
            render={props => this.state.championComponents.트레이서}
          />
          <Route
            path={`${this.props.match.url}/위도우메이커`}
            render={props => this.state.championComponents.위도우메이커}
          />
          <Route
            path={`${this.props.match.url}/윈스턴`}
            render={props => this.state.championComponents.윈스턴}
          />
          <Route
            path={`${this.props.match.url}/레킹볼`}
            render={props => this.state.championComponents.레킹볼}
          />
          <Route
            path={`${this.props.match.url}/자리야`}
            render={props => this.state.championComponents.자리야}
          />
          <Route
            path={`${this.props.match.url}/젠야타`}
            render={props => this.state.championComponents.젠야타}
          />
        </div>
        <TopButton id="leaderboard-button-to-top" onClick={this.scrollToTop}>
          Top
        </TopButton>
      </Router>
    );
  }
}
