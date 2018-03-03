import React, { Component } from "react";
import PropTypes from "prop-types";
import PriceRow from "../PriceRow/PriceRow";
import "./PriceTable.css";

class PriceTable extends Component {
  render() {
    let priceRows = [];
    this.props.tickers.forEach(ticker => {
      priceRows.push(
        <PriceRow
          key={ticker.id}
          rank={ticker.rank}
          name={ticker.name}
          symbol={ticker.symbol}
          price={ticker.price_usd}
          marketCap={ticker.market_cap_usd}
          change24h={ticker.percent_change_24h}
        />
      );
    });
    return (
      <div className="PriceTable">
        <div className="card table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th scope="col">Coin</th>
                <th scope="col">Price</th>
                <th scope="col">Market Cap</th>
                <th scope="col">24h Change</th>
              </tr>
            </thead>
            <tbody>{priceRows}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

PriceTable.propTypes = {
  tickers: PropTypes.array
};

export default PriceTable;
