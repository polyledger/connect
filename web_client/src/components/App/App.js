import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import AlertContainer from "../../containers/AlertContainer";
import Navbar from "./Navbar/Navbar";
import PortfolioContainer from "../../containers/PortfolioContainer";
import Analytics from "../Analytics/Analytics";
import AccountsContainer from "../../containers/AccountsContainer";
import Markets from "../Markets/Markets";
import SettingsContainer from "../../containers/SettingsContainer";
import RiskAssessment from "../Onboarding/RiskAssessment/RiskAssessment";
import LoginContainer from "../../containers/LoginContainer";
import SignupContainer from "../../containers/SignupContainer";
import ActivationContainer from "../../containers/ActivationContainer";
import ConfirmEmail from "../Auth/ConfirmEmail/ConfirmEmail";
import NoMatch from "./NoMatch/NoMatch";
import HeaderContainer from "../../containers/HeaderContainer";
import Footer from "./Footer/Footer";
import "./App.css";

class App extends Component {
  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      this.props.clearAlerts();
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    let navbar = this.props.auth.isLoggedIn ? <Navbar /> : "";
    return (
      <div className="App">
        <HeaderContainer />
        {navbar}
        <div className="container p-3">
          <AlertContainer />
          <Switch>
            <Route exact path="/" component={PortfolioContainer} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/accounts" component={AccountsContainer} />
            <Route path="/markets" component={Markets} />
            <Route path="/settings" component={SettingsContainer} />
            <Route path="/risk-assessment" component={RiskAssessment} />
            <Route path="/login" component={LoginContainer} />
            <Route path="/signup" component={SignupContainer} />
            <Route path="/confirm-email" component={ConfirmEmail} />
            <Route path="/activate" component={ActivationContainer} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
