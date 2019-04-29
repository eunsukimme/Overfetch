import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Champion } from "./champion/Champion";
import "./css/detail.css";
import * as d3 from "d3";

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
      console.log(`${el}: ${play}`);
      if (play == 0 || champion_info == undefined) {
        return;
      }

      // 존재하는 각 영웅이름 의 레코드를 가져온다
      const url =
        "/avg/rankplay/champion/" + el + "?rank=" + this.props.data.rank.val;
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
    console.log(this.state.champions);
    console.log(this.state.championComponents);
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

  // 플레이 시간 순 모스트 챔피언 정보를 가져온다
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
    const minimum = sorted[sorted.length - 1];
    const maximum = sorted[0];
    const timeScale = d3
      .scaleLinear()
      .domain([minimum, maximum])
      .range([0, 400]);

    // 이제 state의 most 에는 플레이시간 별 상위 영웅이 저장되있음
    // 이 영웅들 중 앞 3 원소들의 데이터만 우리의 관심이 있다
    // 이미지, K/D 정보를 가져온다
    let limit = 3;
    // 만약 모스트가 3 보다 적다면 그 길이만큼 가져온다
    if (this.state.most.length < 3) limit = this.state.most.length;
    for (let i = 0; i < limit; i++) {
      const champion_name = this.state.most[i][0];
      const champion_playtime = this.state.most[i][1];
      console.log(`${champion_name} - ${champion_playtime}`);

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
      console.log(`${champion_name}: ${hour}시 ${min}분 ${sec}초`);

      // 이제 KD 값을 가져온다
      // 영웅의 KD 필드는 mostChampion -> byKD 필드에 존재한다
      const KD = this.props.data.rankplay.mostChampion.byKD[champion_name];
      console.log(KD);

      // 마지막으로 이 모든 값을 그려준다
      // 먼저 svg 를 생성해준다
      const most_graph = d3
        .select(".user-detail-most")
        .append("svg")
        .attr("id", `most_${i}`)
        .attr("class", "svg-most")
        .attr("width", "400px")
        .attr("height", "160px")
        .attr("display", "block")
        .style("border", "1px solid lightgray");

      // 해당 svg 에 영웅 이름, KD, 플레이타임 정보를 넣어준다
      most_graph
        .append("text")
        .attr("y", 16)
        .attr("class", "text")
        .html(champion_name);
    }
  }

  async fetchData() {
    await this.getChampionRecord();
    await this.getMostRecord();
  }

  componentDidMount() {
    this.fetchData();
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
          <div class="lds-dual-ring" />
        </div>
      );
    } else if (loading) {
      return (
        <div className="loading">
          <p>게임 데이터를 가져오는 중...</p>
          <div class="lds-dual-ring" />
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

          <div className="user-champions-buttons">{this.state.buttons}</div>
        </div>
        <div className="user-champions">
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
