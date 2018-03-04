import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "../Header/Header";
import AppLayout from "../AppLayout/AppLayout";
import EmptyLayout from "../EmptyLayout/EmptyLayout";
import Footer from "../Footer/Footer";
import "./RootContainer.css";

class RootContainer extends Component {
  render() {
    return (
      <Router>
        <div className="RootContainer">
          <Header />
          <Switch>
            <Route path="/portfolio" component={AppLayout} />
            <Route component={EmptyLayout} />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default RootContainer;
