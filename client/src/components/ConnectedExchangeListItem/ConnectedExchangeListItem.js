import React, { Component } from "react";
import PropTypes from "prop-types";

class ConnectedExchangeListItem extends Component {
  render() {
    return (
      <li
        className="ConnectedExchangeListItem list-group-item"
        style={{ backgroundColor: this.props.backgroundColor }}
      >
        <div className="row d-flex align-items-center">
          <div className="col-2">{this.props.name}</div>
          <div className="col-8">
            <small className="text-muted">
              Connected on April 23rd, 2018 at 11:34 PM PDT
            </small>
          </div>

          <div className="col-2">
            <button className="btn btn-primary btn-outline-secondary float-right">
              Remove
            </button>
          </div>
        </div>
      </li>
    );
  }
}

ConnectedExchangeListItem.propTypes = {
  name: PropTypes.string,
  extension: PropTypes.string,
  backgroundColor: PropTypes.string,
  size: PropTypes.string
};

export default ConnectedExchangeListItem;
