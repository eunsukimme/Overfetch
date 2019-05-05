import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Champion } from "./champion/Champion";
import "./css/detail/detail.css";
import "./css/detail/user-detail-top.css";
import "./css/detail/user-detail-chart.css";
import "./css/detail/user-champions.css";
import * as d3 from "d3";
import { colorbrewer } from "../lib/colorbrewer";

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
    if (name == "아나") return "ana";
    else if (name == "애쉬") return "ashe";
    else if (name == "바티스트") return "baptiste";
    else if (name == "바스티온") return "bastion";
    else if (name == "브리기테") return "brigitte";
    else if (name == "D-Va") return "dva";
    else if (name == "둠피스트") return "doomfist";
    else if (name == "겐지") return "genji";
    else if (name == "한조") return "hanzo";
    else if (name == "정크랫") return "junkrat";
    else if (name == "루시우") return "lucio";
    else if (name == "맥크리") return "mccree";
    else if (name == "메이") return "mei";
    else if (name == "메르시") return "mercy";
    else if (name == "모이라") return "moira";
    else if (name == "오리사") return "orisa";
    else if (name == "파라") return "pharah";
    else if (name == "리퍼") return "reaper";
    else if (name == "라인하르트") return "reinhardt";
    else if (name == "로드호그") return "roadhog";
    else if (name == "솔저") return "soldier-76";
    else if (name == "솜브라") return "sombra";
    else if (name == "시메트라") return "symmetra";
    else if (name == "토르비욘") return "torbjorn";
    else if (name == "트레이서") return "tracer";
    else if (name == "위도우메이커") return "widowmaker";
    else if (name == "윈스턴") return "winston";
    else if (name == "레킹볼") return "wrecking-ball";
    else if (name == "자리야") return "zarya";
    else if (name == "젠야타") return "zenyatta";
  }

  /**
   * @dev 컴포넌트 마운트 시 실행
   */
  componentDidMount() {
    this.fetchData();
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
    //await this.getHitRateRecord();
    //await this.getWinRateRecord();
    //await this.getKDRecord();
    //await this.getCriticalHitRateRecord();
    await this.getMultiKillRecord();
    await this.getMissionContributeKill();
  }

  /**
   * @dev 영웅별 통계를 가져오고, 컴포넌트를 생성해서 state 에 할당한다
   */
  async getChampionRecord() {
    this.setState({ loading: true });

    // 유저의 경쟁전 플레이 영웅이름을 가져온다
    const keys = Object.keys(this.props.data.rankplay.record);
    const except = keys.indexOf("모든영웅");
    keys.splice(except, 1); // 모든영웅 필드 제거

    // 경쟁전 플레이 영웅별로 시각화할 레코드를 가져온다
    const result = await keys.map(async el => {
      // 해당 영웅의 플레이 정보(영웅별)가 존재하지 않거나
      // 치른 게임 수가 0 이라면 해당 레코드는 가져오지 않는다
      let play = this.props.data.rankplay.record[el].게임["치른 게임"];
      let champion_info = this.props.data.rankplay.record[el].영웅별;
      if (play == 0 || champion_info == undefined) {
        return;
      }

      // 존재하는 각 영웅이름 의 레코드를 가져온다
      // 이때, 랭크 정보가 포함되지 않은 유저는 전 랭크에 대해서 가져온다
      let rankInfo;
      if (
        this.props.data.rank.val == undefined ||
        this.props.data.rank.val == null
      ) {
        rankInfo = "alltier";
      } else {
        rankInfo = this.props.data.rank.val;
      }
      const url = "/avg/rankplay/champion/" + el + "?rank=" + rankInfo;
      const result = await fetch(url)
        .then(res => res.json())
        .then(data => {
          this.setState(prevState => ({
            champions: {
              ...prevState.champions,
              [el]: el
            }
          }));

          this.setState(prevState => ({
            championComponents: {
              ...prevState.championComponents,
              [el]: (
                <Champion
                  championName={el}
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
        <div className="champion-button">
          <Link
            className="champion-button-link"
            to={`${this.props.match.url}/${el}`}
            //            onClick={this.scrollToChampionRef}
          >
            <img className="champion-button-image" src={image_src} />
            <p>{el}</p>
          </Link>
        </div>
      );
    });
    this.setState({ buttons: _buttons });

    /* 현재 날짜와 최근 업데이트 시각을 비교한다 */
    const now = Date.now();
    const last_update = new Date(this.props.data.update).getTime();
    console.log(`last update: ${last_update}`);
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
    console.log(mosts);
    // most_criteria는 모든 모스트 기준을 저장한다
    const most_criteria = Object.keys(mosts);

    const sorted = []; // 플레이 시간 기준 상위 챔피언을 순서대로 정렬해 저장하는 배열
    // 각 기준을 돌면서 플레이 시간 기준을 찾는다
    await most_criteria.some(el => {
      if (el == "byPlaytime") {
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
      return el == "byPlaytime";
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
      "자리야"
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
      console.log(champion_name);
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
    console.log(keys);

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
      if (champion_type == "tank") {
        tank += champion_value;
        tank_count += 1;
      } else if (champion_type == "damage") {
        damage += champion_value;
        damage_count += 1;
      } else if (champion_type == "support") {
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
      if (avg == false) {
        resolve([tank, damage, support]);
      } else if (avg == true) {
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
    const width = 400;
    const height = 400;
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
    console.log(arcs);

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
      .on("mouseover", function(d) {
        console.log("mouse over: " + d.data.name);
      })
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
        } else if (criteria == "byWinRate") {
          return d.value.toFixed(1);
        } else if (criteria == "byKD") {
          return d.value.toFixed(2);
        } else if (criteria == "byCriticalHitRate") {
          return d.value.toFixed(1);
        } else if (criteria == "byMultiKill") {
          return d.value;
        } else if (criteria == "byMissionContributeKill") {
          return d.value;
        }
      });

    return new Promise(resolve => {
      resolve(true);
    });
  }

  /**
   * @dev 사용자의 플레이 통계(돌격, 공격, 지원)를 가져와서 파이 차트를 그린다
   */
  async getPlaytimeRecord() {
    const champions = await this.accumulateChampionValue("byPlaytime");
    if (champions == -1) {
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
    if (champions == -1) {
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
    const champions = await this.accumulateChampionValue("byHitRate", true);
    if (champions == -1) {
      alert("잘못된 타입의 영웅이 입력되었습니다. 프로필 정보를 갱신해 주세요");
      return;
    }
    const tank = champions[0];
    const damage = champions[1];
    const support = champions[2];

    this.createPieChart(tank, damage, support, "hitrate", "byHitRate");
  }

  /**
   * @dev 사용자의 승률 통계를 가져와서 파이 차트를 그린다
   */
  async getWinRateRecord() {
    const champions = await this.accumulateChampionValue("byWinRate", true);
    if (champions == -1) {
      alert("잘못된 타입의 영웅이 입력되었습니다. 프로필 정보를 갱신해 주세요");
      return;
    }
    const tank = champions[0];
    const damage = champions[1];
    const support = champions[2];

    this.createPieChart(tank, damage, support, "winrate", "byWinRate");
  }

  /**
   * @dev 사용자의 K/D 통계를 가져와서 파이 차트를 그린다
   */
  async getKDRecord() {
    const champions = await this.accumulateChampionValue("byKD", true);
    if (champions == -1) {
      alert("잘못된 타입의 영웅이 입력되었습니다. 프로필 정보를 갱신해 주세요");
      return;
    }
    const tank = champions[0];
    const damage = champions[1];
    const support = champions[2];

    this.createPieChart(tank, damage, support, "kd", "byKD");
  }

  /**
   * @dev 사용자의 치명타 명중률 통계를 가져와서 파이 차트를 그린다
   */
  async getCriticalHitRateRecord() {
    const champions = await this.accumulateChampionValue(
      "byCriticalHitRate",
      true
    );
    if (champions == -1) {
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
      "critical-hit-rate",
      "byCriticalHitRate"
    );
  }

  /**
   * @dev 사용자의 멀티킬 통계를 가져와서 파이 차트를 그린다
   */
  async getMultiKillRecord() {
    const champions = await this.accumulateChampionValue("byMultiKill");
    if (champions == -1) {
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
    if (champions == -1) {
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
    console.log("updating...");
    this.setState({ loading: true });
    await this.props.onClick();
    this.setState({ loading: false });
    console.log(this.props);
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
                <img className="user-icon" src={this.props.data.icon} />
                <h1 className="user-data user-name">{this.props.data.name}</h1>
                <h3 className="user-data">Lv. {this.props.data.level}</h3>
                <h4 className="user-data">
                  마지막 갱신: {this.state.diff_time} 시간 전
                </h4>
                <img
                  className="user-data user-rank-image"
                  src={this.props.data.rank.imageSrc}
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
                {/*<option value="user-detail-hitrate">명중률</option>
                <option value="user-detail-winrate">승률</option>
                <option value="user-detail-kd">KD</option>
                <option value="user-detail-critical-hit-rate">
                  치명타 명중률
    </option>*/}
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
          {/*<div className="user-detail-chart-container">
            <div className="user-detail-hitrate" />
          </div>
          <div className="user-detail-chart-container">
            <div className="user-detail-winrate" />
          </div>
          <div className="user-detail-chart-container">
            <div className="user-detail-kd" />
          </div>
          <div className="user-detail-chart-container">
            <div className="user-detail-critical-hit-rate" />
  </div> */}
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
      </Router>
    );
  }
}
