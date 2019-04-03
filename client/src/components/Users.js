import React, { Component } from 'react';
import { User } from './User';


export class Users extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      users: [],
    }
  }

  sortByRank(a, b){
    if(a.rank.val > b.rank.val){
      return -1;
    }
    else if(a.rank.val < b.rank.val){
      return 1;
    }
    return 0;
  }

  async componentDidMount(){
    const url = this.props.match.path;
    await fetch(url)
    .then(res => res.json())
    .then((data) => {
      this.setState({ data: data });
    });

    const userComponents = await this.state.data.map( (user) => {
      const name = user.name;
      const tag = user.tag;
      const rank = user.rank;
      const level = user.level;
      const icon_image = user.icon;
      return <User name={name} tag={tag} rank={rank} level={level} icon_image={icon_image} />;
    });

    this.setState({ users: userComponents });
    
    console.log(this.state.users);
  }

  render() {
    return (
      <div>
        <p>Users Info</p>
        
      </div>
    )
  }
}
