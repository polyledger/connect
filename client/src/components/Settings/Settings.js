import React, { Component } from "react";
import UserProfileSettings from "../UserProfileSettings/UserProfileSettings";
import PreferencesSettings from "../PreferencesSettings/PreferencesSettings";
import SecuritySettings from "../SecuritySettings/SecuritySettings";
import APISettings from "../APISettings/APISettings";
import "./Settings.css";

class Settings extends Component {
  render() {
    return (
      <div className="Settings">
        <div className="card">
          <div className="card-body">
            {/* <ul className="nav nav-pills nav-fill" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-toggle="pill"
                  href="#user-profile"
                  role="tab"
                  aria-controls="user-profile"
                  aria-selected="true"
                >
                  User Profile
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="pill"
                  href="#preferences"
                  role="tab"
                  aria-controls="preferences"
                  aria-selected="true"
                >
                  Preferences
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="pill"
                  href="#security"
                  role="tab"
                  aria-controls="security"
                  aria-selected="true"
                >
                  Security
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="pill"
                  href="#api"
                  role="tab"
                  aria-controls="api"
                  aria-selected="true"
                >
                  API
                </a>
              </li>
            </ul> */}

            <div className="tab-content pt-5">
              <div
                className="tab-pane fade show active"
                id="user-profile"
                role="tabpanel"
                aria-labelledby="user-profile"
              >
                <div className="container">
                  <div className="row">
                    <div className="col-sm-8 offset-sm-2">
                      <UserProfileSettings />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade show"
                id="preferences"
                role="tabpanel"
                aria-labelledby="preferences"
              >
                <div className="container">
                  <div className="row">
                    <div className="col-sm-8 offset-sm-2">
                      <PreferencesSettings />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade show"
                id="security"
                role="tabpanel"
                aria-labelledby="security"
              >
                <div className="container">
                  <div className="row">
                    <div className="col-sm-8 offset-sm-2">
                      <SecuritySettings />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade show"
                id="api"
                role="tabpanel"
                aria-labelledby="api"
              >
                <div className="container">
                  <div className="row">
                    <div className="col-sm-8 offset-sm-2">
                      <APISettings />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
