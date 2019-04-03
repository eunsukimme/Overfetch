import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export class Header extends Component {
  render() {
    return (
      <div>
          <nav>
              <li>
                  <Link to='/' >Home</Link>
              </li>
              <li>
                  <Link to='/users'>Users</Link>
              </li>
              <li>
                  <Link to='/about'>About</Link>
              </li>
          </nav>
      </div>
    )
  }
}
