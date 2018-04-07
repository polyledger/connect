import React, { Component } from "react";
import PropTypes from "prop-types";
import Chart from "../Chart/Chart";
import ChartNav from "../ChartNav/ChartNav";
import ChartStat from "../ChartStat/ChartStat";
import { fetchPortfolio, fetchChartData } from "../../actions/portfolioActions";
import "./ChartWrapper.css";

class ChartWrapper extends Component {
  componentDidMount() {
    this.props.dispatch(fetchPortfolio());
    this.props.dispatch(fetchChartData());
  }

  render() {
    return (
      <div className="ChartWrapper">
        <div className="card">
          <div className="card-body">
            <div className="row py-2 text-center">
              <div className="col-sm-4">
                <ChartStat
                  number={1000}
                  sign="+"
                  delta={5}
                  description="Market Value"
                />
              </div>
              <div className="col-sm-4">
                <ChartStat
                  number={758}
                  delta={1.3}
                  sign="-"
                  description="All Time Return"
                />
              </div>
              <div className="col-sm-4">
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

ChartWrapper.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default ChartWrapper;
