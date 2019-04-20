import React, { Component } from 'react';
import * as d3 from "d3";

export class Profile extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      data: [1, 3, 2, 4, 5]
    }
  }

  async componentDidMount(){
    console.log(this.state.data);
    d3.select('svg')
    .selectAll('g.smaple')
    .data(this.state.data)
    .enter()
    .append('g')
    .attr('class', 'bar');

    const bars = d3.selectAll('.bar');
    const dataRange = d3.extent(this.state.data, (el) => el);
    const yScale = d3.scaleLinear().domain(dataRange).range([50, 380]);

    bars.append('rect')
    .attr('x', (d, i) => i * 50)
    .attr('y', (d) => 400 - yScale(d))
    .attr('width', 50)
    .attr('height', (d) => yScale(d))
    .style('fill', 'lightblue')
    .style('stroke', 'red')
    .style('stroke-width', '1px');

    // aggregation test
    
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
        <svg style={{width: '400px', height:'400px', border: '1px lightgray solid'}}></svg>
      </div>
    )
  }
}
