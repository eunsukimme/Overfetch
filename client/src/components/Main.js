import React from 'react';
import { Profile } from './Profile';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      tag: '',
      user: undefined
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  /**
   * 
   * @param {event Object} e 
   * @dev name, tag input태그의 변화를 감지하고 state에 저장
   */
  handleChange(e) {
      this.setState({
          [e.target.name]: e.target.value
      })
  }

  /**
   * 
   * @param {event Object} e 
   * @dev state의 name, tag를 쿼리스트링으로 submit 한다
   */
  async handleSubmit(e) {
    e.preventDefault();
    const url = this.props.match.path+'search/?name='+this.state.name+'&tag='+this.state.tag;
    const urlencoded = encodeURI(url);

    await fetch(urlencoded)
    .then(res => res.json())
    .then((data) => {
        console.log(data);
        if(data.error){
            return alert(data.error);
        }
        const name = data.name;
        const tag = data.tag;
        const level = data.level;
        const rank = data.rank;
        const icon_image = data.icon;
        const lastestUpdate = data.update;
        const userProfile = <Profile name={name} tag={tag} level={level} rank={rank} 
            icon_image={icon_image} date={lastestUpdate} update={this.handleUpdate} />;
        this.setState({ user: userProfile })
    });
  }

  /**
   * 
   * @param {event Object} e 
   * @dev 유저의 프로필을 갱신하는 함수
   */
  async handleUpdate(e){
    const url = `${this.props.match.path}search?name=${this.state.name}&tag=${this.state.tag}&update=true`;
    const urlencoded = encodeURI(url);

    await fetch(urlencoded)
    .then(res => res.json())
    .then((data) => {
        console.log(data);
        if(data.error){
            return alert(data.error);
        }
        const name = data.name;
        const tag = data.tag;
        const level = data.level;
        const rank = data.rank;
        const icon_image = data.icon;
        const lastestUpdate = data.update;
        const userProfile = <Profile name={name} tag={tag} level={level} rank={rank} 
            icon_image={icon_image} date={lastestUpdate} update={this.handleUpdate} />;
        this.setState({ user: userProfile })
        alert('성공적으로 갱신하였습니다');
    })
  }

    render() {
        return (
            <div>
                <p>Welcome to Overfetch!!</p>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="name" onChange={this.handleChange} name="name"/>
                    <input type="text" placeholder="tag" onChange={this.handleChange} name="tag"/>
                    <button type="submit">fetch</button>
                </form>
                <div>
                    {this.state.user}
                </div>
            </div>
        )
    }
}