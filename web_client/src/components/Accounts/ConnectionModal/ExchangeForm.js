import React, { Component } from "react";
import PropTypes from "prop-types";
import FormValidator from "../../../utils/formValidator";

class ExchangeForm extends Component {
  constructor(props) {
    super(props);

    this.validator = new FormValidator([
      {
        field: "apiKey",
        method: "isEmpty",
        validWhen: false,
        message: "API Key is required."
      },
      {
        field: "secret",
        method: "isEmpty",
        validWhen: false,
        message: "Secret is required."
      }
    ]);

    this.state = {
      form: {
        exchangeId: this.props.exchange.id,
        apiKey: "",
        secret: ""
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
        this.props.connectExchange(
          this.state.form.exchangeId,
          this.state.form.apiKey,
          this.state.form.secret
        );
        let form = { ...this.state.form };
        form.apiKey = "";
        form.secret = "";
        this.setState({ form, selected: false, hovering: false });
      }
    });
    this.submitted = true;
  }

  render() {
    let validation = this.submitted
      ? this.validator.validate(this.state.form)
      : this.state.validation;

    return (
      <div className="ExchangeForm">
        <div className="alert alert-info" role="alert">
          <div className="row">
            <div className="col-1 d-flex justify-content-center align-items-center">
              <i className="fa fa-info-circle" />
            </div>
            <div className="col-10">
              Enter your read-only API keys to connect to cryptoasset exchanges.{" "}
              <em>Never</em> enter API keys that have writable permissions
              enabled.{" "}
              <a
                href="https://polyledger.zendesk.com/hc/en-us/articles/360002808492-What-are-API-keys-"
                className="alert-link"
                target="blank"
              >
                Learn more
              </a>.
            </div>
          </div>
        </div>
        <form
          onClick={event => event.stopPropagation()}
          className={
            "my-3 " + (this.submitted ? "was-validated" : "needs-validation")
          }
          onSubmit={event => this.onSubmit(event)}
          noValidate
        >
          <div className="form-group">
            <input
              placeholder="API Key"
              name="apiKey"
              value={this.state.form.apiKey}
              onChange={event => this.onChange(event)}
              className="form-control"
              required
            />
            {validation.apiKey.isInvalid ? (
              <div className="invalid-feedback text-left">
                {validation.apiKey.message}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="form-group">
            <input
              placeholder="Secret"
              name="secret"
              value={this.state.form.secret}
              onChange={event => this.onChange(event)}
              className="form-control"
              required
            />
            {validation.secret.isInvalid ? (
              <div className="invalid-feedback text-left">
                {validation.secret.message}
              </div>
            ) : (
              ""
            )}
          </div>
          <p className="text-center">
            <a
              href={this.props.exchange.url}
              target="blank"
              style={{ color: this.props.exchange.color }}
            >
              <i className="fa fa-external-link" /> {this.props.exchange.name}
            </a>
            &nbsp;|&nbsp;
            <a
              href="https://polyledger.zendesk.com/hc/en-us/articles/360002808492-What-are-API-keys"
              target="blank"
              style={{ color: this.props.exchange.color }}
            >
              <i className="fa fa-question-circle" /> Help
            </a>
          </p>
          <button
            type="submit"
            data-toggle="modal"
            data-target="#exchangeModal"
            className="btn btn-block btn-outline-primary pull-right"
            style={{
              color: this.props.exchange.color,
              borderColor: this.props.exchange.color,
              backgroundColor: this.props.exchange.backgroundColor
            }}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

ExchangeForm.propTypes = {
  exchange: PropTypes.object.isRequired
};

export default ExchangeForm;
