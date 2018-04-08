import React, { Component } from "react";
import "../ChartNav/ChartNav.css";

class ChartNav extends Component {
  render() {
    const { onClick } = this.props;

    return (
      <ul className="nav nav-pills justify-content-center mt-2">
        <li className="nav-item">
          <a className="nav-link active" role="button" data-toggle="tab">
            1D
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            role="button"
            data-toggle="tab"
            onClick={() => onClick("7D")}
          >
            7D
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            role="button"
            data-toggle="tab"
            onClick={() => onClick("1M")}
          >
            1M
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            role="button"
            data-toggle="tab"
            onClick={() => onClick("3M")}
          >
            3M
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            role="button"
            data-toggle="tab"
            onClick={() => onClick("6M")}
          >
            6M
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            role="button"
            data-toggle="tab"
            onClick={() => onClick("1Y")}
          >
            1Y
          </a>
        </li>
      </ul>
    );
  }
}

export default ChartNav;
