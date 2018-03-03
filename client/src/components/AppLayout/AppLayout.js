import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Portfolio from "../Portfolio/Portfolio";
import Analytics from "../Analytics/Analytics";
import Accounts from "../Accounts/Accounts";
import Markets from "../Markets/Markets";
import Settings from "../Settings/Settings";
import "./AppLayout.css";

class AppLayout extends Component {
  render() {
    return (
      <div className="AppLayout">
        <Navbar />
        <div className="container p-3">
          <Switch>
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/accounts" component={Accounts} />
            <Route path="/markets" component={Markets} />
            <Route path="/settings" component={Settings} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default AppLayout;
