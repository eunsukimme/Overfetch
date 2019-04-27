import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Champion } from './champion/Champion';
import { Unknown } from './champion/Unknown';

export class Detail extends Component {
  constructor(props){
      super(props);
      this.state = {
        loading: false,
        error: false,
        buttons: [],
        championComponents: { },
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
        <Route path={`${this.props.match.url}/맥크리`} render={props => this.state.championComponents.맥크리} />
        <Route path={`${this.props.match.url}/메이`} render={props => this.state.championComponents.메이} />
        <Route path={`${this.props.match.url}/메르시`} render={props => this.state.championComponents.메르시} />
        <Route path={`${this.props.match.url}/모이라`} render={props => this.state.championComponents.모이라} />
        <Route path={`${this.props.match.url}/오리사`} render={props => this.state.championComponents.오리사} />
        <Route path={`${this.props.match.url}/파라`} render={props => this.state.championComponents.파라} />
        <Route path={`${this.props.match.url}/리퍼`} render={props => this.state.championComponents.리퍼} />
      </Router>
    )
  }
}
