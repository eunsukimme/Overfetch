import React, { Component } from 'react'

export class User extends Component {
  constructor(props){
      super(props);
  }
  render() {
    return (
      <div>
        <h2>{this.props.name}#{this.props.tag}</h2>
        <h3>level: {this.props.level}</h3>
        <h3>rank: {this.props.rank}</h3> 
      </div>
    )
  }
}
