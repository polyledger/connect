/* global require */

import React, { Component } from "react";
import numeral from "numeral";
import PropTypes from "prop-types";
import "./PriceRow.css";

class PriceRow extends Component {
  getImageSource() {
    try {
      return require(`../../assets/coins/${this.props.symbol}.png`);
    } catch (error) {
      return require(`../../assets/default.png`);
    }
  }

  getDeltaIndicator() {
    try {
      return this.props.change24h.charAt(0) === "-" ? "negative" : "positive";
    } catch (error) {
      return "";
    }
  }

  render() {
    return (
      <tr className="PriceRow">
        <td className="PriceRow__Rank--column">
          <span className="badge PriceRow__Rank">{this.props.rank}</span>
        </td>
        <td className="PriceRow__Coin--column">
          <span className="PriceRow__Coin--wrapper">
            <span className="PriceRow__Logo">
              <img
                height="25"
                alt={`${this.props.name} Logo`}
                src={this.getImageSource()}
              />
            </span>
            <span className="PriceRow__Coin">{this.props.name}</span>
          </span>
        </td>
        <td className="PriceRow__Price--column">
          {numeral(this.props.price).format("$0,0.00")}
        </td>
        <td className="PriceRow__Market_Cap--column">
          {numeral(this.props.marketCap).format("$0,0")}
        </td>
        <td
          className={`Pricerow__Delta--column delta-indicator delta-${this.getDeltaIndicator()}`}
        >
          {numeral(this.props.change24h).format("0,0.00") + "%"}
        </td>
      </tr>
    );
  }
}

PriceRow.propTypes = {
  rank: PropTypes.string,
  name: PropTypes.string,
  symbol: PropTypes.string,
  price: PropTypes.string,
  marketCap: PropTypes.string,
  change24h: PropTypes.string
};

export default PriceRow;
