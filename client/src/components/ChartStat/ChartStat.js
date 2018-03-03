import React, { Component } from "react";
import PropTypes from "prop-types";
import "../ChartStat/ChartStat.css";

class ChartStat extends Component {
  getDirection() {
    return this.props.sign === "+" ? "positive" : "negative";
  }

  render() {
    return (
      <div className="ChartStat">
        <div className="statcard p-1">
          <h3 className="statcard-number">
            {this.props.sign}${this.props.number}
            <small
              className={
                "delta-indicator delta-" + this.getDirection(this.props.sign)
              }
            >
              {this.props.delta}%
            </small>
          </h3>
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
