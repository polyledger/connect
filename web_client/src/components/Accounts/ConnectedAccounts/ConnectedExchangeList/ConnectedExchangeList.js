import React, { Component } from "react";
import ConnectedExchangeListItem from "./ConnectedExchangeListItem/ConnectedExchangeListItem";

class ConnectedExchangeList extends Component {
  render() {
    let connectedExchanges = [];
    this.props.connectedExchanges.forEach(connectedExchange => {
      let syncedAt = connectedExchange.synced_at
        ? `Synchronized at ${new Date(
            connectedExchange.synced_at
          ).toLocaleString()}.`
        : "Not synchronized.";
      connectedExchanges.push(
        <ConnectedExchangeListItem
          name={connectedExchange.exchange.name}
          key={connectedExchange.id}
          id={connectedExchange.id}
          syncedAt={syncedAt}
          syncProgress={connectedExchange.sync_progress}
          disconnectExchange={this.props.disconnectExchange}
        />
      );
    });

    if (connectedExchanges.length === 0) {
      connectedExchanges = <span>No connected exchanges</span>;
    }

    return (
      <div className="ConnectedExchangeList">
        <div className="hr-divider my-3">
          <h3 className="hr-divider-content hr-divider-heading">
            Connected Exchanges
          </h3>
        </div>
        <ul className="list-group mb-3">{connectedExchanges}</ul>
      </div>
    );
  }
}

export default ConnectedExchangeList;
