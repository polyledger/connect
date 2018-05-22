import React, { Component } from "react";
import Highcharts from "highcharts";
import getChartOptions from "../../../../utils/ChartUtils";
import "./Chart.css";

class Chart extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.series) {
      let options = getChartOptions(nextProps.series);
      this.chart = Highcharts.chart("Chart__Highchart", options);
    }
  }

  render() {
    let spinner;

    if (this.props.isFetching) {
      if (this.chart) this.chart.destroy();
      spinner = (
        <div className="d-flex align-items-center justify-content-center Chart__Spinner">
          <i className="fa fa-spinner fa-spin fa-3x" />
        </div>
      );
    } else {
      spinner = "";
    }

    return (
      <div className="Chart">
        <div id="Chart__Highchart" />
        {spinner}
      </div>
    );
  }
}

export default Chart;
