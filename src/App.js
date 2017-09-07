import React, { Component } from 'react';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import { LoginForm, Logout } from './User.js';
import { fetchapi } from './helpers.js';
import heroes from './heroes.json';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null };

    this.handleLogin = this.handleLogin.bind(this);
  }

  async componentWillMount() {
    let user = localStorage.getItem('user');
    if (user) {
      this.setState({ user: JSON.parse(user) });
    }

    let res = await fetchapi('/me');
    let json = await res.json();
    if ('user' in json) {
      this.setState({ user: json.user });
      localStorage.setItem('user', JSON.stringify(this.state.user));
    }
  }

  async handleLogin(username) {
    let form = new FormData();
    form.set('username', username);

    let res = await fetchapi('/login', {
      method: 'post',
      body: form,
    });
    let json = await res.json();

    if ('user' in json) {
      this.setState({ user: json.user });
      localStorage.setItem('user', JSON.stringify(this.state.user));
    }
  }

  handleLogout() {
    fetchapi('/logout', {
      method: 'post'
    }).then(function (res) {
      this.setState({ user: null });
    })
  }

  render() {
    const user = this.state.user;

    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <div className="App-header--user">
              { user === null
                ? <LoginForm handleLogin={this.handleLogin} />
                : (
                  <div>
                    <span>{ user.name }</span>
                    <Logout handleLogout={this.handleLogout} />
                  </div>
                  )}
            </div>
          </div>
          <Route path="/" component={Intro} />
        </div>
      </Router>
    );
  }
}

class Intro extends Component {
  render() {
    return (
      <div>
        <div className="App-intro">
          { heroes.map((e, i) => {
            return <div key={ e.id }>{ e.localized_name }</div>
          }) }
        </div>
        <div className="Link">
          <Link to="/user">Click here to go somewhere else?</Link>
        </div>
      </div>
    )
  }
}

export default App;
