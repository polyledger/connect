import React, { Component } from "react";
import PropTypes from "prop-types";
import numeral from "numeral";
import "../ChartStat/ChartStat.css";

class ChartStat extends Component {
  render() {
    let number = numeral(this.props.number).format("$0,0.00");
    return (
      <div className="ChartStat">
        <div className="statcard p-1">
          <h3 className="statcard-number">{number}</h3>
          <span className="statcard-desc">{this.props.description}</span>
        </div>
      </div>
    );
  }
}

ChartStat.propTypes = {
  number: PropTypes.number,
  sign: PropTypes.string,
  delta: PropTypes.number,
  description: PropTypes.string
};

export default ChartStat;
