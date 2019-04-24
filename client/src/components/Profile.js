import React from 'react';
import { Detail } from './Detail';
import * as d3 from "d3";

export class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: '',
      detail: undefined,
      loading: true,
      error: false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount(){
    const url = `/search?name=${this.props.match.params.name}&tag=${this.props.match.params.tag}`;

    await fetch(url)
    .then(res => res.json())
    .then((user) => {

      // error 발생시 알림 띄운다
      if(user.error){
        this.setState({ error: true });
        return alert(user.error);
      }
      // 유저가 존재하면 이를 상태 data에 반영한다
      this.setState({ loading: false });
      this.setState({ data: user });
      this.setState({ detail: <Detail data={this.state.data} onClick={this.handleClick} match={this.props.match} /> });
    })
    .catch((error) => {
      this.setState({ error: true });
    });
    
  }

  async handleClick(){
    const url = `/search?name=${this.props.match.params.name}&tag=${this.props.match.params.tag}&update=true`;

    this.setState({ loading: true });
    await fetch(url)
    .then(res => res.json())
    .then((user) => {
      // error 발생시 알림 띄운다
      if(user.error){
        this.setState({ error: true });
        return alert(user.error);
      }
      // 유저가 존재하면 이를 상태 data에 반영한다
      this.setState({ loading: false });
      this.setState({ data: user });
      this.setState({ detail: <Detail data={this.state.data} onClick={this.handleClick} match={this.props.match} /> });
    })
    .catch((error) => {
      this.setState({ error: true });
    });

    return new Promise((resolve) => {
      resolve(true);
    })
  }

  render() {
    const loading = this.state.loading;
    const error = this.state.error;

    if(error){
      return <p>error!!!</p>
    }
    else if(loading){
      return <p>유저 정보를 가져오는 중...</p>
    }
    else return (
      /*<div>
        <img src={this.props.icon_image} />
        <h1>{this.props.name}#{this.props.tag}</h1>
        <button onClick={this.handleClick} name="update">갱신</button>
        <h2>rank: {this.props.rank.val}</h2>
        <h3>level: {this.props.level}</h3>
        <h4>마지막 갱신: {this.props.date}</h4>
        <img src={this.props.rank.imageSrc} />
        <svg style={{width: '400px', height:'400px', border: '1px lightgray solid'}}></svg>
      </div>*/
      <div>
        Hello {this.props.match.params.name}#{this.props.match.params.tag}!
        {this.state.detail}
      </div>
    )
  }
}
