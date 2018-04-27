import React, { Component } from "react";
import PropTypes from "prop-types";

class ConnectedAddressListItem extends Component {
  onClick(event) {
    event.preventDefault();
    this.props.disconnectAddress(this.props.id);
  }

  render() {
    return (
      <li className="ConnectedAddressListItem list-group-item">
        <div className="row d-flex align-items-center">
          <div className="col-2">
            <img
              height="40"
              alt={this.props.symbol}
              src={require(`../../assets/coins/${this.props.symbol}.png`)}
            />
          </div>
          <div className="col-xs-6 col-md-6">{this.props.address}</div>
          <div className="col-xs-4 col-md-4 mt-2">
            <button
              className="btn btn-outline-secondary float-right"
              onClick={event => this.onClick(event)}
            >
              Remove
            </button>
          </div>
        </div>
      </li>
    );
  }
}

ConnectedAddressListItem.propTypes = {
  symbol: PropTypes.string
};

export default ConnectedAddressListItem;
