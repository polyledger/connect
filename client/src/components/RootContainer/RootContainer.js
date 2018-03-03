import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "../Header/Header";
import AppLayout from "../AppLayout/AppLayout";
import OnboardingLayout from "../OnboardingLayout/OnboardingLayout";
import Footer from "../Footer/Footer";
import "./RootContainer.css";

class RootContainer extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <div className="RootContainer">
            <Header />
            <Route component={AppLayout} />
            <Route component={OnboardingLayout} />
            <Footer />
          </div>
        </Switch>
      </Router>
    );
  }
}

export default RootContainer;
