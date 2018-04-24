import React, { Component } from "react";
import ConnectedExchangeListItem from "../ConnectedExchangeListItem/ConnectedExchangeListItem";
import ExchangeListModal from "../ExchangeListModal/ExchangeListModal";

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
          <ConnectedExchangeListItem name="Binance" />
        </ul>
        <ExchangeListModal />
      </div>
    );
  }
}

export default ConnectedExchangeList;
