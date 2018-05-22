import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import ConnectedAccounts from "./ConnectedAccounts/ConnectedAccounts";
import ExchangeList from "./ExchangeList/ExchangeList";
import AssetList from "./AssetList/AssetList";

class Accounts extends Component {
  render() {
    return (
      <div className="Accounts">
        <Switch>
          <Route
            path="/accounts"
            exact
            render={() => (
              <ConnectedAccounts
                connectedExchanges={this.props.connectedExchanges}
                connectedAddresses={this.props.connectedAddresses}
                fetchConnectedExchanges={this.props.fetchConnectedExchanges}
                fetchConnectedAddresses={this.props.fetchConnectedAddresses}
              />
            )}
          />
          <Route
            path="/accounts/connect-exchange"
            render={() => (
              <ExchangeList
                exchanges={this.props.exchanges}
                fetchExchanges={this.props.fetchExchanges}
                connectExchange={this.props.connectExchange}
              />
            )}
          />
          <Route
            path="/accounts/connect-address"
            render={() => (
              <AssetList
                assets={this.props.assets}
                fetchAssets={this.props.fetchAssets}
                connectAddress={this.props.connectAddress}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default Accounts;
