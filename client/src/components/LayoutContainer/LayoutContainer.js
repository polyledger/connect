import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import Layout from '../Layout/Layout';
import Portfolio from '../Portfolio/Portfolio';
import Accounts from '../Accounts/Accounts';
import Markets from '../Markets/Markets';
import Footer from '../Footer/Footer';
import './LayoutContainer.css';

class LayoutContainer extends Component {
  render() {
    return (
      <Router>
        <div className="LayoutContainer">
          <Header />
          <Navbar />
          <Layout>
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/accounts" component={Accounts} />
            <Route path="/markets" component={Markets} />
          </Layout>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default LayoutContainer;
