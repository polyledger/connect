import React, { Component } from "react";
import $ from "jquery";
import Toolbar from "../Toolbar/Toolbar";
import ConnectionModal from "../ConnectionModal/ConnectionModal";
import ExchangeListItem from "./ExchangeListItem/ExchangeListItem";

class ExchangeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exchanges: this.props.exchanges,
      selected: null
    };

    this.filterList = this.filterList.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchExchanges();
  }

  filterList(event) {
    let updatedList = this.props.exchanges;
    updatedList = updatedList.filter(exchange => {
      return (
        exchange.name.toLowerCase().search(event.target.value.toLowerCase()) !==
        -1
      );
    });
    this.setState({ exchanges: updatedList });
  }

  onClick(exchange) {
    this.setState({ selected: exchange });
    $(".modal").modal("show");
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
        height: "30",
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
    this.state.exchanges.forEach((exchange, index) => {
      if (options.hasOwnProperty(exchange.name)) {
        exchanges.push(
          <ExchangeListItem
            url={options[exchange.name].url}
            name={exchange.name}
            color={options[exchange.name].color}
            extension={options[exchange.name].extension}
            height={options[exchange.name].height}
            backgroundColor={options[exchange.name].backgroundColor}
            connectExchange={this.props.connectExchange}
            id={exchange.id}
            key={exchange.id}
            onClick={this.onClick}
          />
        );
      }
    });

    return (
      <div className="ExchangeList">
        <Toolbar title="Connect an exchange" onChange={this.filterList} />
        <div className="row">{exchanges}</div>
        <ConnectionModal
          title="Connect an exchange"
          exchange={this.state.selected}
          connectExchange={this.props.connectExchange}
        />
      </div>
    );
  }
}

export default ExchangeList;
