import React, { Component } from 'react';
import '../ChartNav/ChartNav.css';

class ChartNav extends Component {
  render() {
    return (
      <ul className="nav nav-pills justify-content-center my-4">
        <li className="nav-item">
          <a className="nav-link active" role="button" data-toggle="tab">
            1D
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" role="button" data-toggle="tab">
            7D
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" role="button" data-toggle="tab">
            1M
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" role="button" data-toggle="tab">
            3M
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" role="button" data-toggle="tab">
            6M
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" role="button" data-toggle="tab">
            1Y
          </a>
        </li>
      </ul>
    );
  }
}

export default ChartNav;
