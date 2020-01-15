import React, { Component } from "react";
import { Link } from "react-router-dom";
import { User } from "./User";
// import "./css/users.css";
import styled from "styled-components";

const LeaderboardContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #222222;
`;

const ErrorAndLoadingContainer = styled(LeaderboardContainer)`
  padding-top: 80px;
  text-align: center;
  font-size: 1.5rem;
`;

const LeaderboardHead = styled.div`
  width: 60%;
  padding: 40px 0px;
  display: flex;
  flex-direction: column;

  @media (max-width: 800px) {
    padding: 30px 0px;
    width: 80%;
  }
  @media (max-width: 500px) {
    padding: 20px 0px;
    width: 92%;
  }
`;

const LeaderboardTitle = styled.div`
  font-size: 3rem;
  padding: 20px 0px;
  color: white;

  @media (max-width: 800px) {
    font-size: 2.5rem;
  }
  @media (max-width: 500px) {
    font-size: 2rem;
  }
`;
const LeaderboardCriteriaButtonContainer = styled.div`
  width: 100%;
  display: flex;
`;
const CriteriaButton = styled(Link)`
  width: 120px;
  padding: 10px;
  margin-right: 20px;

  text-align: center;
  color: white;
  background-color: #444444;
  border-radius: 2px;
  @media (max-width: 800px) {
    font-size: 14px;
    width: 100px;
  }
  @media (max-width: 500px) {
    font-size: 10px;
    width: 80px;
  }
`;

const LeaderboardMain = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const LeaderboardTable = styled.table`
  width: 60%;
  color: white;

  @media (max-width: 800px) {
    font-size: 14px;
    width: 80%;
  }
  @media (max-width: 500px) {
    font-size: 12px;
    width: 92%;
  }
`;
const LeaderboardThead = styled.thead``;
const LeaderboardTbody = styled.tbody`
  text-align: center;
`;
const StyledTr = styled.tr`
  padding: 10px;
  height: 60px;
  border: 1px solid #444444;
`;
const LeaderboardTh = styled.th`
  vertical-align: middle;
`;
const PageButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 30px;
`;
const PageButton = styled(Link)`
  border: none;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 10px;
  background-color: #222222;
  color: white;
  cursor: pointer;
  :hover {
    background-color: white;
    color: #222222;
    transition-duration: 0.5s;
  }
`;
const TopButton = styled.button`
  display: none;
  position: fixed;
  bottom: 50px;
  right: 50px;
  background-color: white;
  color: black;
  z-index: 99;
  width: 50px;
  height: 50px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  :hover {
    border: 1px solid white;
    background-color: #222222;
    color: white;
    transition-duration: 0.5s;
  }
`;

export class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userComponents: [],
      criteria: this.props.match.params.criteria,
      page: this.props.match.params.page,
      buttonComponets: [],
      loading: false,
      error: false,
      errorMsg: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidUpdate(prevProps) {
    const {
      match: {
        params: { page, criteria }
      }
    } = this.props;
    if (
      prevProps.match.params.page !== page ||
      prevProps.match.params.criteria !== criteria
    ) {
      await this.setState({
        page: page,
        criteria: criteria
      });
      await this.fetchData();
      await this.updateUserComponents();
      await this.addButtons();
    }
  }

  /**
   * @dev 컴포넌트가 마운트 되었을때, 유저의 리스트를 쿼리한다
   *      디폴트로 랭크순으로 첫 페이지를 보여준다
   */
  async componentDidMount() {
    this.scrollToTop();
    // 스크롤 함수 바인딩
    window.addEventListener("scroll", this.handleScroll);

    await this.fetchData();
    await this.updateUserComponents();
    await this.addButtons();
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
    const url = `/api/users/${this.state.criteria}/${this.state.page}`;

    await fetch(url)
      .then(res => res.json())
      .then(_data => {
        if (_data.error) {
          this.setState({
            error: true,
            loading: false,
            errorMsg: _data.error
          });
          return alert(_data.error);
        }
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
      let type = i % 2 === 0 ? "even" : "odd"; // 홀수 & 짝수 구분
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
        <PageButton
          key="before"
          className="leaderboard-button"
          to={`/users/${this.state.criteria}/${(Math.floor(
            this.state.page / 10
          ) -
            1) *
            10 +
            1}`}
        >{`<`}</PageButton>
      );
    }

    for (startPage = Number(startPage); startPage < endPage; startPage++) {
      if (startPage === 0) continue;
      buttons.push(
        <PageButton
          className="leaderboard-button"
          to={`/users/${this.state.criteria}/${startPage}`}
          value={`${startPage}`}
          key={`${startPage}`}
        >
          {startPage}
        </PageButton>
      );
    }
    // 다음 범위로 넘어가는 버튼을 생성한다
    buttons.push(
      <PageButton
        key="next"
        className="leaderboard-button"
        to={`/users/${this.state.criteria}/${(Math.floor(this.state.page / 10) +
          1) *
          10}`}
      >
        >
      </PageButton>
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
   * @param {event Object} e 스크롤 할 때 발생하는 이벤트
   * @dev 유저가 스크롤을 하면 맨 위로 올리는 버튼을 보이게 만든다
   */
  handleScroll(e) {
    // 스크롤을 100 이상 하면
    const topButton = document.getElementById("leaderboard-button-to-top");
    if (topButton !== null) {
      if (
        document.body.scrollTop > 500 ||
        document.documentElement.scrollTop > 500
      ) {
        topButton.style.display = "block";
      } else {
        topButton.style.display = "none";
      }
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
        <ErrorAndLoadingContainer className="error">
          <p>{this.state.errorMsg}</p>
        </ErrorAndLoadingContainer>
      );
    } else if (loading) {
      return (
        <ErrorAndLoadingContainer className="loading">
          <p>랭킹 데이터를 가져오는 중...</p>
          <div className="lds-dual-ring" />
          <TopButton id="leaderboard-button-to-top" onClick={this.scrollToTop}>
            Top
          </TopButton>
        </ErrorAndLoadingContainer>
      );
    }
    return (
      <LeaderboardContainer>
        <LeaderboardHead>
          <LeaderboardTitle>Leaderboard</LeaderboardTitle>
          <LeaderboardCriteriaButtonContainer>
            <CriteriaButton to={`/users/rank/${this.state.page}`}>
              경쟁전 평점 순
            </CriteriaButton>
            <CriteriaButton to={`/users/level/${this.state.page}`}>
              레벨 순
            </CriteriaButton>
          </LeaderboardCriteriaButtonContainer>
        </LeaderboardHead>
        <LeaderboardMain>
          <LeaderboardTable>
            <LeaderboardThead>
              <StyledTr className="leaderboard-bottom-table-header">
                <LeaderboardTh className="table-header-order">
                  순위
                </LeaderboardTh>
                <LeaderboardTh colSpan="2">유저 정보</LeaderboardTh>
                <LeaderboardTh>레벨</LeaderboardTh>
                <LeaderboardTh colSpan="2">경쟁전 점수</LeaderboardTh>
              </StyledTr>
            </LeaderboardThead>
            <LeaderboardTbody>{this.state.userComponents}</LeaderboardTbody>
          </LeaderboardTable>
          <PageButtonContainer className="leaderboard-bottom-buttons-container">
            {this.state.buttonComponets}
          </PageButtonContainer>
        </LeaderboardMain>
        <TopButton id="leaderboard-button-to-top" onClick={this.scrollToTop}>
          Top
        </TopButton>
      </LeaderboardContainer>
    );
  }
}
