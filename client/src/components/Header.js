import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink
} from "react-router-dom";
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
          OVERFETCH
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
              Home
            </NavLink>
            <NavLink to="/users" className="menu" activeClassName="active">
              Users
            </NavLink>
            <NavLink to="/about" className="menu" activeClassName="active">
              About
            </NavLink>
          </div>
        </nav>
      </header>
    );
  }
}
