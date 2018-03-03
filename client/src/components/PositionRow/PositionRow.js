import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './PositionRow.css';

class PositionRow extends Component {
  render() {
    return (
      <tr>
        <th scope="row">
          <img
            height="35"
            src={require(`../../assets/coins/${this.props.symbol}.png`)}
          />
        </th>
        <td>{this.props.coin}</td>
        <td>{this.props.percent}</td>
        <td>
          {this.props.amount} {this.props.symbol}
        </td>
        <td>{this.props.value}</td>
      </tr>
    );
  }
}

PositionRow.propTypes = {
  coin: PropTypes.string,
  symbol: PropTypes.string,
  percent: PropTypes.string,
  amount: PropTypes.string,
  value: PropTypes.string
};

export default PositionRow;
