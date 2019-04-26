import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Champion } from './champion/Champion';
import { Unknown } from './champion/Unknown';
import * as d3 from 'd3';

export class Detail extends Component {
  constructor(props){
      super(props);
      this.state = {
        champion: {},
        loading: false,
        error: false,
        buttons: [],
        championComponents: {
            '둠피스트': <Unknown />,
            '겐지': <Unknown />,
            'D-Va': ''

        },
      }
      this.handleClick = this.handleClick.bind(this);
  }

  async fetchData(){
    this.setState({ loading: true });

    // 유저의 경쟁전 플레이 영웅이름을 가져온다
    const keys = Object.keys(this.props.data.rankplay.record);
    const except = keys.indexOf('모든영웅');
    keys.splice(except, 1); // 모든영웅 필드 제거

    // 경쟁전 플레이 영웅별로 시각화할 레코드를 가져온다
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

            this.setState(prevState => ({
                championComponents: {
                    ...prevState.championComponents,
                    [el]: <Champion championName={el} userData={this.props.data} championData={data} />
                }
            }));
            
            return new Promise((resolve) => {
                resolve(true);
            });
        })
        .catch((error) => {
            //this.setState({ error: true });
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
    console.log(this.state.championComponents);
    this.setState({ loading: false });

    // tset
    //this.vizDoomfist();

    const _buttons = keys.map((el) => {
        return <li><Link to={`${this.props.match.url}/${el}`}>{el}</Link></li>
    })
    this.setState({ buttons: _buttons });

    return new Promise((resolve) => {
        resolve(true);
    });
  }

  componentDidMount(){
    this.fetchData();
  }

  async handleClick(e) {
      console.log('updating...');
      this.setState({ loading: true });
      await this.props.onClick();
      this.setState({ loading: false });
      console.log(this.props);
  }

  vizDoomfist(){
    /* visualizing */
    const min_field = '평균_게임당_기술로 준 피해_최소';
    const min = this.state.champion.둠피스트[0][min_field];
    const max_field = '평균_게임당_기술로 준 피해_최대';
    const max = this.state.champion.둠피스트[0][max_field];
    const avg_field = '평균_게임당_기술로 준 피해';
    const avg_val = this.state.champion.둠피스트[0][avg_field];

    const my_val = this.props.data.rankplay.record.둠피스트.영웅별['기술로 준 피해'] / this.props.data.rankplay.record.둠피스트.게임['치른 게임'];
    
    const dataSet = [min, my_val, avg_val, max];
    console.log(dataSet);

    const doomfistYScale = d3.scaleLinear()
    .domain([min, max]).range([40, 360]);

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
    const error = this.state.error;
    const loading = this.state.loading;

    if(error){
        return <p>error!!!</p>
    }
    else if(loading){
        return <p>게임 데이터를 가져오는 중...</p>
    }
    return (
      <Router>
        <div>
          <div>
            <img src={this.props.data.icon} />
            <h1>{this.props.data.name}#{this.props.data.tag}</h1>
            <button onClick={this.handleClick} name="update">갱신</button>
            <h2>rank: {this.props.data.rank.val}</h2>
            <h3>level: {this.props.data.level}</h3>
            <h4>마지막 갱신: {this.props.data.update}</h4>
            <img src={this.props.data.rank.imageSrc} />
          </div>
          <div>
              <ul>
                  {this.state.buttons}
              </ul>
          </div>
        </div>
        <Route path={`${this.props.match.url}/아나`} render={props => this.state.championComponents.아나 } />
        <Route path={`${this.props.match.url}/애쉬`} render={props => this.state.championComponents.애쉬 } />
        <Route path={`${this.props.match.url}/바티스트`} render={props => this.state.championComponents.바티스트 } />
        <Route path={`${this.props.match.url}/바스티온`} render={props => this.state.championComponents.바스티온 } />
        <Route path={`${this.props.match.url}/브리기테`} render={props => this.state.championComponents.브리기테 } />
        <Route path={`${this.props.match.url}/D-Va`} render={props => this.state.championComponents['D-Va'] } />
        <Route path={`${this.props.match.url}/둠피스트`} render={props => this.state.championComponents.둠피스트 }  />
        <Route path={`${this.props.match.url}/겐지`} render={props => this.state.championComponents.겐지} />
        <Route path={`${this.props.match.url}/한조`} render={props => this.state.championComponents.한조} />
        <Route path={`${this.props.match.url}/정크랫`} render={props => this.state.championComponents.정크랫} />
        <Route path={`${this.props.match.url}/루시우`} render={props => this.state.championComponents.루시우} />
      </Router>
    )
  }
}
