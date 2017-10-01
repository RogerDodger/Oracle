import React, { Component } from 'react';

class LoginForm extends Component {
   state = { name: '' };

   handleChange = (e) => {
      this.setState({ name: e.target.value });
   }

   handleSubmit = (e) => {
      e.preventDefault();
      this.props.handleLogin(this.state.name);
   }

   render() {
      return (
         <form onSubmit={this.handleSubmit}>
            <input
               type="text"
               placeholder="Username"
               value={this.state.name}
               onChange={this.handleChange} />
            <input 
               type="submit" 
               value="Login" />
         </form>
      )
   }
}

class Logout extends Component {
   render() {
      return (
         <button onClick={this.props.handleLogout}>
            Logout
         </button>
      )
   }
}

export { LoginForm, Logout };
