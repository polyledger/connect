import React, { Component } from "react";
import "./ConfirmEmail.css";

class ConfirmEmail extends Component {
  render() {
    return (
      <div className="ConfirmEmail">
        <h2>Confirm Email Address</h2>
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card">
              <div className="card-body text-center">
                <p className="lead">Check your inbox</p>
                <img
                  src="../../assets/img/icons/email.png"
                  alt="Check your email"
                />
                <p className="pt-4">
                  We've sent you an email to help verify your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmEmail;
