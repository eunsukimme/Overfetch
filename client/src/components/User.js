import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./css/user.css";

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
      <tr
        className={
          this.props.type === "odd" ? "user-card odd" : "user-card even"
        }
      >
        <td className="user-card-order">
          <h1>{this.props.order}</h1>
        </td>
        <td>
          <img
            className="user-card-image"
            src={this.props.icon_image}
            alt="icon"
          />
        </td>
        <td>
          <Link
            className="user-name-container"
            to={`/profile/${this.props.name}/${this.props.tag}`}
          >
            <h2 className="user-card-name">{this.props.name}</h2>
          </Link>
        </td>
        <td>
          <h3 className="user-card-level">{this.props.level}</h3>
        </td>
        <td>
          <img
            className="user-card-icon"
            src={`https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-${GenerateRankIcon(
              this.props.rank.val
            )}Tier.png`}
            alt="icon"
          />
        </td>
        <td>
          <h3 className="user-card-rank">{this.props.rank.val}</h3>
        </td>
      </tr>
    );
  }
}
