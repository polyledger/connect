import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import RiskAssessment from "../RiskAssessment/RiskAssessment";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import NoMatch from "../NoMatch/NoMatch";
import AlertsOverlay from "../AlertsOverlay/AlertsOverlay";

class EmptyLayout extends Component {
  render() {
    let { alerts, addAlert, removeAlert } = this.props;
    return (
      <div className="EmptyLayout">
        <div className="container p-3">
          <AlertsOverlay alerts={alerts} onRemove={removeAlert}>
            <Switch>
              <Route path="/risk-assessment" component={RiskAssessment} />
              <Route
                path="/login"
                render={() => <Login addAlert={addAlert} />}
              />
              <Route
                path="/signup"
                render={() => <Signup addAlert={addAlert} />}
              />
              <Route path="*" component={NoMatch} />
            </Switch>
          </AlertsOverlay>
        </div>
      </div>
    );
  }
}

export default EmptyLayout;
