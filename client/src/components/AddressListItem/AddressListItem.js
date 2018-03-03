import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AddressListItem extends Component {
  render() {
    return (
      <li className="list-group-item d-flex justify-content-between align-items-center">
        <img
          height="50"
          src={require(`../../assets/coins/${this.props.symbol}.png`)}
        />
        <button className="btn btn-danger">
          <i className="icon icon-squared-minus" /> Unlink
        </button>
      </li>
    );
  }
}

AddressListItem.propTypes = {
  symbol: PropTypes.string
};

export default AddressListItem;
