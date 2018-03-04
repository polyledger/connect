import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import RiskAssessment from "../RiskAssessment/RiskAssessment";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import NoMatch from "../NoMatch/NoMatch";

class EmptyLayout extends Component {
  render() {
    return (
      <div className="EmptyLayout">
        <div className="container p-3">
          <Switch>
            <Route path="/risk-assessment" component={RiskAssessment} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default EmptyLayout;
