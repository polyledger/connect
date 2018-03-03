import React, { Component } from 'react';
import '../Layout/Layout.css';

class Layout extends Component {
  render() {
    return (
      <div className="Layout">
        <div className="container p-3">{this.props.children}</div>
      </div>
    );
  }
}

export default Layout;
