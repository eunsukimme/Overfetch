import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Header } from './Header';
import { Search } from './Search';
import { Profile } from './Profile';
import { Users } from './Users';
import { About } from './About';
import { Footer } from './Footer';
import { GlobalStyle } from '../globalStyles';

export class Home extends Component {
  render() {
    return (
      <Router>
        <main>
          <GlobalStyle />
          <Header />
          <Route path='/' exact component={Search} />
          <Route path='/profile/:name/:tag' component={Profile}></Route>
          <Route path='/users' component={Users} />
          <Route path='/about' component={About} />
          <Footer />
        </main>
      </Router>
    )
  }
}
