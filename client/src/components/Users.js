import React, { Component } from "react";
import { User } from "./User";
import "./css/users.css";

export class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userComponents: [],
      criteria: "rank",
      page: 1,
      buttonComponets: [],
      loading: false,
      error: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClickNext = this.handleClickNext.bind(this);
    this.handleClickBefore = this.handleClickBefore.bind(this);
  }

  /**
   * @dev 컴포넌트가 마운트 되었을때, 유저의 리스트를 쿼리한다
   *      디폴트로 랭크순으로 첫 페이지를 보여준다
   */
  async componentDidMount() {
    this.scrollToTop();

    await this.fetchData();
    await this.updateUserComponents();
    await this.addButtons();
    // 스크롤 함수 바인딩
    window.addEventListener("scroll", this.handleScroll);
  }

  // 컴포넌트 언마운트 시 스크롤 이벤트 리스너 제거한다
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  /**
   * 현재 state의 criteria&page 의 유저들을 불러온다
   */
  async fetchData() {
    this.setState({
      loading: true
    });
    const url = `${this.props.match.path}/${this.state.criteria}/${
      this.state.page
    }`;

    await fetch(url)
      .then(res => res.json())
      .then(_data => {
        this.setState({ data: _data });
        this.setState({
          loading: false
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

  /**
   * @dev state에 저장된 user의 json 오브젝트 배열을 리액트 컴포넌트로 변환 후 저장
   */
  async updateUserComponents() {
    const _userComponents = await this.state.data.map((user, i) => {
      const name = user.name;
      const tag = user.tag;
      const rank = user.rank;
      const level = user.level;
      const icon_image = user.icon;
      let type; // 홀수 & 짝수 구분
      if (i % 2 === 0) {
        type = "even";
      } else {
        type = "odd";
      }
      return (
        <User
          name={name}
          tag={tag}
          rank={rank}
          level={level}
          icon_image={icon_image}
          order={(this.state.page - 1) * 100 + i + 1}
          key={(this.state.page - 1) * 100 + i + 1}
          type={type}
        />
      );
    });

    this.setState({ userComponents: _userComponents });

    return new Promise(resolve => {
      resolve(true);
    });
  }

  /**
   * @dev 하단에 네비게이션 버튼을 생성한다
   */
  async addButtons() {
    // 아래에 버튼 네비게이션 바를 만든다
    const buttons = [];
    let startPage = Math.floor(this.state.page / 10) * 10;
    let endPage = startPage + 10;

    // 만약 현재 페이지가 10 보다 크거나 같다면
    // 뒤의 범주로 돌아가는(10~19 => 1~9) 버튼을 달아준다
    if (this.state.page >= 10) {
      buttons.push(
        <button
          key="before"
          className="leaderboard-button"
          onClick={this.handleClickBefore}
        >{`<`}</button>
      );
    }

    for (startPage = Number(startPage); startPage < endPage; startPage++) {
      if (startPage === 0) continue;
      buttons.push(
        <button
          className="leaderboard-button"
          onClick={this.handleChange}
          name="page"
          value={`${startPage}`}
          key={`${startPage}`}
        >
          {startPage}
        </button>
      );
    }
    // 다음 범위로 넘어가는 버튼을 생성한다
    buttons.push(
      <button
        key="next"
        className="leaderboard-button"
        onClick={this.handleClickNext}
      >
        >
      </button>
    );

    this.setState({
      buttonComponets: buttons
    });
  }

  /**
   *
   * @param {event Object} e 정렬 option 값의 변화 이벤트
   * @dev option 드롭다운의 변화를 감지하고 그에 따라 DB에 요청을 보냄
   */
  async handleChange(e) {
    await this.setState({
      [e.target.name]: e.target.value
    });

    this.scrollToTop();
    await this.fetchData();
    await this.updateUserComponents();
    // 버튼은 업데이트 시키지 않는다
  }

  /**
   *
   * @param {event Object} e 다음 범주의 페이지로 넘어가는 버튼 클릭 이벤트
   * @dev 다음 버튼을 누르면 다음 범주의 페이지(1~9 => 10~19)로 넘어간다
   */
  async handleClickNext(e) {
    const next = (Math.floor(this.state.page / 10) + 1) * 10;
    console.log(`the next start page is ${next}`);
    await this.setState({
      page: next
    });

    this.scrollToTop();
    await this.fetchData();
    await this.updateUserComponents();
    await this.addButtons();
  }

  /**
   *
   * @param {event Object} e 이전 범주의 페이지로 넘어가는 버튼 클릭 이벤트
   * @dev 이전 버튼을 누르면 이전 범주의 페이지(10~19 => 1~9)로 넘어간다
   */
  async handleClickBefore(e) {
    let next = (Math.floor(this.state.page / 10) - 1) * 10;
    if (next === 0) next = 1;
    console.log(`the next start page is ${next}`);
    await this.setState({
      page: next
    });

    this.scrollToTop();
    await this.fetchData();
    await this.updateUserComponents();
    await this.addButtons();
  }

  /**
   *
   * @param {event Object} e 스크롤 할 때 발생하는 이벤트
   * @dev 유저가 스크롤을 하면 맨 위로 올리는 버튼을 보이게 만든다
   */
  handleScroll(e) {
    // 스크롤을 100 이상 하면
    const topButton = document.getElementById("leaderboard-button-to-top");
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
          <button id="leaderboard-button-to-top" onClick={this.scrollToTop}>
            Top
          </button>
        </div>
      );
    } else if (loading) {
      return (
        <div className="loading">
          <p>랭킹 데이터를 가져오는 중...</p>
          <div className="lds-dual-ring" />
          <button id="leaderboard-button-to-top" onClick={this.scrollToTop}>
            Top
          </button>
        </div>
      );
    }
    return (
      <div className="leaderboard">
        <div className="leaderboard-top">
          <p>리더보드</p>
          <select
            name="criteria"
            value={this.state.criteria}
            onChange={this.handleChange}
            className="leaderboard-top-dropdown"
          >
            <option value="rank">경쟁전 평점 순</option>
            <option value="level">레벨 순</option>
          </select>
        </div>
        <div className="leaderboard-bottom">
          <table className="leaderboard-bottom-table">
            <tbody className="leaderboard-bottom-table-body">
              <tr className="leaderboard-bottom-table-header">
                <th className="table-header-order">순위</th>
                <th colSpan="2">유저 정보</th>
                <th>레벨</th>
                <th colSpan="2">경쟁전 점수</th>
              </tr>
              {this.state.userComponents}
            </tbody>
          </table>
          <div className="leaderboard-bottom-buttons-container">
            {this.state.buttonComponets}
          </div>
        </div>
        <button id="leaderboard-button-to-top" onClick={this.scrollToTop}>
          Top
        </button>
      </div>
    );
  }
}
