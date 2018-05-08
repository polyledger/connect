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
        height: "30",
        url: "https://binance.com",
        color: "#E8B342"
      },
      Bitstamp: {
        backgroundColor: "#FFFFFF",
        extension: "png",
        height: "30",
        url: "https://bitstamp.net",
        color: "#02A04F"
      },
      Bittrex: {
        backgroundColor: "#0E2E41",
        extension: "svg",
        height: "30",
        url: "https://bittrex.com",
        color: "#0087D1"
      },
      Cex: {
        backgroundColor: "#F8F8F8",
        extension: "png",
        height: "30",
        url: "https://cex.io",
        color: "#00BFC9"
      },
      Coinbase: {
        backgroundColor: "#F8F8F8",
        extension: "svg",
        height: "30",
        url: "https://coinbase.com",
        color: "#0561B2"
      },
      GDAX: {
        backgroundColor: "#283748",
        extension: "svg",
        height: "30",
        url: "https://gdax.com",
        color: "#4D9DEC"
      },
      Gemini: {
        backgroundColor: "#040605",
        extension: "svg",
        height: "30",
        url: "https://gemini.com",
        color: "#0EE0F7"
      },
      HitBTC: {
        backgroundColor: "#1D201E",
        extension: "png",
        height: "45",
        url: "https://hitbtc.com",
        color: "#3DACD5"
      },
      Kraken: {
        backgroundColor: "#FFFFFF",
        extension: "png",
        height: "30",
        url: "https://kraken.com",
        color: "#008AD1"
      },
      Poloniex: {
        backgroundColor: "#03282A",
        extension: "png",
        height: "30",
        url: "https://poloniex.com",
        color: "#179294"
      }
    };

    let exchanges = [];
    this.props.exchanges.forEach((exchange, index) => {
      if (options.hasOwnProperty(exchange.name)) {
        exchanges.push(
          <ExchangeListModalItem
            url={options[exchange.name].url}
            name={exchange.name}
            color={options[exchange.name].color}
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
              <div className="container">
                <div className="alert alert-info" role="alert">
                  <div className="row">
                    <div className="col-1 d-flex justify-content-center align-items-center">
                      <i className="fa fa-info-circle" />
                    </div>
                    <div className="col-10">
                      Enter your read-only API keys to connect to cryptoasset
                      exchanges. <em>Never</em> enter API keys that have
                      writable permissions enabled.{" "}
                      <a
                        href="https://polyledger.zendesk.com/hc/en-us/articles/360002808492-What-are-API-keys-"
                        className="alert-link"
                        target="blank"
                      >
                        Learn more
                      </a>.
                    </div>
                  </div>
                </div>
                <div className="row">{exchanges}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExchangeListModal;
