import React, { Component } from 'react';
import Highcharts from 'highcharts';
import getChartOptions from '../../utils/ChartUtils';
import './Chart.css';

class Chart extends Component {
  componentDidMount() {
    let options = getChartOptions();
    Highcharts.chart('Chart__Highchart', options);
  }

  render() {
    return (
      <div className="Chart">
        <div id="Chart__Highchart">
          <div className="d-flex align-items-center justify-content-center Chart__Spinner">
            <i className="fas fa-spinner fa-spin fa-3x" />
          </div>
        </div>
      </div>
    );
  }
}

export default Chart;
