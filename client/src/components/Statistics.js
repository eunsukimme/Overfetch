import React, { Component } from "react";
import { Static_col } from "./Static_col";
import "./css/statistics.css";

export class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      data: [],
      count: 0,
      criteria: "win_rate",
      tier: "alltier",
      championComponents: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * @dev 컴포넌트가 마운트 되었을때, 영웅들의 리스트를 쿼리한다
   *      디폴트로 승률순으로 첫 페이지를 보여준다
   */
  async componentDidMount() {
    this.scrollToTop();

    await this.fetchData();
    await this.updateChampionComponent();
    // 스크롤 함수 바인딩
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
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
  }

  convertCriteriaName(criteria) {
    if (criteria === "win_rate") {
      return "승률";
    } else if (criteria === "hit_rate") {
      return "명중률";
    } else if (criteria === "kd") {
      return "K/D";
    } else if (criteria === "critical_hit_rate") {
      return "치명타 명중률";
    } else {
      return "점수";
    }
  }

  async fetchData() {
    this.setState({
      loading: true
    });
    const url = `/avg/rankplay/${this.state.criteria}?tier=${this.state.tier}`;
    console.log(url);

    await fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({
          data: data[0]
        });
        this.setState({
          loading: false
        });

        return new Promise(resolve => {
          resolve(true);
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: true
        });
      });

    return new Promise(resolve => {
      resolve(true);
    });
  }

  async updateChampionComponent() {
    // _id, count, 영웅 이름들을 가져온다
    const keys = Object.keys(this.state.data);
    const count = keys.count; // 집계된 플레이어 수
    await this.setState({
      count: count
    });
    // _id, count 필드는 제거하고 영웅 이름 필드만 남긴다
    const id_index = keys.findIndex(el => el === "_id");
    keys.splice(id_index, 1);
    const count_index = keys.findIndex(el => el === "count");
    keys.splice(count_index, 1);

    const sortable = [];
    for (let champion of keys) {
      sortable.push([champion, this.state.data[champion]]);
    }
    sortable.sort((a, b) => {
      return b[1] - a[1];
    });
    console.log(sortable);

    // 각 영웅 이름별로 컴포넌트를 생성해서 championComponents에 저장한다
    const championComponents = await sortable.map((el, i) => {
      const champion_name = el[0];
      let champion_value = el[1];
      if (champion_value === null || champion_value === undefined) {
        champion_value = 0;
      }
      return (
        <Static_col
          key={i + 1}
          type={i % 2 === 0 ? "even" : "odd"}
          order={i + 1}
          criteria={this.state.criteria}
          name={champion_name}
          value={champion_value}
          en_name={this.convertChampionName(champion_name)}
        />
      );
    });
    await this.setState({
      championComponents: championComponents
    });

    return new Promise(resolve => {
      resolve(true);
    });
  }

  async handleChange(e) {
    await this.setState({
      [e.target.name]: e.target.value
    });
    await this.setState({
      championComponents: []
    });

    this.scrollToTop();
    await this.fetchData();
    await this.updateChampionComponent();
  }

  /**
   *
   * @param {event Object} e 스크롤 할 때 발생하는 이벤트
   * @dev 유저가 스크롤을 하면 맨 위로 올리는 버튼을 보이게 만든다
   */
  handleScroll(e) {
    // 스크롤을 100 이상 하면
    const topButton = document.getElementById("statistics-button-to-top");
    if (
      document.body.scrollTop > 500 ||
      document.documentElement.scrollTop > 500
    ) {
      topButton.style.display = "block";
    } else {
      topButton.style.display = "none";
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
          <button id="statistics-button-to-top" onClick={this.scrollToTop}>
            Top
          </button>
        </div>
      );
    } else if (loading) {
      return (
        <div className="loading">
          <p>통계 데이터를 가져오는 중...</p>
          <div className="lds-dual-ring" />
          <button id="statistics-button-to-top" onClick={this.scrollToTop}>
            Top
          </button>
        </div>
      );
    }
    return (
      <div className="statistics">
        <div className="statistics-top">
          <p>영웅 통계</p>
          <select
            name="criteria"
            value={this.state.criteria}
            onChange={this.handleChange}
            className="statistics-top-dropdown"
          >
            <option value="win_rate">승률</option>
            <option value="hit_rate">명중률</option>
            <option value="kd">K/D</option>
            <option value="critical_hit_rate">치명타 명중률</option>
          </select>
          <select
            name="tier"
            value={this.state.tier}
            onChange={this.handleChange}
            className="statistics-top-dropdown"
          >
            <option value="alltier">모든 티어</option>
            <option value="grand_master">그랜드마스터</option>
            <option value="master">마스터</option>
            <option value="diamond">다이아몬드</option>
            <option value="platinum">플래티넘</option>
            <option value="gold">골드</option>
            <option value="silver">실버</option>
            <option value="bronze">브론즈</option>
          </select>
        </div>
        <div className="statistics-bottom">
          <table className="statistics-bottom-table">
            <tbody className="statistics-bottom-table-body">
              <tr className="statistics-bottom-table-header">
                <th className="table-header-order">순위</th>
                <th colSpan="2">영웅 정보</th>
                <th colSpan="2">
                  {this.convertCriteriaName(this.state.criteria)}
                </th>
              </tr>
              {this.state.championComponents}
            </tbody>
          </table>
        </div>
        <button id="statistics-button-to-top" onClick={this.scrollToTop}>
          Top
        </button>
      </div>
    );
  }
}
