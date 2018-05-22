import React, { Component } from "react";
import Toolbar from "../Toolbar/Toolbar";
import ConnectedExchangeList from "./ConnectedExchangeList/ConnectedExchangeList";
import ConnectedAddressList from "./ConnectedAddressList/ConnectedAddressList";

class ConnectedAccounts extends Component {
  componentDidMount() {
    this.props.fetchConnectedExchanges();
    this.props.fetchConnectedAddresses();
  }

  render() {
    return (
      <div className="ConnectedAccounts">
        <Toolbar title="Connected Accounts" />
        <ConnectedExchangeList
          connectedExchanges={this.props.connectedExchanges}
          disconnectExchange={this.props.disconnectExchange}
        />
        <ConnectedAddressList
          connectedAddresses={this.props.connectedAddresses}
          disconnectAddress={this.props.disconnectAddress}
        />
      </div>
    );
  }
}

export default ConnectedAccounts;
