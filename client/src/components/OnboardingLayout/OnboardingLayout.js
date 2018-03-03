import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import RiskAssessment from "../RiskAssessment/RiskAssessment";

class OnboardingLayout extends Component {
  render() {
    return (
      <div className="OnboardingLayout">
        <div className="container p-3">
          <Switch>
            <Route path="/risk-assessment" component={RiskAssessment} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default OnboardingLayout;
