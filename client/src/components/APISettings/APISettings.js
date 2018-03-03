import React, { Component } from "react";
import "./APISettings.css";

class APISettings extends Component {
  render() {
    return (
      <div className="APISettings">
        <h5>API Keys</h5>
        <div className="alert alert-info" role="alert">
          <i className="icon icon-info" /> You haven't created any API keys yet.
          API keys allow you to perform automated actions with your own
          software.{" "}
          <a href="#" className="alert-link">
            Learn More
          </a>
        </div>
        <div className="form-group row">
          <div className="col-sm-12">
            <button type="submit" className="btn btn-primary float-right">
              <i className="icon icon-plus" />New API Key
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default APISettings;
