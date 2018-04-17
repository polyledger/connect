import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Activation extends Component {
  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const token = params.get("token");
    this.props.activate(token);
  }

  render() {
    if (this.props.auth.isLoggedIn) {
      return <Redirect to="/portfolio" />;
    }

    return (
      <div className="Activation">
        <div className="container p-5">
          <h2 className="text-center">Account Activation</h2>
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="card">
                <div className="card-body text-center">
                  <div className="d-flex align-items-center justify-content-center py-5">
                    <i className="fa fa-spinner fa-spin fa-3x" />
                  </div>
                  <p className="lead">Your account is being activated</p>
                  <p>Please wait a moment while we activate your account.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Activation;
