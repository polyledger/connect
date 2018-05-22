import React, { Component } from "react";
import AddressForm from "./AddressForm";
import ExchangeForm from "./ExchangeForm";

class ConnectionModal extends Component {
  render() {
    let form;

    if (this.props.asset) {
      form = (
        <AddressForm
          asset={this.props.asset}
          connectAddress={this.props.connectAddress}
        />
      );
    } else if (this.props.exchange) {
      form = (
        <ExchangeForm
          exchange={this.props.exchange}
          connectExchange={this.props.connectExchange}
        />
      );
    }

    return (
      <div className="ConnectionModal">
        <div className="modal" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.props.title}</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">{form}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConnectionModal;
