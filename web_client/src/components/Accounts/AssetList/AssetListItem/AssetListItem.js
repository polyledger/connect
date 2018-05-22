import React, { Component } from "react";
import PropTypes from "prop-types";
import getImageSource from "../../../../utils/imageUtils";
import "./AssetListItem.css";

class AssetListItem extends Component {
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
      <div className="col-md-2 col-sm-3 my-2 AssetListItem">
        <div
          className={"card" + (this.state.hovering ? " border-success" : "")}
        >
          <div
            className="card-body text-center py-3 d-flex justify-content-center align-items-center"
            onMouseEnter={event => this.onMouseEnter(event)}
            onMouseLeave={event => this.onMouseLeave(event)}
            onClick={event => this.props.onClick(this.props)}
          >
            <div>
              <img
                height="50"
                alt={this.props.symbol}
                src={getImageSource("coins", this.props.symbol)}
              />
              <div>
                <span className="lead text-primary my-2">
                  {this.props.symbol}
                </span>
                <br />
                <span>{this.props.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AssetListItem.propTypes = {
  name: PropTypes.string,
  height: PropTypes.string,
  extension: PropTypes.string,
  backgroundColor: PropTypes.string
};

export default AssetListItem;
