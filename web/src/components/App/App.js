import React, { Component } from "react";
import { withRouter } from "react-router";

class App extends Component {
  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      this.props.onRouteChange();
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return <div className="App">{this.props.children}</div>;
  }
}

export default withRouter(App);
