import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

class Login extends Component {
  render() {
    return (
      <div className="Login">
        <div className="col-sm-4 offset-sm-4">
          <h3 className="text-center pt-5 pb-4">Log in to Polyledger</h3>
          <div className="card">
            <div className="card-body">
              <form>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    required
                  />
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
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="remember"
                      required
                    />
                    <label className="custom-control-label" htmlFor="TOS">
                      <small>Keep me logged in</small>
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary btn-block">Log in</button>
              </form>
            </div>
          </div>
          <div className="text-center py-3">
            <p>
              <Link to="#">Forgot password?</Link>
            </p>
            <p>
              <Link to="/signup">Don&apos;t have an account?</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
