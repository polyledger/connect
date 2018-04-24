import React, { Component } from "react";
import ConnectedExchangeList from "../ConnectedExchangeList/ConnectedExchangeList";
import ConnectedAddressList from "../ConnectedAddressList/ConnectedAddressList";

class Accounts extends Component {
  componentDidMount() {
    this.props.fetchConnectedExchanges();
  }

  render() {
    return (
      <div className="Accounts">
        <ConnectedExchangeList exchanges={this.props.connectedExchanges} />
        <ConnectedAddressList addresses={this.props.connectedAddresses} />
      </div>
    );
  }
}

export default Accounts;
