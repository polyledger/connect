import React, { Component } from 'react';
import Chart from '../Chart/Chart';
import ChartNav from '../ChartNav/ChartNav';
import ChartStat from '../ChartStat/ChartStat';
import './ChartContainer.css';

class ChartContainer extends Component {
  render() {
    return (
      <div className="ChartContainer">
        <div className="card">
          <div className="card-body">
            <div className="row py-2 text-center">
              <div className="col-md-4">
                <ChartStat
                  number={1000}
                  sign="+"
                  delta={5}
                  description="Market Value"
                />
              </div>
              <div className="col-md-4">
                <ChartStat
                  number={758}
                  delta={1.3}
                  sign="-"
                  description="All Time Return"
                />
              </div>
              <div className="col-md-4">
                <ChartStat
                  number={758}
                  sign="-"
                  delta={1.3}
                  description="Past Day"
                />
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-12">
                <ChartNav />
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-12">
                <Chart />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChartContainer;
