import React, { Component } from 'react';
import * as d3 from 'd3';

export class Detail extends Component {
  constructor(props){
      super(props);
      this.state = {
        champion: {},
        loading: true
      }
  }

  async componentDidMount(){
    const keys = Object.keys(this.props.data.rankplay.record);
    const except = keys.indexOf('모든영웅');
    keys.splice(except, 1); // 모든영웅 필드 제거
    console.log(keys);

    const result = await keys.map(async (el) => {
        // 존재하는 각 영웅이름 의 레코드를 가져온다
        const url = '/avg/rankplay/champion/'+el+'?rank='+this.props.data.rank.val;
        const result = await fetch(url)
        .then(res => res.json())
        .then((data) => {
            this.setState(prevState => ({ 
                champion: {
                    ...prevState.champion,
                    [el] : data
                }
            }));
            return new Promise((resolve) => {
                resolve(true);
            });
        })
        .catch((error) => {
            console.log(error);
            return new Promise((resolve) => {
                resolve(false);
            });
        });
        return new Promise((resolve) => {
            resolve(result);
        });
    });
    await Promise.all(result);
    console.log(this.state.champion);

    /* visualizing */
    console.log(this.state.champion.둠피스트[0]);
    const min_field = '평균_게임당_기술로 준 피해_최소';
    const min = this.state.champion.둠피스트[0][min_field];
    console.log(min);
    const max_field = '평균_게임당_기술로 준 피해_최대';
    const max = this.state.champion.둠피스트[0][max_field];
    console.log(max);
    const avg_field = '평균_게임당_기술로 준 피해';
    const avg_val = this.state.champion.둠피스트[0][avg_field];
    console.log(avg_val);

    const my_val = this.props.data.rankplay.record.둠피스트.영웅별['기술로 준 피해'] / this.props.data.rankplay.record.둠피스트.게임['치른 게임'];
    
    const dataSet = [min, my_val, avg_val, max];
    console.log(dataSet);

    const doomfistYScale = d3.scaleLinear()
    .domain([min, max]).range([40, 360]);

    console.log(doomfistYScale(my_val));

    d3.select('svg')
    .selectAll('rect.doomfist')
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('x', (d, i) => 100*i)
    .attr('y', (d) => 400 - doomfistYScale(d))
    .attr('width', '100px')
    .transition()
    .duration(1000)
    .attr('height', (d) => doomfistYScale(d))
    .style('fill', 'lightblue')
    .style('stroke', 'red')
    .style('stroke-width', '1px');

  }

  render() {
    console.log(this.props);
    return (
      <div>
        <img src={this.props.data.icon} />
        <h1>{this.props.data.name}#{this.props.data.tag}</h1>
        <button onClick={this.handleClick} name="update">갱신</button>
        <h2>rank: {this.props.data.rank.val}</h2>
        <h3>level: {this.props.data.level}</h3>
        <h4>마지막 갱신: {this.props.data.update}</h4>
        <img src={this.props.data.rank.imageSrc} />
        <svg style={{width: '400px', height:'400px', border: '1px lightgray solid'}}></svg>
      </div>
    )
  }
}
