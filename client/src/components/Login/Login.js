import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import FormValidator from "../../utils/formValidator";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this.validator = new FormValidator([
      {
        field: "email",
        method: "isEmpty",
        validWhen: false,
        message: "Email is required."
      },
      {
        field: "email",
        method: "isEmail",
        validWhen: true,
        message: "That is not a valid email address."
      },
      {
        field: "password",
        method: "isEmpty",
        validWhen: false,
        message: "Password is required."
      }
    ]);

    this.state = {
      email: "",
      password: "",
      remember: false,
      validation: this.validator.valid()
    };

    this.submitted = false;
  }

  onChange(event) {
    let name = event.target.name;
    let value =
      event.target.type === "checkbox"
        ? String(event.target.checked)
        : event.target.value;
    this.setState({
      [name]: value
    });
  }

  onSubmit(event) {
    event.preventDefault();

    const validation = this.validator.validate(this.state);
    this.setState({ validation }, () => {
      if (validation.isValid) {
        let credentials = {
          email: this.state.email,
          password: this.state.password,
          remember: this.state.remember
        };
        this.props.login(credentials);
      }
    });
    this.submitted = true;
  }

  render() {
    if (this.props.auth.isLoggedIn) {
      return <Redirect to="/portfolio" />;
    }

    let submitButtonText = this.props.auth.isFetching ? (
      <span>
        <i className="fa fa-spinner fa-spin" /> Logging in
      </span>
    ) : (
      <span>Log in</span>
    );

    let validation = this.submitted
      ? this.validator.validate(this.state)
      : this.state.validation;

    return (
      <div className="Login">
        <div className="col-sm-4 offset-sm-4">
          <h3 className="text-center pt-5 pb-4">Log in to Polyledger</h3>
          <div className="card">
            <div className="card-body">
              <form
                className={
                  this.submitted ? "was-validated" : "needs-validation"
                }
                onSubmit={event => this.onSubmit(event)}
                noValidate
              >
                <div
                  className={`form-group ${validation.email.isInvalid &&
                    "has-error"}`}
                >
                  <input
                    type="email"
                    value={this.state.email}
                    onChange={event => this.onChange(event)}
                    name="email"
                    className="form-control"
                    placeholder="Enter email"
                    required
                  />
                  {validation.email.isInvalid ? (
                    <div className="invalid-feedback">
                      {validation.email.message}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className={`form-group ${validation.password.isInvalid &&
                    "has-error"}`}
                >
                  <div className="input-group">
                    <input
                      type="password"
                      value={this.state.password}
                      onChange={event => this.onChange(event)}
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      minLength="8"
                      required
                    />
                    {validation.password.isInvalid ? (
                      <div className="invalid-feedback">
                        {validation.password.message}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      onChange={event => this.onChange(event)}
                      name="remember"
                      className="custom-control-input"
                      id="remember"
                    />
                    <label className="custom-control-label" htmlFor="remember">
                      <small>Keep me logged in</small>
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary btn-block">
                  {submitButtonText}
                </button>
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
