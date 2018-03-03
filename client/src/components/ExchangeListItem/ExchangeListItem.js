import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExchangeListItem extends Component {
  render() {
    return (
      <li className="list-group-item d-flex justify-content-between align-items-center">
        <img
          height="50"
          src={require(`../../assets/exchanges/${this.props.name}.png`)}
        />
        <button className="btn btn-danger">
          <i className="icon icon-squared-minus" /> Unlink
        </button>
      </li>
    );
  }
}

ExchangeListItem.propTypes = {
  name: PropTypes.string
};

export default ExchangeListItem;
