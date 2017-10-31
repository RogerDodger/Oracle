import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from './Toast.js';
import { LoginForm, Logout } from './User.js';
import { Rank } from './Rank.js';
import { fetchapi } from './helpers.js';
import 'typeface-roboto';
import './App.css';

class App extends Component {
   state = { user: null };

   async componentDidMount() {
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

   handleLogin = async (username) => {
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

   handleLogout = async () => {
      let res = await fetchapi('/logout', { method: 'post' });
      if (res.ok) {
         this.setState({ user: null });
         localStorage.removeItem('user');
      }
   }

   render() {
      const user = this.state.user;

      return (
         <Router>
            <div className="App">
               <ToastContainer />
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
               <div className="App-main">
               { user &&
                  <Route path="/" component={Rank} />}
               </div>
               <div className="App-footer"/>
            </div>
         </Router>
      );
   }
}

export default App;
