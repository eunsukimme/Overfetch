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
      error: false,
      errorMsg: ""
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    this.scrollToTop();

    const url = `/profile/${this.props.match.params.name}/${
      this.props.match.params.tag
    }`;
    console.log(url);

    await this.fetchData(url);
  }

  async fetchData(url, update = false) {
    this.setState({ loading: true });
    // updaet 가 true라면, 즉 갱신 요청이면 body에 update 키를 추가하여 전송
    if (update === true) {
      await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          update: "true"
        })
      })
        .then(res => res.json())
        .then(user => {
          // error 발생시 알림 띄운다
          if (user.error) {
            this.setState({
              error: true,
              loading: false,
              errorMsg: user.error
            });
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
          console.log(error);
          this.setState({
            error: true,
            loading: false
          });
        });
    }
    // update 를 하지 않는, 즉 일반 유저 쿼리라면 그냥 GET 해온다
    await fetch(url)
      .then(res => res.json())
      .then(user => {
        // error 발생시 알림 띄운다
        if (user.error) {
          this.setState({
            error: true,
            loading: false,
            errorMsg: user.error
          });
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
        console.log(error);
        this.setState({
          error: true,
          loading: false
        });
      });

    return new Promise(resolve => {
      resolve(true);
    });
  }

  async handleClick() {
    const url = `/profile/${this.props.match.params.name}/${
      this.props.match.params.tag
    }`;

    await this.fetchData(url, true);
  }

  scrollToTop(e) {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  render() {
    const loading = this.state.loading;
    const error = this.state.error;

    if (error) {
      return (
        <div className="error">
          <p>{this.state.errorMsg}</p>
        </div>
      );
    } else if (loading) {
      return (
        <div className="loading">
          <p>유저 정보를 가져오는 중...</p>
          <div className="lds-dual-ring" />
        </div>
      );
    } else return <div className="profile">{this.state.detail}</div>;
  }
}
