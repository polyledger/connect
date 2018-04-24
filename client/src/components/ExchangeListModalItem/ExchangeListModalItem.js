import React, { Component } from "react";
import PropTypes from "prop-types";

class ExchangeListModalItem extends Component {
  render() {
    return (
      <div
        className="card ExchangeListModalItem"
        style={{ backgroundColor: this.props.backgroundColor }}
      >
        <div className="card-body text-center py-5">
          <img
            height="30"
            alt={this.props.name}
            src={require(`../../assets/exchanges/${
              this.props.name
            }.${this.props.extension.toLowerCase()}`)}
          />
        </div>
      </div>
    );
  }
}

ExchangeListModalItem.propTypes = {
  name: PropTypes.string,
  extension: PropTypes.string,
  backgroundColor: PropTypes.string
};

export default ExchangeListModalItem;
