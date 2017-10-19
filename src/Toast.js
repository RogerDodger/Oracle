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

   _setTimeout(cb, t=5000) {
      this._clearTimeout();
      this._timeout = setTimeout(cb, t);
   }

   componentWillMount() {
      toast.setContainer(this);
   }

   send = (message, undo) => {
      const show = () => {
         this.setState({
            message: message,
            show: true,
            undo: undo,
         });

         this._setTimeout(() => this.setState({ show: false }));
      };

      // If a toast is already showing, we delay our "show" state change by
      // 50ms to ensure a repaint between { show: false } and { show: true }
      if (this.state.show) {
         this.setState({ show: false });
         this._setTimeout(show, 50);
      }
      else {
         show();
      }
   }

   undo = () => {
      this.state.undo();
      this._clearTimeout();
      this.setState({ show: false });
   }

   render() {
      let c = `Toast-container ${ this.state.show ? 'show' : '' }`;

      return (
         <div className={c}>
            <div className="Toast-message">{this.state.message}</div>
            { this.state.undo &&
               <div className="Toast-undo" onClick={this.undo}>Undo</div> }
         </div>
      );
   }
}

class ToastInterface {
   send = (message, undo) => {
      if (this.container) {
         this.container.send(message, undo);
      }
      else {
         alert("No container");
      }
   }

   setContainer = (c) => {
      if (c instanceof ToastContainer) {
         this.container = c;
      }
   }
}

let toast = new ToastInterface();

export { ToastContainer, toast };
