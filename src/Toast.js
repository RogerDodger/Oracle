import React, { Component } from 'react';
import './Toast.css';

class ToastContainer extends Component {
   state = {
      message: '',
      show: false,
      undo: null,
   };

   _clearTimeout() {
      clearTimeout(this._timeout)
      this._timeout = undefined;
   }

   _setTimeout(cb) {
      this._clearTimeout();
      this._timeout = setTimeout(cb, 5000);
   }

   send = (message, undo) => {
      this.setState({
         message: message,
         show: true,
         undo: undo,
      });

      this._setTimeout(() => this.setState({ show: false }));
   }

   undo = () => {
      this.state.undo();
      this._clearTimeout();
      this.setState({ show: false });
   }

   render() {
      let s = { visibility: this.state.show ? 'initial' : 'hidden' };

      return (
         <div className="Toast-container" style={s}>
            <div className="Toast-message">{ this.state.message }</div>
            { this.state.undo &&
               <div className="Toast-undo" onClick={this.undo}>Undo</div> }
         </div>
      );
   }
}

export { ToastContainer };
