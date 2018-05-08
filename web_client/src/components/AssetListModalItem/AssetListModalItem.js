import React, { Component } from "react";
import PropTypes from "prop-types";
import FormValidator from "../../utils/formValidator";
import "./AssetListModalItem.css";

class AssetListModalItem extends Component {
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
      assetId: this.props.id,
      address: "",
      selected: false,
      hovering: false,
      validation: this.validator.valid()
    };

    this.cardBody = React.createRef();
    this.image = React.createRef();
    this.hovering = false;
    this.submitted = false;
  }

  getImageSource() {
    try {
      return require(`../../assets/coins/${this.props.symbol}.svg`);
    } catch (error) {
      try {
        return require(`../../assets/coins/${this.props.symbol}.png`);
      } catch (error) {
        return require(`../../assets/default.png`);
      }
    }
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
        this.props.connectAddress(this.state.assetId, this.state.address);
        this.setState({
          address: "",
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
            placeholder="Public address"
            name="address"
            value={this.state.address}
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
          data-target="#assetModal"
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
      <div className="col-4 mb-2 AssetListModalItem">
        <div
          className={"card" + (this.state.hovering ? " border-success" : "")}
          style={{ height: "250px" }}
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
                height="50"
                ref={this.image}
                alt={this.props.symbol}
                src={this.getImageSource(this.props.symbol)}
              />
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AssetListModalItem.propTypes = {
  name: PropTypes.string,
  height: PropTypes.string,
  extension: PropTypes.string,
  backgroundColor: PropTypes.string
};

export default AssetListModalItem;
