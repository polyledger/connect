import React, { Component } from "react";
import PropTypes from "prop-types";
import PersonalDetailsForm from "../PersonalDetailsForm/PersonalDetailsForm";
import PasswordForm from "../PasswordForm/PasswordForm";
import "./UserSettings.css";

class UserSettings extends Component {
  render() {
    return (
      <div className="UserSettings">
        <PersonalDetailsForm
          onUpdatePersonalDetails={this.props.onUpdatePersonalDetails}
          user={this.props.user}
        />
        <PasswordForm onUpdatePassword={this.props.onUpdatePassword} />
      </div>
    );
  }
}

UserSettings.propTypes = {
  user: PropTypes.object.isRequired,
  onUpdatePersonalDetails: PropTypes.func.isRequired,
  onUpdatePassword: PropTypes.func.isRequired
};

export default UserSettings;
