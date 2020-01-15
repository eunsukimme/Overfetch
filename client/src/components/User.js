import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const UserContainer = styled.tr`
  width: 100%;
  margin: 0 auto;
  padding: 10px;
  height: 60px;
  border: 1px solid #444444;
  background-color: ${props => (props.type === "even" ? "#333333" : "none")};
`;
const StyledTd = styled.td`
  color: white;
  vertical-align: middle;
  text-decoration: none;
`;
const StyledImage = styled.img`
  display: inline-block;
  width: 44px;
  height: 44px;
`;

const GenerateRankIcon = rank => {
  return rank < 1500
    ? "Bronze"
    : rank < 2000
    ? "Silver"
    : rank < 2500
    ? "Gold"
    : rank < 3000
    ? "Platinum"
    : rank < 3500
    ? "Diamond"
    : rank < 4000
    ? "Master"
    : rank < 5000
    ? "Grandmaster"
    : undefined;
};

export class User extends Component {
  render() {
    return (
      <UserContainer type={this.props.type}>
        <StyledTd>{this.props.order}</StyledTd>
        <StyledTd>
          <StyledImage src={this.props.icon_image} alt="icon" />
        </StyledTd>
        <StyledTd>
          <Link
            style={{ color: "white" }}
            to={`/profile/${this.props.name}/${this.props.tag}`}
          >
            {this.props.name}
          </Link>
        </StyledTd>
        <StyledTd>{this.props.level}</StyledTd>
        <StyledTd>
          <StyledImage
            src={`https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-${GenerateRankIcon(
              this.props.rank.val
            )}Tier.png`}
            alt="icon"
          />
        </StyledTd>
        <StyledTd>{this.props.rank.val}</StyledTd>
      </UserContainer>
    );
  }
}
