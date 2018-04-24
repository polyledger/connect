import React, { Component } from "react";
import ExchangeListModalItem from "../ExchangeListModalItem/ExchangeListModalItem";
import PropTypes from "prop-types";

class ExchangeListModal extends Component {
  render() {
    return (
      <div
        className="ExchangeListModal modal fade"
        id="exchangeModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exchangeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exchangeModalLabel">
                Connect an exchange
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="card-columns">
                <ExchangeListModalItem
                  name="binance"
                  extension="svg"
                  backgroundColor="#FFFFFF"
                />
                <ExchangeListModalItem
                  name="bittrex"
                  extension="svg"
                  backgroundColor="#0E2E41"
                />
                <ExchangeListModalItem
                  name="coinbase"
                  extension="svg"
                  backgroundColor="#F8F8F8"
                />
                <ExchangeListModalItem
                  name="gdax"
                  extension="svg"
                  backgroundColor="#5A607B"
                />
                <ExchangeListModalItem
                  name="kraken"
                  extension="png"
                  backgroundColor="#FFFFFF"
                />
                <ExchangeListModalItem
                  name="poloniex"
                  extension="png"
                  backgroundColor="#0E0E0E"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExchangeListModal;
