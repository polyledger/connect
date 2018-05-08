import React, { Component } from "react";
import ConnectedExchangeList from "../ConnectedExchangeList/ConnectedExchangeList";
import ConnectedAddressList from "../ConnectedAddressList/ConnectedAddressList";
import ExchangeListModal from "../ExchangeListModal/ExchangeListModal";
import AssetListModal from "../AssetListModal/AssetListModal";

class Accounts extends Component {
  componentDidMount() {
    this.props.fetchConnectedExchanges();
    this.props.fetchConnectedAddresses();
  }

  render() {
    return (
      <div className="Accounts">
        <div className="dashhead">
          <div className="dashhead-toolbar">
            <div className="dashhead-toolbar-item">
              <button
                type="button"
                className="btn btn-outline-primary mr-2"
                data-toggle="modal"
                data-target="#exchangeModal"
              >
                Link exchange
              </button>
            </div>
            <div className="dashhead-toolbar-item">
              <button
                type="button"
                className="btn btn-outline-primary"
                data-toggle="modal"
                data-target="#assetModal"
              >
                Link address
              </button>
            </div>
          </div>
        </div>
        <ConnectedExchangeList
          connectedExchanges={this.props.connectedExchanges}
          disconnectExchange={this.props.disconnectExchange}
        />
        <ConnectedAddressList
          connectedAddresses={this.props.connectedAddresses}
          disconnectAddress={this.props.disconnectAddress}
        />
        <ExchangeListModal
          connectExchange={this.props.connectExchange}
          fetchExchanges={this.props.fetchExchanges}
          exchanges={this.props.exchanges}
        />
        <AssetListModal
          connectAddress={this.props.connectAddress}
          fetchAssets={this.props.fetchAssets}
          assets={this.props.assets}
        />
      </div>
    );
  }
}

export default Accounts;
