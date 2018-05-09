import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import configureStore from "../../store/configureStore";
import { clearAlerts } from "../../actions/alertActions";
import App from "../App/App";
import HeaderContainer from "../../containers/HeaderContainer";
import AppLayoutContainer from "../../containers/AppLayoutContainer";
import Footer from "../Footer/Footer";
import "./Root.css";

let { store, persistor } = configureStore();

class Root extends Component {
  onRouteChange() {
    store.dispatch(clearAlerts());
  }

  render() {
    return (
      <div className="Root">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <App onRouteChange={this.onRouteChange}>
                <HeaderContainer />
                <Switch>
                  <Route path="/" component={AppLayoutContainer} />
                </Switch>
                <Footer />
              </App>
            </Router>
          </PersistGate>
        </Provider>
      </div>
    );
  }
}

export default Root;
