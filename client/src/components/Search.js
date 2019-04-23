import React from 'react';
import {Link} from 'react-router-dom';

export class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            tag: '',
            user: undefined
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * 
     * @param {event Object} e 
     * @dev name, tag input태그의 변화를 감지하고 state에 저장
     */
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    /**
     * 
     * @param {event Object} e 
     * @dev state의 name, tag를 쿼리스트링으로 submit 한다
     */
    async handleSubmit(e) {
        e.preventDefault();
        if(!this.validateInput()){
            return alert('유저 이름과 배틀태그를 입력해 주세요');
        }
        this.props.history.push(`/profile/${this.state.name}/${this.state.tag}`);
    }

    validateInput(){
        if(this.state.name == ''){
            return false;
        }
        else if(this.state.tag == ''){
            return false;
        }
        return true;
    }

  render() {
    return (
      <div>
        <p>Welcome to Overfetch!!</p>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="name" onChange={this.handleChange} name="name"/>
          <input type="text" placeholder="tag" onChange={this.handleChange} name="tag"/>
          <Link to={`/profile/${this.state.name}/${this.state.tag}`}>Fetch</Link>
        </form>
      </div>
    )
  }
}
