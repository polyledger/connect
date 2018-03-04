import React, { Component } from "react";
import "./NoMatch.css";

class NoMatch extends Component {
  render() {
    return (
      <div className="NoMatch">
        <div className="col-6 offset-3 text-center pt-5">
          <h3>Page not found</h3>
          <p className="lead">
            The page you are looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }
}

export default NoMatch;
