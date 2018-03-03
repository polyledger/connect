import React, { Component } from 'react';
import ExchangeListItem from '../ExchangeListItem/ExchangeListItem';

class ExchangeList extends Component {
  render() {
    return (
      <div className="ExchangeList">
        <div className="hr-divider my-3">
          <h3 className="hr-divider-content hr-divider-heading">Exchanges</h3>
        </div>

        <ul className="list-group mb-3">
          <ExchangeListItem name="coinbase" />
          <ExchangeListItem name="binance" />
          <ExchangeListItem name="bittrex" />
        </ul>

        <div className="d-flex flex-row-reverse">
          <button className="btn btn-primary">
            <i className="icon icon-squared-plus" /> Link Exchange
          </button>
        </div>
      </div>
    );
  }
}

export default ExchangeList;
