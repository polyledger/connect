import React, { Component } from "react";
import "./HeaderDropdown.css";

class HeaderDropdown extends Component {
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
          <a className="dropdown-item">
            <i className="icon icon-log-out" /> Log out
          </a>
        </div>
      </div>
    );
  }
}

export default HeaderDropdown;
