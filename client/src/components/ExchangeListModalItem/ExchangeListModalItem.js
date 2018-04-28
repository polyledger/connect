import React, { Component } from "react";
import PropTypes from "prop-types";
import FormValidator from "../../utils/formValidator";
import "./ExchangeListModalItem.css";

class ExchangeListModalItem extends Component {
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
      exchangeId: this.props.id,
      apiKey: "",
      secret: "",
      selected: false,
      hovering: false,
      validation: this.validator.valid()
    };

    this.cardBody = React.createRef();
    this.image = React.createRef();
    this.hovering = false;
    this.submitted = false;
  }

  targetIsParent(target) {
    return target === this.cardBody.current || target === this.image.current;
  }

  onClick(event) {
    if (this.targetIsParent(event.target)) {
      this.setState({
        selected: !this.state.selected
      });
    }
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmit(event) {
    event.preventDefault();

    const validation = this.validator.validate(this.state);
    this.setState({ validation }, () => {
      if (validation.isValid) {
        this.props.connectExchange(
          this.state.exchangeId,
          this.state.apiKey,
          this.state.secret
        );
        this.setState({
          apiKey: "",
          secret: "",
          selected: false,
          hovering: false
        });
      }
    });
    this.submitted = true;
  }

  onMouseEnter(event) {
    this.setState({
      hovering: true
    });
  }

  onMouseLeave(event) {
    this.setState({
      hovering: false
    });
  }

  render() {
    let validation = this.submitted
      ? this.validator.validate(this.state)
      : this.state.validation;

    let content = this.state.selected ? (
      <form
        className={
          "m-3 " + (this.submitted ? "was-validated" : "needs-validation")
        }
        onSubmit={event => this.onSubmit(event)}
        noValidate
      >
        <div className="form-group">
          <input
            placeholder="API Key"
            name="apiKey"
            value={this.state.apiKey}
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
            value={this.state.secret}
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
            href={this.props.url}
            target="blank"
            style={{ color: this.props.color }}
          >
            <i className="fa fa-external-link" /> {this.props.name}
          </a>
          &nbsp;|&nbsp;
          <a
            href="https://polyledger.zendesk.com/hc/en-us/articles/360002808492-What-are-API-keys"
            target="blank"
            style={{ color: this.props.color }}
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
            color: this.props.color,
            borderColor: this.props.color,
            backgroundColor: this.props.backgroundColor
          }}
        >
          Submit
        </button>
      </form>
    ) : (
      ""
    );

    return (
      <div className="col-6 mb-2 ExchangeListModalItem">
        <div
          className={"card" + (this.state.hovering ? " border-success" : "")}
          style={{
            backgroundColor: this.props.backgroundColor,
            height: "370px"
          }}
        >
          <div
            className="card-body text-center py-5 d-flex justify-content-center align-items-center"
            onClick={event => this.onClick(event)}
            onMouseEnter={event => this.onMouseEnter(event)}
            onMouseLeave={event => this.onMouseLeave(event)}
            ref={this.cardBody}
          >
            <div>
              <img
                height={this.props.height}
                ref={this.image}
                alt={this.props.name}
                src={require(`../../assets/exchanges/${this.props.name.toLowerCase()}.${this.props.extension.toLowerCase()}`)}
              />
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ExchangeListModalItem.propTypes = {
  name: PropTypes.string,
  height: PropTypes.string,
  extension: PropTypes.string,
  backgroundColor: PropTypes.string
};

export default ExchangeListModalItem;
