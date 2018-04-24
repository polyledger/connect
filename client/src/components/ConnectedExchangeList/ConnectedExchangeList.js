import React, { Component } from "react";
import ConnectedExchangeListItem from "../ConnectedExchangeListItem/ConnectedExchangeListItem";

class ConnectedExchangeList extends Component {
  render() {
    let connectedExchanges = [];
    this.props.connectedExchanges.forEach(connectedExchange => {
      connectedExchanges.push(
        <ConnectedExchangeListItem name={connectedExchange.name} />
      );
    });

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

        <ul className="list-group mb-3">{connectedExchanges}</ul>
      </div>
    );
  }
}

export default ConnectedExchangeList;
