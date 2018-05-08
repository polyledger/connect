import React, { Component } from "react";
import PropTypes from "prop-types";
import numeral from "numeral";
import "./PositionRow.css";

class PositionRow extends Component {
  getImageSource() {
    try {
      return require(`../../assets/coins/${this.props.symbol}.svg`);
    } catch (error) {
      try {
        return require(`../../assets/coins/${this.props.symbol}.png`);
      } catch (error) {
        return require(`../../assets/default.png`);
      }
    }
  }

  render() {
    return (
      <tr>
        <th scope="row">
          <img
            height="35"
            alt={`${this.props.coin} Logo`}
            src={this.getImageSource()}
          />
        </th>
        <td>{this.props.coin}</td>
        <td>
          {this.props.quantity} {this.props.symbol}
        </td>
        <td>{numeral(this.props.price).format("$0,0.00")}</td>
        <td>{numeral(this.props.marketValue).format("$0,0.00")}</td>
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
