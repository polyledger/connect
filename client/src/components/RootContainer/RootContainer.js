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
        <Switch>
          <div className="RootContainer">
            <Header />
            <Route path="/portfolio" component={AppLayout} />
            <Route component={EmptyLayout} />
            <Footer />
          </div>
        </Switch>
      </Router>
    );
  }
}

export default RootContainer;
