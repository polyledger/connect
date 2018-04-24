import React, { Component } from "react";
import ExchangeListModalItem from "../ExchangeListModalItem/ExchangeListModalItem";

class ExchangeListModal extends Component {
  componentDidMount() {
    this.props.fetchExchanges();
  }

  render() {
    let options = {
      Binance: {
        backgroundColor: "#FFFFFF",
        extension: "svg",
        height: "30"
      },
      Bitstamp: {
        backgroundColor: "#FFFFFF",
        extension: "png",
        height: "30"
      },
      Bittrex: {
        backgroundColor: "#0E2E41",
        extension: "svg",
        height: "30"
      },
      Cex: {
        backgroundColor: "#F8F8F8",
        extension: "png",
        height: "30"
      },
      Coinbase: {
        backgroundColor: "#F8F8F8",
        extension: "svg",
        height: "30"
      },
      GDAX: {
        backgroundColor: "#5A607B",
        extension: "svg",
        height: "30"
      },
      Gemini: {
        backgroundColor: "#040605",
        extension: "svg",
        height: "30"
      },
      HitBTC: {
        backgroundColor: "#1D201E",
        extension: "png",
        height: "30"
      },
      Kraken: {
        backgroundColor: "#FFFFFF",
        extension: "png",
        height: "30"
      },
      Poloniex: {
        backgroundColor: "#0E0E0E",
        extension: "png",
        height: "30"
      }
    };

    let exchanges = [];
    this.props.exchanges.forEach(exchange => {
      if (options.hasOwnProperty(exchange.name)) {
        exchanges.push(
          <ExchangeListModalItem
            name={exchange.name.toLowerCase()}
            extension={options[exchange.name].extension}
            height={options[exchange.name].height}
            backgroundColor={options[exchange.name].backgroundColor}
            connectExchange={this.props.connectExchange}
            id={exchange.id}
            key={exchange.id}
          />
        );
      }
    });

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
              <div className="card-columns">{exchanges}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExchangeListModal;
