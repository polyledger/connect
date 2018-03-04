import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import RiskAssessment from "../RiskAssessment/RiskAssessment";
import Signup from "../Signup/Signup";

class EmptyLayout extends Component {
  render() {
    return (
      <div className="EmptyLayout">
        <div className="container p-3">
          <Switch>
            <Route path="/risk-assessment" component={RiskAssessment} />
            <Route path="/signup" component={Signup} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default EmptyLayout;
