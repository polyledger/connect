import React, { Component } from "react";
import PropTypes from "prop-types";
import getImageSource from "../../../../utils/imageUtils";
import "./ExchangeListItem.css";

class ExchangeListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovering: false
    };
  }

  onMouseEnter(event) {
    this.setState({
      hovering: true
    });
  }

  onMouseLeave(event) {
    this.setState({
      hovering: false
    });
  }

  render() {
    return (
      <div className="col-4 my-2 ExchangeListItem">
        <div
          className={"card" + (this.state.hovering ? " border-success" : "")}
          style={{
            backgroundColor: this.props.backgroundColor
          }}
        >
          <div
            className="card-body text-center py-5 d-flex justify-content-center align-items-center"
            onMouseEnter={event => this.onMouseEnter(event)}
            onMouseLeave={event => this.onMouseLeave(event)}
            onClick={event => this.props.onClick(this.props)}
          >
            <div>
              <img
                height={this.props.height}
                alt={this.props.name}
                src={getImageSource(
                  "exchanges",
                  this.props.name.toLowerCase(),
                  this.props.extension.toLowerCase()
                )}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ExchangeListItem.propTypes = {
  name: PropTypes.string,
  height: PropTypes.string,
  extension: PropTypes.string,
  backgroundColor: PropTypes.string
};

export default ExchangeListItem;
