import React, { Component } from 'react';
import * as d3 from 'd3';

export class Champion extends Component {
  constructor(props){
      super(props);
  }

  componentDidMount(){
    this.visualizeData();
  }

  async visualizeData(){
    const data = this.props.championData[0];
    console.log(data);
    const keys = Object.keys(data);


    keys.forEach((el, i) => {
      if(el == '_id') 
        return;

      console.log(el);
      const min = data[el]['min'].toFixed(2);
      const avg = data[el]['avg'].toFixed(2);
      const max = data[el]['max'].toFixed(2);
      const tokens = el.split('_'); // '평균' '게임당' 문자열 제외
      const field = tokens[2];

      const value = this.props.userData.rankplay.record[`${this.props.championName}`].영웅별[field];
      const play = this.props.userData.rankplay.record[`${this.props.championName}`].게임['치른 게임'];
      const my_val = ( value / play ).toFixed(2);


      const dataSet = [min, my_val, avg, max];
      console.log(dataSet);

      const championYScale = d3.scaleLinear().domain([min, max]).range([40, 360]).clamp(true);

      // svg 생성
      const bar_graph = d3.select('#viz')
      .append('svg')
      .attr('id', `${this.props.championName}_${i}`)
      .attr('width', '400px')
      .attr('height', '400px')
      .style('border', '1px lightgray solid');

      // bar-graph의 타이틀 생성
      bar_graph.append('text')
      .attr('y', 30)
      .html(el);

      // g생성하고 그 안에 또 g를 생성(막대 그래프+라벨 포함) 생성
      // 각 막대를 저장하는 g 를 bars 라는 변수에 할당
      const bars = d3.select(`#${this.props.championName}_${i}`)
      .append('g')
      .attr('class', `bar_graph`)
      .selectAll('g')
      .data(dataSet)
      .enter()
      .append('g')
      .attr('class', 'bar')
      .attr('transform', (d, i) => `translate(${i*100}, 0)`);

      // 각 g 에 막대 할당
      bars.append('rect')
      .attr('width', '50px')
      .attr('y', (d, i) => 400 - championYScale(d))
      .transition()
      .duration(1500)
      .attr('height', (d) => championYScale(d))
      .style('fill', 'lightblue')
      .style('stroke', 'lightgray')
      .style('stroke-width', '1px');

      // 각 bar 에 라벨(값) 생성
      bars.append('text')
      .text((d) => d)
      .attr('y', (d) => 400 - championYScale(d) - 10)
      .style('text-anchor', 'left');

      // 각 bar 에 라벨(기준) 생성
      bars.append('text')
      .data(['min', 'my', 'avg', 'max'])
      .text((d) => d)
      .attr('y', 390)
      .style('text-anchor', 'left');

      function mouseOver(d, i) {
        console.log(d);
      }

      // 각 막대에 마우스 오버 함수 생성
      d3.selectAll('rect')
      .on('mouseover', mouseOver);

    });
  }

  render() {
    console.log(this.props);
    return (
      <div>
        {this.props.championName}
        <div id='viz'>
        </div>
      </div>
    )
  }
}
