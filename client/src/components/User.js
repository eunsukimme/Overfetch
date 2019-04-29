import React, { Component } from "react";
import { Link } from "react-router-dom";

export class User extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <img src={this.props.icon_image} />
        <Link to={`/profile/${this.props.name}/${this.props.tag}`}>
          <h2>
            {this.props.name}#{this.props.tag}
          </h2>
        </Link>
        <h3>level: {this.props.level}</h3>
        <h3>rank: {this.props.rank.val}</h3>
        <img src={this.props.rank.imageSrc} />
      </div>
    );
  }
}
