import React, { Component } from "react";
import $ from "jquery";
import PropTypes from "prop-types";
import FormValidator from "../../../utils/formValidator";
import getImageSource from "../../../utils/imageUtils";

class AddressForm extends Component {
  constructor(props) {
    super(props);

    this.validator = new FormValidator([
      {
        field: "address",
        method: "isEmpty",
        validWhen: false,
        message: "Address is required."
      }
    ]);

    this.state = {
      form: {
        assetId: this.props.asset.id,
        address: ""
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
        this.props
          .connectAddress(this.state.form.assetId, this.state.form.address)
          .then(() => {
            let form = { ...this.state.form };
            form.address = "";
            this.submitted = false;
            this.setState({
              form,
              validation: this.validator.getInitialState()
            });
            $(".modal").modal("hide");
          });
      }
    });
    this.submitted = true;
  }

  render() {
    let validation = this.submitted
      ? this.validator.validate(this.state.form)
      : this.state.validation;

    return (
      <div className="AddressForm">
        <div className="d-flex justify-content-center align-items-center">
          <img
            height="50"
            alt={this.props.asset.symbol}
            src={getImageSource("coins", this.props.asset.symbol)}
          />
          <div className="ml-2">
            <span className="lead text-primary my-2">
              {this.props.asset.symbol}
            </span>
            <br />
            <span>{this.props.asset.name}</span>
          </div>
        </div>
        <form
          className={
            "m-3 " + (this.submitted ? "was-validated" : "needs-validation")
          }
          onSubmit={event => this.onSubmit(event)}
          noValidate
        >
          <div className="form-group">
            <input
              placeholder="Public address"
              name="address"
              value={this.state.form.address}
              onChange={event => this.onChange(event)}
              className="form-control"
              required
            />
            {validation.address.isInvalid ? (
              <div className="invalid-feedback text-left">
                {validation.address.message}
              </div>
            ) : (
              ""
            )}
          </div>
          <button
            type="submit"
            data-toggle="modal"
            data-target="#asset"
            className="btn btn-block btn-outline-primary pull-right"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

AddressForm.propTypes = {
  name: PropTypes.string,
  extension: PropTypes.string,
  backgroundColor: PropTypes.string
};

export default AddressForm;
