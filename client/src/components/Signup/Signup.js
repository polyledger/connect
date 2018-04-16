import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "./Signup.css";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      firstNameValid: false,
      last_name: "",
      lastNameValid: false,
      email: "",
      emailValid: false,
      password: "",
      passwordValid: false,
      passwordConfirm: "",
      passwordConfirmValid: true,
      recaptcha: "",
      recaptchaValid: false,
      termsOfServiceValid: false,
      formValid: false,
      formErrors: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        recaptcha: "",
        termsOfService: ""
      },
      validated: false
    };
  }

  errorClass(error) {
    return error.length === 0 ? "" : "has-error";
  }

  onChange(value) {
    if (typeof value === "object") {
      if (!value) return; // The reCAPTCHA returns null on expiration
      let event = value;
      let target = event.target;
      let name = target.name;
      value = target.type === "checkbox" ? target.checked : target.value;

      this.setState({ [name]: value }, () => {
        this.validateField(name, value);
      });
    } else if (typeof value === "string") {
      this.setState({ recaptcha: value }, () => {
        this.validateField("recaptcha", value);
      });
    }
  }

  onSubmit(event) {
    event.preventDefault();
    this.validateForm();

    if (!this.state.recaptchaValid) {
      this.props.addAlert("ReCAPTCHA is invalid.", "danger");
    }
    this.setState({ validated: true });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let firstNameValid = this.state.firstNameValid;
    let lastNameValid = this.state.lastNameValid;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    let passwordConfirmValid = this.state.passwordConfirmValid;
    let recaptchaValid = this.state.recatchaValid;
    let termsOfServiceValid = this.state.termsOfServiceValid;

    switch (fieldName) {
      case "first_name":
        firstNameValid = value.length > 0;
        fieldValidationErrors.first_name = firstNameValid
          ? ""
          : " is not filled in.";
        break;
      case "last_name":
        lastNameValid = value.length > 0;
        fieldValidationErrors.last_name = lastNameValid
          ? ""
          : " is not filled in.";
        break;
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : " is invalid.";
        break;
      case "password":
        passwordValid = value.length >= 8;
        fieldValidationErrors.password = passwordValid
          ? ""
          : " must be at least 8 characters.";
        passwordConfirmValid =
          value === this.state.passwordConfirm ? true : false;
        break;
      case "passwordConfirm":
        passwordConfirmValid = value === this.state.password ? true : false;
        break;
      case "recaptcha":
        recaptchaValid = value ? true : false;
        break;
      case "termsOfService":
        termsOfServiceValid = value ? true : false;
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        firstNameValid: firstNameValid,
        lastNameValid: lastNameValid,
        emailValid: emailValid,
        passwordValid: passwordValid,
        passwordConfirmValid: passwordConfirmValid,
        recaptchaValid: recaptchaValid,
        termsOfServiceValid: termsOfServiceValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.firstNameValid &&
        this.state.lastNameValid &&
        this.state.emailValid &&
        this.state.passwordValid &&
        this.state.passwordConfirmValid &&
        this.state.recaptchaValid &&
        this.state.termsOfServiceValid
    });
  }

  render() {
    return (
      <div className="Signup">
        <div className="d-flex justify-content-center">
          <div>
            <h3 className="text-center pt-5 pb-4">Create your account</h3>
            <div className="card">
              <div className="card-body">
                <form
                  className={
                    this.state.validated ? "was-validated" : "needs-validation"
                  }
                  onSubmit={event => this.onSubmit(event)}
                  noValidate
                >
                  <div className="form-row">
                    <div
                      className={`form-group col
                    ${this.errorClass(this.state.formErrors.first_name)}`}
                    >
                      <input
                        type="text"
                        value={this.state.first_name}
                        onChange={event => this.onChange(event)}
                        name="first_name"
                        className="form-control"
                        placeholder="First name"
                        required
                      />
                      {this.state.formErrors.first_name.length > 0 ? (
                        <div className="invalid-feedback">
                          First name {this.state.formErrors.first_name}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div
                      className={`form-group col
                    ${this.errorClass(this.state.formErrors.last_name)}`}
                    >
                      <input
                        type="text"
                        value={this.state.last_name}
                        onChange={event => this.onChange(event)}
                        name="last_name"
                        className="form-control"
                        placeholder="Last name"
                        required
                      />
                      {this.state.formErrors.last_name.length > 0 ? (
                        <div className="invalid-feedback">
                          Last name {this.state.formErrors.last_name}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
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
                    <small className="form-text text-muted">
                      We&apos;ll never share your email with anyone else.
                    </small>
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
                        pattern=".{8,}"
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
                  <div
                    className={`form-group
                  ${this.errorClass(this.state.formErrors.passwordConfirm)}`}
                  >
                    <div className="input-group">
                      <input
                        type="password"
                        value={this.state.passwordConfirm}
                        onChange={event => this.onChange(event)}
                        name="passwordConfirm"
                        className="form-control"
                        placeholder="Confirm Password"
                        pattern=".{8,}"
                        required
                      />
                      <div className="input-group-append">
                        <span className="input-group-text" id="confirm-addon">
                          <i
                            className={
                              "fa " +
                              (this.state.passwordConfirmValid
                                ? "fa-check text-success"
                                : "fa-times text-danger")
                            }
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <ReCAPTCHA
                      sitekey="6Ld61DoUAAAAAIaZHZoN_bHaYdHi3nB1Y3sJel9r"
                      onChange={event => this.onChange(event)}
                    />
                  </div>
                  <div
                    className={`form-group
                  ${this.errorClass(this.state.formErrors.termsOfService)}`}
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
                      {this.state.formErrors.termsOfService.length > 0 ? (
                        <div className="invalid-feedback">
                          Terms of Service{" "}
                          {this.state.formErrors.termsOfService}
                        </div>
                      ) : (
                        ""
                      )}
                      <label
                        className="custom-control-label"
                        htmlFor="termsOfService"
                      >
                        <small>
                          I certify that I am 18 years of age or older, and I
                          agree to the User Agreement and Privacy Policy.
                        </small>
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
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
      </div>
    );
  }
}

export default Signup;
