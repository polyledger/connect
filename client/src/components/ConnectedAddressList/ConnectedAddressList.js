import React, { Component } from "react";
import ConnectedAddressListItem from "../ConnectedAddressListItem/ConnectedAddressListItem";

class ConnectedAddressList extends Component {
  render() {
    let addresses = [];
    this.props.addresses.forEach(address => {
      addresses.push(
        <ConnectedAddressListItem
          symbol={address.asset.symbol}
          address={address.address}
          key={address.id}
          id={address.id}
          disconnectAddress={this.props.disconnectAddress}
        />
      );
    });

    if (addresses.length === 0) {
      addresses = <span>No connected addresses</span>;
    }

    return (
      <div className="ConnectedAddressList">
        <div className="hr-divider my-3">
          <h3 className="hr-divider-content hr-divider-heading">
            Connected Addresses
          </h3>
        </div>

        <ul className="list-group mb-3">{addresses}</ul>
      </div>
    );
  }
}

export default ConnectedAddressList;
