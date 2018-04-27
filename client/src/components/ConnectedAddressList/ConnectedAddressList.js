import React, { Component } from "react";
import ConnectedAddressListItem from "../ConnectedAddressListItem/ConnectedAddressListItem";

class ConnectedAddressList extends Component {
  render() {
    let connectedAddresses = [];
    this.props.connectedAddresses.forEach(address => {
      connectedAddresses.push(
        <ConnectedAddressListItem
          symbol={address.address.asset.symbol}
          address={address.address.address}
          key={address.id}
          id={address.id}
          disconnectAddress={this.props.disconnectAddress}
        />
      );
    });

    if (connectedAddresses.length === 0) {
      connectedAddresses = <span>No connected addresses</span>;
    }

    return (
      <div className="ConnectedAddressList">
        <div className="hr-divider my-3">
          <h3 className="hr-divider-content hr-divider-heading">
            Connected Addresses
          </h3>
        </div>

        <ul className="list-group mb-3">{connectedAddresses}</ul>
      </div>
    );
  }
}

export default ConnectedAddressList;
