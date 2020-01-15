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
          <p>{this.props.order}</p>
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
            <p className="user-card-name">{this.props.name}</p>
          </Link>
        </td>
        <td>
          <p className="user-card-level">{this.props.level}</p>
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
          <p className="user-card-rank">{this.props.rank.val}</p>
        </td>
      </tr>
    );
  }
}
