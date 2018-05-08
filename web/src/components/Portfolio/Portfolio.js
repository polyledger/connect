import React, { Component } from "react";
import ChartContainer from "../../containers/ChartContainer";
import PositionTable from "../PositionTable/PositionTable";

class Portfolio extends Component {
  render() {
    return (
      <div className="Portfolio">
        <ChartContainer />
        <PositionTable
          fetchPositions={this.props.fetchPositions}
          positions={this.props.positions}
        />
      </div>
    );
  }
}

export default Portfolio;
