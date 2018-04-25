import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import AlertContainer from "../../containers/AlertContainer";
import Navbar from "../Navbar/Navbar";
import PortfolioContainer from "../../containers/PortfolioContainer";
import Analytics from "../Analytics/Analytics";
import AccountsContainer from "../../containers/AccountsContainer";
import Markets from "../Markets/Markets";
import SettingsContainer from "../../containers/SettingsContainer";
import "./AppLayout.css";

class AppLayout extends Component {
  render() {
    return (
      <div className="AppLayout">
        <Navbar />
        <div className="container p-3">
          <AlertContainer />
          <Switch>
            <Route exact path="/portfolio" component={PortfolioContainer} />
            <Route path="/portfolio/analytics" component={Analytics} />
            <Route path="/portfolio/accounts" component={AccountsContainer} />
            <Route path="/portfolio/markets" component={Markets} />
            <Route path="/portfolio/settings" component={SettingsContainer} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default AppLayout;
