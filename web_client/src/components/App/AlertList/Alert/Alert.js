import React, { Component } from "react";

class Alert extends Component {
  onClick(event) {
    this.props.onRemove(this.props.id);
  }

  render() {
    return (
      <div className="Alert">
        <div
          className={
            "alert alert-" + this.props.style + " alert-dismissible fade show"
          }
          role="alert"
        >
          <i className={`fa fa-${this.props.icon}`} />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {this.props.text}
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={event => {
              this.onClick(event);
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    );
  }
}

export default Alert;
