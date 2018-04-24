import React, { Component } from "react";
import PropTypes from "prop-types";
import "./ExchangeListModalItem.css";

class ExchangeListModalItem extends Component {
  constructor() {
    super(props);

    this.state = {
      api_key: "",
      secret: ""
    };
  }

  render() {
    return (
      <div
        className="card ExchangeListModalItem"
        style={{ backgroundColor: this.props.backgroundColor }}
        onClick={event => {
          this.props.connectExchange(this.props.id);
        }}
      >
        <div className="card-body text-center py-5">
          <img
            height={this.props.height}
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
