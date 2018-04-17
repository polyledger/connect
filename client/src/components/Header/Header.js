import React, { Component } from "react";
import logo from "../../assets/logo-light.png";
import HeaderDropdown from "../HeaderDropdown/HeaderDropdown";
import "./Header.css";

class Header extends Component {
  render() {
    let Menu = this.props.auth.isLoggedIn ? (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <HeaderDropdown logout={this.props.auth.logout} />
        </li>
      </ul>
    ) : (
      ""
    );
    return (
      <div className="Header">
        <nav className="navbar navbar-padded navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand">
              <img src={logo} height="30" alt="logo" />
            </a>
          </div>
          {Menu}
        </nav>
      </div>
    );
  }
}

export default Header;
