import React, { Component } from 'react'

export class Profile extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

 async handleClick(e){
      this.props.update();
  }

  render() {
    return (
      <div>
        <img src={this.props.icon_image} />
        <h1>{this.props.name}#{this.props.tag}</h1>
        <button onClick={this.handleClick} name="update">갱신</button>
        <h2>rank: {this.props.rank.val}</h2>
        <h3>level: {this.props.level}</h3>
        <h4>마지막 갱신: {this.props.date}</h4>
        <img src={this.props.rank.imageSrc} />
      </div>
    )
  }
}
