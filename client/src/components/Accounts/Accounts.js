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
              <button type="button" className="btn btn-outline-primary">
                Link address
              </button>
            </div>
          </div>
        </div>
        <ConnectedExchangeList exchanges={this.props.connectedExchanges} />
        <ConnectedAddressList addresses={this.props.connectedAddresses} />
      </div>
    );
  }
}

export default Accounts;
