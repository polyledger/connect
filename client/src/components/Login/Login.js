import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailValid: false,
      password: "",
      passwordValid: false,
      remember: false,
      formValid: false,
      formErrors: {
        email: "",
        password: ""
      },
      validated: false
    };
  }

  errorClass(error) {
    return error.length === 0 ? "" : "has-error";
  }

  onChange(value) {
    let event = value;
    let target = event.target;
    let name = target.name;
    value = target.type === "checkbox" ? target.checked : target.value;

    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.validateForm();
    this.setState({ validated: true }, () => {
      if (this.state.formValid) {
        this.props.addAlert(
          "Secure login initiated. Sending authentication signature to server...",
          "info",
          "lock"
        );
      }
    });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : " is invalid.";
        break;
      case "password":
        passwordValid = value.length >= 8;
        fieldValidationErrors.password = passwordValid
          ? ""
          : " must be at least 8 characters.";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        passwordValid: passwordValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.emailValid && this.state.passwordValid
    });
  }

  render() {
    return (
      <div className="Login">
        <div className="col-sm-4 offset-sm-4">
          <h3 className="text-center pt-5 pb-4">Log in to Polyledger</h3>
          <div className="card">
            <div className="card-body">
              <form
                className={
                  this.state.validated ? "was-validated" : "needs-validation"
                }
                onSubmit={event => this.onSubmit(event)}
                noValidate
              >
                <div
                  className={`form-group
              ${this.errorClass(this.state.formErrors.email)}`}
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
                  {this.state.formErrors.email.length > 0 ? (
                    <div className="invalid-feedback">
                      Email {this.state.formErrors.email}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className={`form-group
              ${this.errorClass(this.state.formErrors.password)}`}
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
                    {this.state.formErrors.password.length > 0 ? (
                      <div className="invalid-feedback">
                        Password {this.state.formErrors.password}
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
