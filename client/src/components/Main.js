import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import OW_origin_logo from "../assets/img/OW_origin_logo_white.png";
import video from "../assets/video/main_background.mp4";

const MainContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const VideoContainer = styled.div`
  position: absolute;
  top: 7vh;
  left: 0;
  width: 100%;
  height: 93vh;
  z-index: -1;

  opacity: 0.3;
`;

const Video = styled.video`
  min-width: 100%;
  min-height: 100%;
  src: ${props => props.src};

  @media (max-width: 800px) {
    display: none;
  }
`;

const MobileBackground = styled.div`
  display: none;
  width: 100%;
  height: 100%;
  background-image: url(https://media.giphy.com/media/2g8EYDN0VWFMY/giphy.gif);
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;

  @media (max-width: 800px) {
    display: block;
  }
`;

const SearchContainer = styled.div`
  width: 100%;
  height: 93vh;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  background-color: #000000aa;
  @media (max-width: 500px) {
    background-color: #000000d0;
  }
`;

const OWLogo = styled.div`
  width: 500px;
  height: 280px;
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-top: 20vh;
  margin-bottom: 60px;

  @media (max-width: 800px) {
    margin-top: 16vh;
    width: 400px;
    height: 200px;
  }
  @media (max-width: 500px) {
    margin-top: 12vh;
    width: 300px;
    height: 140px;
  }
`;

const Form = styled.form`
  width: 60%;
  height: 50px;
  display: flex;

  border: 1px solid white;

  @media (max-width: 800px) {
    width: 70%;
    height: 46px;
  }
  @media (max-width: 500px) {
    width: 80%;
    height: 40px;
  }
`;

const Input = styled.input`
  width: 80%;
  height: 100%;
  font-size: 1.4rem;
`;

const Button = styled(Link)`
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #00000066;
  cursor: pointer;
`;

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      tag: "",
      user: undefined
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   *
   * @param {event Object} e
   * @dev name, tag input태그의 변화를 감지하고 state에 저장
   */
  handleChange(e) {
    const tokens = e.target.value.split("#");
    this.setState({
      name: tokens[0],
      tag: tokens[1]
    });
  }

  /**
   *
   * @param {event Object} e
   * @dev state의 name, tag를 쿼리스트링으로 submit 한다
   */
  async handleSubmit(e) {
    e.preventDefault();
    console.log(this.state.name, this.state.tag);
    if (!this.validateInput()) {
      return alert("유저 이름과 배틀태그를 입력해 주세요");
    }
    this.props.history.push(`/profile/${this.state.name}/${this.state.tag}`);
  }

  validateInput() {
    if (this.state.name === undefined || this.state.name === "") {
      return false;
    } else if (this.state.tag === undefined || this.state.tag === "") {
      return false;
    }
    return true;
  }

  render() {
    return (
      <MainContainer>
        <VideoContainer>
          <Video src={video} autoPlay loop playsInline></Video>
          <MobileBackground></MobileBackground>
        </VideoContainer>
        <SearchContainer>
          <OWLogo src={OW_origin_logo}></OWLogo>

          <Form onSubmit={this.handleSubmit}>
            <Input
              type="text"
              placeholder="name#tag"
              onChange={this.handleChange}
            />
            <Button
              onClick={this.handleSubmit}
              to={`/profile/${this.state.name}/${this.state.tag}`}
            >
              Fetch
            </Button>
          </Form>
        </SearchContainer>
      </MainContainer>
    );
  }
}
