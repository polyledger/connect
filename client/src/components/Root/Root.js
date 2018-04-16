import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "../../store/configureStore";
import Header from "../Header/Header";
import AppLayout from "../AppLayout/AppLayout";
import EmptyContainer from "../../containers/EmptyContainer";
import Footer from "../Footer/Footer";
import "./Root.css";

let store = configureStore();

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="Root">
            <Header />
            <Switch>
              <Route path="/portfolio" component={AppLayout} />
              <Route component={EmptyContainer} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default Root;
