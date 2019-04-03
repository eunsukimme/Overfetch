import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      tag: '',
      user: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
      this.setState({
          [e.target.name]: e.target.value
      })
  }

  async handleSubmit(e) {
    e.preventDefault();
    const url = this.props.match.path+
                '?name='+this.state.name+'&tag='+this.state.tag;
    await fetch(url)
    .then(res => res.json())
    .then((data) => {
        console.log(data);
    });
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
            </div>
        )
    }
}