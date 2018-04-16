import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

class Navbar extends Component {
  render() {
    return (
      <div className="Navbar">
        <ul className="nav nav-bordered navbar-padded justify-content-center text-center">
          <li className="nav-item">
            <NavLink
              exact
              className="nav-link"
              activeClassName="active"
              to="/portfolio"
            >
              <i className="icon icon-pie-chart" />{" "}
              <span className="d-none d-sm-inline">Portfolio</span>
              <small className="iconav-nav-label d-sm-none">Portfolio</small>
            </NavLink>
          </li>
          {/* <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/portfolio/analytics"
            >
              <i className="icon icon-gauge" />{" "}
              <span className="d-none d-sm-inline">Analytics</span>
              <small className="iconav-nav-label d-sm-none">Analytics</small>
            </NavLink>
          </li> */}
          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/portfolio/accounts"
            >
              <i className="icon icon-wallet" />{" "}
              <span className="d-none d-sm-inline">Accounts</span>
              <small className="iconav-nav-label d-sm-none">Accounts</small>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/portfolio/markets"
            >
              <i className="icon icon-line-graph" />{" "}
              <span className="d-none d-sm-inline">Markets</span>
              <small className="iconav-nav-label d-sm-none">Markets</small>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/portfolio/settings"
            >
              <i className="icon icon-cog" />{" "}
              <span className="d-none d-sm-inline">Settings</span>
              <small className="iconav-nav-label d-sm-none">Settings</small>
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

export default Navbar;
