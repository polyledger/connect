import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './PriceRow.css';

class PriceRow extends Component {
  render() {
    return (
      <tr className="PriceRow">
        <td>
          <span className="badge PriceRow__Rank">{this.props.rank}</span>
          <span className="PriceRow__Logo">
            <img
              height="25"
              src={require(`../../assets/coins/${this.props.symbol}.png`)}
            />
          </span>
          <span className="PriceRow__Coin">{this.props.name}</span>
        </td>
        <td>{this.props.price}</td>
        <td>{this.props.marketCap}</td>
        <td>{this.props.change24h}</td>
      </tr>
    );
  }
}

PriceRow.propTypes = {
  rank: PropTypes.string,
  symbol: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.string,
  marketCap: PropTypes.string,
  change24h: PropTypes.string
};

export default PriceRow;
