import React, { Component } from "react";
import ConnectedExchangeListItem from "../ConnectedExchangeListItem/ConnectedExchangeListItem";

class ConnectedExchangeList extends Component {
  render() {
    return (
      <div className="ConnectedExchangeList">
        <div className="hr-divider my-3">
          <h3 className="hr-divider-content hr-divider-heading">
            Connected Exchanges
          </h3>
        </div>

        <div className="alert alert-info" role="alert">
          <div className="row">
            <div className="col-1 d-flex justify-content-center align-items-center">
              <i className="fa fa-info-circle" />
            </div>
            <div className="col-10">
              Enter your read-only API keys to connect to cryptoasset exchanges.{" "}
              <em>Never</em> enter API keys that have writable permissions
              enabled.{" "}
              <a
                href="https://polyledger.zendesk.com/hc/en-us/articles/360002808492-What-are-API-keys-"
                className="alert-link"
                target="blank"
              >
                Learn more
              </a>.
            </div>
          </div>
        </div>

        <ul className="list-group mb-3">
          <ConnectedExchangeListItem
            name="binance"
            extension="svg"
            backgroundColor="#FFFFFF"
            height="45"
            url="https://www.binance.com/"
          />
          <ConnectedExchangeListItem
            name="bittrex"
            extension="svg"
            backgroundColor="#0E2E41"
            height="30"
            url="https://bittrex.com/"
          />
          <ConnectedExchangeListItem
            name="coinbase"
            extension="svg"
            backgroundColor="#F8F8F8"
            height="35"
            url="https://www.coinbase.com/"
          />
          <ConnectedExchangeListItem
            name="gdax"
            extension="svg"
            backgroundColor="#5A607B"
            height="45"
            url="https://www.gdax.com/"
          />
          <ConnectedExchangeListItem
            name="kraken"
            extension="png"
            backgroundColor="#FFFFFF"
            height="50"
            url="https://www.kraken.com/"
          />
          <ConnectedExchangeListItem
            name="poloniex"
            extension="png"
            backgroundColor="#0E0E0E"
            height="30"
            url="https://poloniex.com/"
          />
        </ul>
      </div>
    );
  }
}

export default ConnectedExchangeList;
