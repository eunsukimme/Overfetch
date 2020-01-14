import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import TitleLogoImage from "../assets/img/title_logo_white.png";
import LogoImage from "../assets/img/overfetch_logo.png";
import styled from "styled-components";

const HeaderContainer = styled.div`
  width: 100%;
  min-height: 7vh;

  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: black;

  @media (max-width: 800px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const Logo = styled(Link)`
  width: 140px;
  height: 6.5vh;
  margin-left: 40px;
  background-image: url(${TitleLogoImage});
  background-size: contain;
  background-position: 50% 50%;
  background-repeat: no-repeat;

  @media (max-width: 800px) {
    width: 120px;
    margin-left: 0px;
  }
  @media (max-width: 500px) {
    background-image: url(${LogoImage});
  }
`;

const Navigation = styled.div`
  display: flex;
  align-items: center;
  margin-right: 40px;

  @media (max-width: 800px) {
    width: 100%;
    margin-right: 0px;
    display: ${props => (props.show ? "flex" : "none")};
    flex-direction: column;
  }
`;

const StyledLink = styled(Link)`
  padding: 0px 20px;
  color: white;
  font-size: 1.2rem;
  text-decoration: none;
  @media (max-width: 800px) {
    margin: 20px 0px;
  }
`;

const MobileNavigation = styled.div`
  display: none;
  margin-right: 20px;
  @media (max-width: 800px) {
    position: absolute;
    top: 1.5vh;
    right: 0;
    display: block;
  }
`;

const Bar = styled.div`
  width: 24px;
  height: 1px;
  margin: 6px 0px;
  background-color: white;
  transition: 0.4s;
`;

const Bar1 = styled(Bar)`
  -webkit-transform: ${props =>
    props.change ? "rotate(-45deg) translate(-8px, 3px)" : "none"};
  transform: ${props =>
    props.change ? "rotate(-45deg) translate(-8px, 3px)" : "none"};
`;

const Bar2 = styled(Bar)`
  opacity: ${props => (props.change ? "0" : "100%")};
`;

const Bar3 = styled(Bar)`
  -webkit-transform: ${props =>
    props.change ? "rotate(45deg) translate(-8px, -3px)" : "none"};
  transform: ${props =>
    props.change ? "rotate(45deg) translate(-8px, -3px)" : "none"};
`;

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      button_click: false
    };
    this.closeButtonClick = this.closeButtonClick.bind(this);
    this.NavigationRef = React.createRef();
  }

  closeButtonClick() {
    this.setState(prevState => ({
      button_click: !prevState.button_click
    }));
  }

  render() {
    return (
      <HeaderContainer>
        <Logo to="/"></Logo>
        <MobileNavigation onClick={this.closeButtonClick}>
          <Bar1 change={this.state.button_click} />
          <Bar2 change={this.state.button_click} />
          <Bar3 change={this.state.button_click} />
        </MobileNavigation>
        <Navigation ref={this.NavigationRef} show={this.state.button_click}>
          <StyledLink to="/users/rank/1">Leaderboard</StyledLink>

          <StyledLink to="/statistics">Statistics</StyledLink>

          <StyledLink to="/about">About</StyledLink>
        </Navigation>
      </HeaderContainer>
    );
  }
}
