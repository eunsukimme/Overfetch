import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import './css/header.css';

export class Header extends Component {
  render() {
    return (
      <header className='header'>
        <Link to='/' className='menu logo' >OVERFETCH</Link>
        <nav class="header-right">
          <NavLink to='/' exact className='menu' activeClassName='active'>Home</NavLink>
          <NavLink to='/users' className='menu' activeClassName='active'>Users</NavLink>
          <NavLink to='/about' className='menu' activeClassName='active'>About</NavLink>
        </nav>
      </header>
    )
  }
}
