import React, { Component } from 'react';
import ChartContainer from '../ChartContainer/ChartContainer';
import PositionTable from '../PositionTable/PositionTable';

class Portfolio extends Component {
  render() {
    return (
      <div className="Portfolio">
        <ChartContainer />
        <PositionTable />
      </div>
    );
  }
}

export default Portfolio;
