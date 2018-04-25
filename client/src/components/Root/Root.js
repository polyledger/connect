import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import configureStore from "../../store/configureStore";
import { clearAlerts } from "../../actions/alertActions";
import App from "../App/App";
import HeaderContainer from "../../containers/HeaderContainer";
import AppLayout from "../AppLayout/AppLayout";
import EmptyLayout from "../EmptyLayout/EmptyLayout";
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
                  <Route path="/portfolio" component={AppLayout} />
                  <Route component={EmptyLayout} />
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
