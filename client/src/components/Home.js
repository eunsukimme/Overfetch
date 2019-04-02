import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Header } from './Header';
import { Body } from './Body';
import { Users } from './Users';
import { About } from './About';
import { Footer } from './Footer';

export class Home extends Component {
  render() {
    return (
      <Router>
          <Header />
          <Route path='/' exact component={Body} />
          <Route path='/users' component={Users} />
          <Route path='/about' component={About} />
          <Footer />
      </Router>
    )
  }
}
