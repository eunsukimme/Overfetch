import React, { Component } from "react";
import { User } from "./User";

export class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userComponents: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * @dev state에 저장된 user의 json 오브젝트 배열을 리액트 컴포넌트로 변환 후 저장
   */
  async updateUserComponents() {
    const _userComponents = await this.state.data.map(user => {
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
          />
        </li>
      );
    });

    this.setState({ userComponents: _userComponents });

    console.log(this.state.userComponents);
  }

  /**
   *
   * @param {event Object} e 정렬 option 값의 변화 이벤트
   * @dev option 드롭다운의 변화를 감지하고 그에 따라 DB에 요청을 보냄
   */
  async handleChange(e) {
    const criteria = e.target.value;

    const url = this.props.match.path + "/" + criteria + "/1";
    await fetch(url)
      .then(res => res.json())
      .then(_data => {
        this.setState({ data: _data });
      });

    this.updateUserComponents();
  }

  /**
   * @dev 컴포넌트가 마운트 되었을때, 유저의 리스트를 쿼리한다
   *      디폴트로 랭크순으로 첫 페이지를 보여준다
   */
  async componentDidMount() {
    const url = this.props.match.path + "/rank/1";
    await fetch(url)
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(_data => {
        this.setState({ data: _data });
      });

    this.updateUserComponents();
  }

  render() {
    return (
      <div>
        <p>Users Info</p>
        <select onChange={this.handleChange}>
          <option value="rank" selected>
            경쟁전 평점 순
          </option>
          <option value="level">레벨 순</option>
        </select>
        <ul>{this.state.userComponents}</ul>
      </div>
    );
  }
}
