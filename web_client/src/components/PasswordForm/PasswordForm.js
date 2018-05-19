import React, { Component } from "react";
import PropTypes from "prop-types";
import FormValidator from "../../utils/formValidator";

class PasswordForm extends Component {
  constructor(props) {
    super(props);

    this.validator = new FormValidator([
      {
        field: "oldPassword",
        method: "isEmpty",
        validWhen: false,
        message: "Old password is required."
      },
      {
        field: "newPassword",
        method: "isEmpty",
        validWhen: false,
        message: "New password is required."
      },
      {
        field: "newPasswordConfirmation",
        method: "isEmpty",
        validWhen: false,
        message: "Password confirmation is required."
      },
      {
        field: "newPasswordConfirmation",
        method: (confirmation, state) => state.newPassword === confirmation,
        validWhen: true,
        message: "New password and new password confirmation do not match."
      }
    ]);

    this.state = {
      form: {
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: ""
      },
      validation: this.validator.getInitialState()
    };

    this.submitted = false;
  }

  onChange(event) {
    let form = { ...this.state.form };
    form[event.target.name] = event.target.value;
    this.setState({ form });
  }

  onSubmit(event) {
    event.preventDefault();

    const validation = this.validator.validate(this.state.form);
    this.setState({ validation }, () => {
      if (validation.isValid) {
        let passwords = {
          old_password: this.state.form.oldPassword,
          new_password: this.state.form.newPassword
        };
        this.props.onUpdatePassword(passwords);
      }
    });
    this.submitted = true;
  }

  render() {
    let validation = this.submitted
      ? this.validator.validate(this.state.form)
      : this.state.validation;

    return (
      <div className="PasswordForm">
        <form
          className={this.submitted ? "was-validated" : "needs-validation"}
          onSubmit={event => this.onSubmit(event)}
          noValidate
        >
          <h5>Password</h5>
          <div
            className={`form-group row
        ${validation.oldPassword.isInvalid && "has-error"}`}
          >
            <label htmlFor="oldPassword" className="col-sm-3 col-form-label">
              Old Password
            </label>
            <div className="col-sm-9">
              <input
                type="password"
                className="form-control"
                id="oldPassword"
                name="oldPassword"
                value={this.state.form.oldPassword}
                onChange={event => this.onChange(event)}
                required
              />
              {validation.oldPassword.isInvalid ? (
                <div className="invalid-feedback">
                  {validation.oldPassword.message}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div
            className={`form-group row
        ${validation.newPassword.isInvalid && "has-error"}`}
          >
            <label htmlFor="newPassword" className="col-sm-3 col-form-label">
              New Password
            </label>
            <div className="col-sm-9">
              <input
                type="password"
                className="form-control"
                id="newPassword"
                name="newPassword"
                value={this.state.form.newPassword}
                onChange={event => this.onChange(event)}
                required
              />
              {validation.newPassword.isInvalid ? (
                <div className="invalid-feedback">
                  {validation.newPassword.message}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div
            className={`form-group row
        ${validation.newPasswordConfirmation.isInvalid && "has-error"}`}
          >
            <label
              htmlFor="newPasswordConfirmation"
              className="col-sm-3 col-form-label"
            >
              Confirm New Password
            </label>
            <div className="col-sm-9">
              <input
                type="password"
                className="form-control"
                name="newPasswordConfirmation"
                value={this.state.form.newPasswordConfirmation}
                onChange={event => this.onChange(event)}
                required
              />
              {validation.newPasswordConfirmation.isInvalid ? (
                <div className="invalid-feedback">
                  {validation.newPasswordConfirmation.message}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <button type="submit" className="btn btn-primary float-right">
                Change Password
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

PasswordForm.propTypes = {
  onUpdatePassword: PropTypes.func.isRequired
};

export default PasswordForm;
