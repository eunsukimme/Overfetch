import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import "./css/header.css";

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      button_click: false
    };
    this.closeButtonClick = this.closeButtonClick.bind(this);
  }

  closeButtonClick() {
    this.setState(prevState => ({
      button_click: !prevState.button_click
    }));
  }

  render() {
    return (
      <header className="header">
        <Link to="/" className="menu logo">
          <img
            className="logo-icon"
            src="../../../document/header_logo.png"
            alt="header"
          />
          <h1 className="logo-title">OVERFETCH</h1>
        </Link>
        <nav className="header-right">
          <div
            onClick={this.closeButtonClick}
            className={
              this.state.button_click ? "change close-button" : "close-button"
            }
          >
            <div className="bar1" />
            <div className="bar2" />
            <div className="bar3" />
          </div>
          <div className={this.state.button_click ? "menu-show" : "menu-hide"}>
            <NavLink to="/" exact className="menu" activeClassName="active">
              홈
            </NavLink>
            <NavLink
              to="/users/rank/1"
              className="menu"
              activeClassName="active"
            >
              리더보드
            </NavLink>
            <NavLink to="/statistics" className="menu" activeClassName="active">
              영웅 통계
            </NavLink>
            <NavLink to="/about" className="menu" activeClassName="active">
              소개
            </NavLink>
          </div>
        </nav>
      </header>
    );
  }
}
