import React, { Component } from "react";
import EmailIcon from "../../assets/icons/email.png";
import "./ConfirmEmail.css";

class ConfirmEmail extends Component {
  render() {
    return (
      <div className="ConfirmEmail py-5">
        <h2 className="text-center">Confirm Email Address</h2>
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card">
              <div className="card-body text-center">
                <p className="lead">Check your inbox</p>
                <img src={EmailIcon} alt="Check your email" />
                <p className="pt-4">
                  We've sent you an email to help verify your account.
                </p>
                <small className="text-muted">
                  Having an issue? Contact support:{" "}
                  <a href="mailto:support@polyledger.com">
                    support@polyledger.com
                  </a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmEmail;
