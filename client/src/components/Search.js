import React from "react";
import { Link } from "react-router-dom";
import "./css/search.css";

export class Search extends React.Component {
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
    if (this.state.name == undefined || this.state.name == "") {
      return false;
    } else if (this.state.tag == undefined || this.state.tag == "") {
      return false;
    }
    return true;
  }

  render() {
    return (
      <div className="search">
        <div className="background-video-container">
          <video
            className="background-video"
            autoPlay
            loop
            playsInline="playsinline"
          >
            <source
              src="../../../document/main_background.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <h1 className="intro" style={{ color: "white" }}>
          Welcome to OVERFETCH
        </h1>
        <div className="search-content">
          <form onSubmit={this.handleSubmit}>
            <input
              name="search"
              type="text"
              placeholder="name#tag"
              onChange={this.handleChange}
            />
            <Link
              onClick={this.handleSubmit}
              className="button"
              to={`/profile/${this.state.name}/${this.state.tag}`}
            >
              Fetch
            </Link>
          </form>
        </div>
      </div>
    );
  }
}
