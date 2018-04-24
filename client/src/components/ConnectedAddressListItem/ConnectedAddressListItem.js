import React, { Component } from "react";
import PropTypes from "prop-types";

class ConnectedAddressListItem extends Component {
  render() {
    return (
      <li className="list-group-item">
        <div className="row d-flex justify-content-between align-items-center">
          <div className="col-2">
            <img
              height="50"
              alt={this.props.symbol}
              src={require(`../../assets/coins/${this.props.symbol}.png`)}
            />
          </div>
          <div className="col">
            <input
              className="form-control m-1"
              placeholder="Public ConnectedAddress"
            />
          </div>
          <div className="col-2">
            <button className="btn btn-primary float-right">
              <i className="icon icon-squared-plus" /> Link
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
