import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { Redirect } from "react-router";
import FormValidator from "../../utils/formValidator";
import "./Signup.css";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.validator = new FormValidator([
      {
        field: "firstName",
        method: "isEmpty",
        validWhen: false,
        message: "First name is required."
      },
      {
        field: "lastName",
        method: "isEmpty",
        validWhen: false,
        message: "Last name is required."
      },
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
      },
      {
        field: "passwordConfirmation",
        method: "isEmpty",
        validWhen: false,
        message: "Password confirmation is required."
      },
      {
        field: "passwordConfirmation",
        method: (confirmation, form) => {
          return form.password === confirmation;
        },
        validWhen: true,
        message: "Passwords do not match."
      },
      {
        field: "recaptcha",
        method: "isEmpty",
        validWhen: false,
        message: "The ReCAPTCHA has not been confirmed."
      },
      {
        field: "termsOfService",
        method: (value, state) => value === "true",
        validWhen: true,
        message: "Must agree to the terms of service."
      }
    ]);

    this.state = {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        recaptcha: "",
        termsOfService: false
      },
      validation: this.validator.getInitialState()
    };

    this.submitted = false;
  }

  onChange(event) {
    let name, value;
    if (typeof event === "string") {
      // ReCAPTCHA
      name = "recaptcha";
      value = event;
    } else {
      name = event.target.name;
      value =
        event.target.type === "checkbox"
          ? String(event.target.checked)
          : event.target.value;
    }

    let form = { ...this.state.form };
    form[name] = value;
    this.setState({ form });
  }

  onExpired(value) {
    let form = { ...this.state.form };
    form.recaptcha = "";
    this.setState({ form });
  }

  onSubmit(event) {
    event.preventDefault();

    const validation = this.validator.validate(this.state.form);
    this.setState({ validation }, () => {
      if (validation.isValid) {
        let credentials = {
          first_name: this.state.form.firstName,
          last_name: this.state.form.lastName,
          email: this.state.form.email,
          password: this.state.form.password
        };
        this.props.signup(credentials);
      }
    });
    this.submitted = true;
  }

  render() {
    if (this.props.auth.isSignedUp) {
      return <Redirect to="/confirm-email" />;
    }

    let submitButtonText = this.props.auth.isFetching ? (
      <span>
        <i className="fa fa-spinner fa-spin" /> Creating Account
      </span>
    ) : (
      <span>Create Account</span>
    );

    let validation = this.submitted
      ? this.validator.validate(this.state.form)
      : this.state.validation;

    return (
      <div className="Signup">
        <div className="col-sm-4 offset-sm-4">
          <h3 className="text-center pt-5 pb-4">Create your account</h3>
          <div className="card">
            <div className="card-body">
              <form
                className={
                  this.submitted ? "was-validated" : "needs-validation"
                }
                onSubmit={event => this.onSubmit(event)}
                noValidate
              >
                <div className="form-row">
                  <div
                    className={`form-group col
                  ${validation.firstName.isInvalid && "has-error"}`}
                  >
                    <input
                      type="text"
                      value={this.state.form.firstName}
                      onChange={event => this.onChange(event)}
                      name="firstName"
                      className="form-control"
                      placeholder="First name"
                      required
                    />
                    {validation.firstName.isInvalid ? (
                      <div className="invalid-feedback">
                        {validation.firstName.message}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    className={`form-group col ${validation.lastName
                      .isInvalid && "has-error"}`}
                  >
                    <input
                      type="text"
                      value={this.state.form.lastName}
                      onChange={event => this.onChange(event)}
                      name="lastName"
                      className="form-control"
                      placeholder="Last name"
                      required
                    />
                    {validation.lastName.isInvalid ? (
                      <div className="invalid-feedback">
                        {validation.lastName.message}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div
                  className={`form-group
                  ${validation.email.isInvalid && "has-error"}`}
                >
                  <input
                    type="email"
                    value={this.state.form.email}
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
                  <small className="form-text text-muted">
                    We&apos;ll never share your email with anyone else.
                  </small>
                </div>
                <div
                  className={`form-group
                ${validation.password.isInvalid && "has-error"}`}
                >
                  <input
                    type="password"
                    value={this.state.form.password}
                    onChange={event => this.onChange(event)}
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    pattern=".{8,}"
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
                <div
                  className={`form-group
                ${validation.passwordConfirmation.isInvalid && "has-error"}`}
                >
                  <input
                    type="password"
                    value={this.state.form.passwordConfirmation}
                    onChange={event => this.onChange(event)}
                    name="passwordConfirmation"
                    className="form-control"
                    placeholder="Confirm Password"
                    pattern=".{8,}"
                    required
                  />

                  {validation.passwordConfirmation.isInvalid ? (
                    <div className="invalid-feedback">
                      {validation.passwordConfirmation.message}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <ReCAPTCHA
                    sitekey="6Ld61DoUAAAAAIaZHZoN_bHaYdHi3nB1Y3sJel9r"
                    onChange={event => this.onChange(event)}
                    theme="dark"
                    onExpired={event => this.onExpired(event)}
                  />
                </div>
                <div
                  className={`form-group
                ${validation.recaptcha.isInvalid && "has-error"}`}
                >
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      onChange={event => this.onChange(event)}
                      name="termsOfService"
                      className="custom-control-input"
                      id="termsOfService"
                      required
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="termsOfService"
                    >
                      <small>
                        I certify that I am 18 years of age or older, and I
                        agree to the User Agreement and Privacy Policy.
                      </small>
                    </label>
                    {validation.termsOfService.isInvalid ? (
                      <div className="invalid-feedback">
                        {validation.termsOfService.message}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  {submitButtonText}
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
