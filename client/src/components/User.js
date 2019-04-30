import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./css/user.css";

export class User extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="user-card">
        <h1 className="user-card-order">{this.props.order}</h1>
        <img className="user-card-image" src={this.props.icon_image} />
        <Link
          className="user-card-container"
          to={`/profile/${this.props.name}/${this.props.tag}`}
        >
          <h2 className="user-card-name">{this.props.name}</h2>
        </Link>
        <h3 className="user-card-level">Lv. {this.props.level}</h3>
        <img className="user-card-icon" src={this.props.rank.imageSrc} />
        <h3 className="user-card-rank">rank. {this.props.rank.val}</h3>
      </div>
    );
  }
}
