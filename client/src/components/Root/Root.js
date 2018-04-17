import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import configureStore from "../../store/configureStore";
import HeaderContainer from "../../containers/HeaderContainer";
import AppLayout from "../AppLayout/AppLayout";
import EmptyLayout from "../EmptyLayout/EmptyLayout";
import Footer from "../Footer/Footer";
import "./Root.css";

let { store, persistor } = configureStore();

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <div className="Root">
              <HeaderContainer />
              <Switch>
                <Route path="/portfolio" component={AppLayout} />
                <Route component={EmptyLayout} />
              </Switch>
              <Footer />
            </div>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

export default Root;
