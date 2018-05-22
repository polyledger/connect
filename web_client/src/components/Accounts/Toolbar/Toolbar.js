import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

class Toolbar extends Component {
  render() {
    return (
      <div className="Toolbar">
        <form className="form-inline d-flex justify-content-between mb-2">
          <h3>{this.props.title}</h3>
          <div className="btn-group btn-group-thirds mb-2">
            <NavLink
              exact
              role="button"
              activeClassName="active"
              className="btn btn-outline-primary"
              to="/accounts/"
            >
              Accounts
            </NavLink>
            <NavLink
              role="button"
              activeClassName="active"
              className="btn btn-outline-primary"
              to="/accounts/connect-address"
            >
              Link address
            </NavLink>
            <NavLink
              role="button"
              activeClassName="active"
              className="btn btn-outline-primary"
              to="/accounts/connect-exchange"
            >
              Link exchange
            </NavLink>
          </div>
          {this.props.onChange ? (
            <div className="input-group mb-2">
              <input
                className="form-control"
                type="search"
                placeholder="Search by name"
                aria-label="Search"
                onChange={event => this.props.onChange(event)}
              />
              <div className="input-group-append">
                <span className="input-group-text">
                  <i className="fa fa-search" style={{ color: "#FFFFFF" }} />
                </span>
              </div>
            </div>
          ) : (
            ""
          )}
        </form>
      </div>
    );
  }
}

Toolbar.propTypes = {
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default Toolbar;
