import React, { Component } from "react";
// import ChartNav from "../ChartNav/ChartNav";
// import Chart from "../Chart/Chart";
import "./Analytics.css";

class Analytics extends Component {
  render() {
    return (
      <div className="Analytics">
        <div className="card">
          <div className="card-body">
            <div className="row py-2">
              <div className="col-md-12">{/* <ChartNav /> */}</div>
            </div>
            <div className="row py-2">
              <div className="col-md-12">{/* <Chart /> */}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Analytics;
