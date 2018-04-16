import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import RiskAssessment from "../RiskAssessment/RiskAssessment";
import Login from "../Login/Login";
import SignupContainer from "../../containers/SignupContainer";
import ConfirmEmail from "../ConfirmEmail/ConfirmEmail";
import NoMatch from "../NoMatch/NoMatch";
import AlertContainer from "../../containers/AlertContainer";

class EmptyLayout extends Component {
  render() {
    return (
      <div className="EmptyLayout">
        <div className="container p-3">
          <AlertContainer />
          <Switch>
            <Route path="/risk-assessment" component={RiskAssessment} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignupContainer} />
            <Route path="/confirm-email" component={ConfirmEmail} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default EmptyLayout;
