import React, { Component } from "react";
import logo from "../../assets/logo-light.png";
import HeaderDropdown from "../HeaderDropdown/HeaderDropdown";
import "./Header.css";

class Header extends Component {
  render() {
    return (
      <div className="Header">
        <nav className="navbar navbar-padded navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand">
              <img src={logo} height="30" alt="logo" />
            </a>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <HeaderDropdown />
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default Header;
