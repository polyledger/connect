import React, { Component } from "react";
import "./UserProfileSettings.css";

class UserProfileSettings extends Component {
  render() {
    return (
      <div className="UserProfileSettings">
        <h5>Personal Details</h5>
        <form>
          <div className="form-group row">
            <label htmlFor="legalName" className="col-sm-3 col-form-label">
              Legal Name
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                id="legalName"
                placeholder="Your Name"
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="email" className="col-sm-3 col-form-label">
              Email
            </label>
            <div className="col-sm-9">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
              />
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

        <form>
          <h5>Password</h5>
          <div className="form-group row">
            <label htmlFor="oldPassword" className="col-sm-3 col-form-label">
              Old Password
            </label>
            <div className="col-sm-9">
              <input
                type="password"
                className="form-control"
                id="oldPassword"
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="newPassword" className="col-sm-3 col-form-label">
              New Password
            </label>
            <div className="col-sm-9">
              <input
                type="password"
                className="form-control"
                id="newPassword"
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              htmlFor="confirmNewPassword"
              className="col-sm-3 col-form-label"
            >
              Confirm New Password
            </label>
            <div className="col-sm-9">
              <input
                type="password"
                className="form-control"
                id="confirmNewPassword"
              />
            </div>
          </div>
        </form>
        <div className="form-group row">
          <div className="col-sm-12">
            <button type="submit" className="btn btn-primary float-right">
              Change Password
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfileSettings;
