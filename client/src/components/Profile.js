import React from "react";
import { Detail } from "./Detail";
// import "./css/profile.css";
import styled from "styled-components";

const ProfileContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #222222;
  color: white;
`;

const ErrorAndLoadingContainer = styled(ProfileContainer)`
  padding-top: 80px;
  text-align: center;
  font-size: 1.5rem;
`;

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

    const url = `/api/profile/${this.props.match.params.name}/${this.props.match.params.tag}`;

    await this.fetchData(url);
  }

  async fetchData(url, update = "false") {
    this.setState({ loading: true });
    // update 파라미터는 쿼리스트링으로 포함해서 전송
    url = `${url}?update=${update}`;
    console.log(url);
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
    const url = `/api/profile/${this.props.match.params.name}/${this.props.match.params.tag}`;

    await this.fetchData(url, "true");
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
        <ErrorAndLoadingContainer className="error">
          <p>{this.state.errorMsg}</p>
        </ErrorAndLoadingContainer>
      );
    } else if (loading) {
      return (
        <ErrorAndLoadingContainer className="loading">
          <p>유저 정보를 가져오는 중...</p>
          <div className="lds-dual-ring" />
        </ErrorAndLoadingContainer>
      );
    } else
      return (
        <ProfileContainer className="profile">
          {this.state.detail}
        </ProfileContainer>
      );
  }
}
