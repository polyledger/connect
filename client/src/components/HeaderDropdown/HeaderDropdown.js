import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./HeaderDropdown.css";

class HeaderDropdown extends Component {
  onClick(event) {
    this.props.logout();
  }

  render() {
    return (
      <div className="dropdown show">
        <a
          className="nav-link"
          role="button"
          id="dropdownMenuLink"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Matthew Rosendin
          <i className="icon icon-chevron-small-down" />
        </a>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <a
            className="dropdown-item"
            href="https://polyledger.zendesk.com/hc/en-us"
            target="blank"
          >
            <i className="icon icon-lifebuoy" /> Support
          </a>
          <div className="dropdown-divider" />

          <NavLink
            className="dropdown-item"
            to="/login"
            onClick={event => {
              this.onClick(event);
            }}
          >
            <i className="icon icon-log-out" /> Log out
          </NavLink>
        </div>
      </div>
    );
  }
}

export default HeaderDropdown;
