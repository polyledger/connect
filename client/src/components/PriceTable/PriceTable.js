import React, { Component } from 'react';
import PriceRow from '../PriceRow/PriceRow';
import './PriceTable.css';

class PriceTable extends Component {
  render() {
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
            <tbody>
              <PriceRow
                rank="1"
                symbol="BTC"
                name="Bitcoin"
                price="$10,560"
                marketCap="$250,000,000"
                change24h="+10.00%"
              />
              <PriceRow
                rank="2"
                symbol="ETH"
                name="Ethereum"
                price="$1,560"
                marketCap="$150,000,000"
                change24h="+5.00%"
              />
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default PriceTable;
