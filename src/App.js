import React, { Component } from 'react';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>
          <Route path="/" component={Intro} />
          <Route path="/user" component={User} />
        </div>
      </Router>
    );
  }
}

class Intro extends Component {
  render() {
    return (
      <div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p className="Link">
          <Link to="/user">Click here to go somewhere else?</Link>
        </p>
      </div>
    )
  }
}

class User extends Component {
  render() {
    return (
      <p>
        User page
      </p>
    )
  }
}

export default App;
