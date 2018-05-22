import React, { Component } from "react";
import PropTypes from "prop-types";
import numeral from "numeral";
import getImageSource from "../../../../utils/imageUtils";
import "./PositionRow.css";

class PositionRow extends Component {
  render() {
    return (
      <tr>
        <th scope="row" className="text-center">
          <img
            height="35"
            alt={`${this.props.coin} Logo`}
            src={getImageSource("coins", this.props.symbol)}
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
