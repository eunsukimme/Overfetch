import React from "react";
import { Detail } from "./Detail";
import "./css/profile.css";

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      detail: undefined,
      loading: true,
      error: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    const url = `/search?name=${this.props.match.params.name}&tag=${
      this.props.match.params.tag
    }`;

    await fetch(url)
      .then(res => res.json())
      .then(user => {
        // error 발생시 알림 띄운다
        if (user.error) {
          this.setState({ error: true });
          return alert(user.error);
        }
        // 유저가 존재하면 이를 상태 data에 반영한다
        this.setState({ loading: false });
        this.setState({ data: user });
        this.setState({
          detail: (
            <Detail
              data={this.state.data}
              onClick={this.handleClick}
              match={this.props.match}
            />
          )
        });
      })
      .catch(error => {
        this.setState({ error: true });
      });
  }

  async handleClick() {
    const url = `/search?name=${this.props.match.params.name}&tag=${
      this.props.match.params.tag
    }&update=true`;

    this.setState({ loading: true });
    await fetch(url)
      .then(res => res.json())
      .then(user => {
        // error 발생시 알림 띄운다
        if (user.error) {
          this.setState({ error: true });
          return alert(user.error);
        }
        // 유저가 존재하면 이를 상태 data에 반영한다
        this.setState({ loading: false });
        this.setState({ data: user });
        this.setState({
          detail: (
            <Detail
              data={this.state.data}
              onClick={this.handleClick}
              match={this.props.match}
            />
          )
        });
      })
      .catch(error => {
        this.setState({ error: true });
      });

    return new Promise(resolve => {
      resolve(true);
    });
  }

  render() {
    const loading = this.state.loading;
    const error = this.state.error;

    if (error) {
      return <div className="profile">error!!!</div>;
    } else if (loading) {
      return <div className="profile">유저 정보를 가져오는 중...</div>;
    } else return <div className="profile">{this.state.detail}</div>;
  }
}
