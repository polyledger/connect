import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

class Signup extends Component {
  render() {
    return (
      <div className="Signup">
        <div className="col-sm-4 offset-sm-4">
          <h3 className="text-center pt-5 pb-4">Create your account</h3>
          <div className="card">
            <div className="card-body">
              <form>
                <div className="form-row">
                  <div className="form-group col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="form-group col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    required
                  />
                  <small className="form-text text-muted">
                    We&apos;ll never share your email with anyone else.
                  </small>
                </div>
                <div className="form-group">
                  <div className="input-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    v-model="passwordConfirm"
                    required
                  />
                </div>
                <div className="form-group">
                  <div
                    className="g-recaptcha"
                    data-sitekey="6Ld61DoUAAAAAIaZHZoN_bHaYdHi3nB1Y3sJel9r"
                  />
                </div>
                <div className="form-group">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="TOS"
                      required
                    />
                    <label className="custom-control-label" htmlFor="TOS">
                      <small>
                        I certify that I am 18 years of age or older, and I
                        agree to the User Agreement and Privacy Policy.
                      </small>
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary btn-block">
                  Create Account
                </button>
              </form>
            </div>
          </div>
          <div className="text-center py-3">
            <p>
              <Link to="/login">Already have an account?</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
