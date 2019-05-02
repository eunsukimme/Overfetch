import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Champion } from "./champion/Champion";
import "./css/detail.css";
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
      mostComponents: []
    };
    this.handleClick = this.handleClick.bind(this);
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
    await this.getChampionRecord();
    await this.getMostRecord();
    await this.getPlayRecord();
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
    if (tank.includes(champion_name)) return "tank";
    else if (damage.includes(champion_name)) return "damage";
    else if (support.includes(champion_name)) return "support";
    else return -1;
  }
  /**
   * @dev 사용자의 플레이 통계(돌격, 공격, 지원)를 가져와서 파이 차트를 그린다
   */
  async getPlayRecord() {
    const keys = Object.keys(this.props.data.rankplay.mostChampion.byPlaytime);
    console.log(keys);

    // 해당 영웅의 플레이 시간을 세 범주(돌격, 공격, 지원)로 나누어 저장한다
    let tank = 0;
    let damage = 0;
    let support = 0;
    const result = await keys.map(el => {
      const champion_name = el;
      const champion_playtime = this.props.data.rankplay.mostChampion
        .byPlaytime[el];
      const champion_type = this.getChampionType(champion_name);
      // 영웅의 타입에 해당하는 변수에 시간을 누적한다
      if (champion_type == "tank") tank += champion_playtime;
      else if (champion_type == "damage") damage += champion_playtime;
      else if (champion_type == "support") support += champion_playtime;
      else return alert("잘못된 타입의 영웅이 입력되었습니다");

      return new Promise(resolve => {
        resolve(true);
      });
    });
    await Promise.all(result);
    console.log(`tank: ${tank}`);
    console.log(`damage: ${damage}`);
    console.log(`support: ${support}`);

    // 범주의 값을 파이 차트로 나타낸다
    const pieChart = d3.pie();
    const playPie = pieChart([tank, damage, support]);
    const playArc = d3.arc();
    playArc.outerRadius(200);
    console.log(playArc(playPie[0]));

    return new Promise(resolve => {
      resolve(true);
    });
  }

  async handleClick(e) {
    console.log("updating...");
    this.setState({ loading: true });
    await this.props.onClick();
    this.setState({ loading: false });
    console.log(this.props);
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
            <div classname="section-header">
              <div className="header-bar" />
              <div className="header-parahgraph">플레이 통계</div>
              <div>파이 차트 들어갈 자리</div>
            </div>
          </div>

          <div className="section-header-container">
            <div classname="section-header">
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
