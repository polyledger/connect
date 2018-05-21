import React, { Component } from "react";
import coinage from "coinage-lib";
import PriceTable from "./PriceTable/PriceTable";
import "./Markets.css";

class Markets extends Component {
  constructor(props) {
    super(props);
    this.state = { tickers: [] };
  }

  async componentDidMount() {
    let tickers = await coinage.getTickers();
    this.setState({ tickers: tickers });
  }

  render() {
    return (
      <div className="Markets">
        <PriceTable tickers={this.state.tickers} />
      </div>
    );
  }
}

export default Markets;
