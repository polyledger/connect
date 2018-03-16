import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import rootReducer from "../../reducers";
import { Provider } from "react-redux";
import { createStore } from "redux";
import Header from "../Header/Header";
import AppLayout from "../AppLayout/AppLayout";
import EmptyLayout from "../EmptyLayout/EmptyLayout";
import Footer from "../Footer/Footer";
import "./RootContainer.css";

let store = createStore(rootReducer);

class RootContainer extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="RootContainer">
            <Header />
            <Switch>
              <Route path="/portfolio" component={AppLayout} />
              <Route component={EmptyLayout} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default RootContainer;
