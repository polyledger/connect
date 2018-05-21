import React, { Component } from "react";
import PropTypes from "prop-types";
import FormValidator from "../../../../utils/formValidator";

class PersonalDetailsForm extends Component {
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
      }
    ]);

    this.state = {
      form: {
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email
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
        let personalDetails = {
          first_name: this.state.form.firstName,
          last_name: this.state.form.lastName,
          email: this.state.form.email
        };
        this.props.onUpdatePersonalDetails(personalDetails);
      }
    });
    this.submitted = true;
  }

  render() {
    let validation = this.submitted
      ? this.validator.validate(this.state.form)
      : this.state.validation;

    return (
      <div className="PersonalDetailsForm">
        <form
          className={this.submitted ? "was-validated" : "needs-validation"}
          onSubmit={event => this.onSubmit(event)}
          noValidate
        >
          <h5>Personal Details</h5>
          <div
            className={`form-group row
        ${validation.firstName.isInvalid && "has-error"}`}
          >
            <label htmlFor="firstName" className="col-sm-3 col-form-label">
              First Name
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                placeholder="Your first name"
                value={this.state.form.firstName}
                onChange={event => this.onChange(event)}
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
          </div>
          <div
            className={`form-group row
      ${validation.lastName.isInvalid && "has-error"}`}
          >
            <label htmlFor="lastName" className="col-sm-3 col-form-label">
              Last Name
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                placeholder="Your last name"
                value={this.state.form.lastName}
                onChange={event => this.onChange(event)}
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
            className={`form-group row
      ${validation.email.isInvalid && "has-error"}`}
          >
            <label htmlFor="email" className="col-sm-3 col-form-label">
              Email
            </label>
            <div className="col-sm-9">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Email"
                value={this.state.form.email}
                onChange={event => this.onChange(event)}
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
          </div>

          <div className="form-group row">
            <div className="col-sm-12">
              <button type="submit" className="btn btn-primary float-right">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

PersonalDetailsForm.propTypes = {
  onUpdatePersonalDetails: PropTypes.func.isRequired
};

export default PersonalDetailsForm;
