import React, { Component } from 'react'

export class Champion extends Component {
  constructor(props){
      super(props);
  }

  render() {
    return (
      <div>
        {this.props.championName}
      </div>
    )
  }
}
