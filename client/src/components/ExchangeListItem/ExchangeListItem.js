import React, { Component } from "react";
import PropTypes from "prop-types";

class ExchangeListItem extends Component {
  render() {
    return (
      <li
        className="ExchangeListItem list-group-item"
        style={{ backgroundColor: this.props.backgroundColor }}
      >
        <div className="row d-flex align-items-center">
          <div className="col-4 text-center">
            <a href={this.props.url} target="blank">
              <img
                height={this.props.height}
                alt={this.props.name}
                src={require(`../../assets/exchanges/${
                  this.props.name
                }.${this.props.extension.toLowerCase()}`)}
              />
            </a>
          </div>
          <div className="col-6">
            <form className="form-inline d-flex justify-content-center">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control m-1"
                  placeholder="API Key"
                />
              </div>
              <div className="form-group m-1">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Secret"
                />
              </div>
            </form>
          </div>

          <div className="col-2">
            <button className="btn btn-primary float-right">
              <i className="icon icon-squared-plus" /> Link
            </button>
          </div>
        </div>
      </li>
    );
  }
}

ExchangeListItem.propTypes = {
  name: PropTypes.string,
  extension: PropTypes.string,
  backgroundColor: PropTypes.string,
  size: PropTypes.string
};

export default ExchangeListItem;
