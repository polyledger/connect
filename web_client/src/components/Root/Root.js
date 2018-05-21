import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import configureStore from "../../store/configureStore";
import AppContainer from "../../containers/AppContainer";
import "./Root.css";

let { store, persistor } = configureStore();

class Root extends Component {
  render() {
    return (
      <div className="Root">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <Switch>
                <Route path="/" component={AppContainer} />
              </Switch>
            </Router>
          </PersistGate>
        </Provider>
      </div>
    );
  }
}

export default Root;
