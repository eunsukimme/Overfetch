import React, { Component } from "react";
import { Link } from "react-router-dom";
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
      buttonComponets: []
    };
    this.handleChange = this.handleChange.bind(this);
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
      return (
        <li>
          <User
            name={name}
            tag={tag}
            rank={rank}
            level={level}
            icon_image={icon_image}
            order={(this.state.page - 1) * 100 + i + 1}
          />
        </li>
      );
    });

    this.setState({ userComponents: _userComponents });

    console.log(this.state.userComponents);
    return new Promise(resolve => {
      resolve(true);
    });
  }

  async fetchData() {
    const url = `${this.props.match.path}/${this.state.criteria}/${
      this.state.page
    }`;

    await fetch(url)
      .then(res => res.json())
      .then(_data => {
        this.setState({ data: _data });
      });

    return new Promise(resolve => {
      resolve(true);
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

    await this.fetchData();
    this.updateUserComponents();
  }

  /**
   * @dev 컴포넌트가 마운트 되었을때, 유저의 리스트를 쿼리한다
   *      디폴트로 랭크순으로 첫 페이지를 보여준다
   */
  async componentDidMount() {
    const url = `/users/${this.state.criteria}/${this.state.page}`;

    console.log(url);
    await fetch(url)
      .then(res => {
        return res.json();
      })
      .then(_data => {
        this.setState({ data: _data });
      });

    await this.updateUserComponents();

    // 아래에 버튼 네비게이션 바를 만든다
    const buttons = [];
    let startPage = (this.state.page / 10).toFixed(0);
    let endPage = startPage + 10;
    for (startPage = Number(startPage) + 1; startPage < endPage; startPage++) {
      buttons.push(
        <button onClick={this.handleChange} name="page" value={`${startPage}`}>
          {startPage}
        </button>
      );
    }

    this.setState({
      buttonComponets: buttons
    });
    console.log(this.state.buttonComponets);
  }

  render() {
    return (
      <div className="leaderboard">
        <div className="leaderboard-top">
          <p>Users Info</p>
          <select onChange={this.handleChange}>
            <option name="rank" value="rank" selected>
              경쟁전 평점 순
            </option>
            <option name="level" value="level">
              레벨 순
            </option>
          </select>
        </div>
        <div className="leaderboard-bottom">
          <div className="leaderboard-bottom-cards-container">
            <ul>{this.state.userComponents}</ul>
          </div>
          <div className="leaderboard-bottom-buttons-container">
            {this.state.buttonComponets}
          </div>
        </div>
      </div>
    );
  }
}
