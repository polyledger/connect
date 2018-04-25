import React, { Component } from 'react';
import PositionRow from '../PositionRow/PositionRow';
import './PositionTable.css';

class PositionTable extends Component {
  render() {
    return (
      <div className="PositionTable">
        <div className="card table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">Coin</th>
                <th scope="col">Percent</th>
                <th scope="col">Quantity</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <PositionRow
                coin="Bitcoin"
                symbol="BTC"
                percent="40%"
                amount="0.1153"
                value="$5,000.00"
              />
              <PositionRow
                coin="Ethereum"
                symbol="ETH"
                percent="40%"
                amount="2.9458"
                value="$5,000.00"
              />
              <PositionRow
                coin="Litecoin"
                symbol="LTC"
                percent="20%"
                amount="2.1234"
                value="$800.00"
              />
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default PositionTable;
