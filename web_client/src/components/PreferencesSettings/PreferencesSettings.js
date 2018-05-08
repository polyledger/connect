import React, { Component } from "react";
import "./PreferencesSettings.css";

class PreferencesSettings extends Component {
  render() {
    return (
      <div className="PreferencesSettings">
        <form>
          <h5>General</h5>
          <div className="form-group row">
            <label htmlFor="localCurrency" className="col-sm-2 col-form-label">
              Local Currency
            </label>
            <div className="col-sm-10">
              <select className="form-control" id="localCurency">
                <option>United States Dollar (USD)</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="timeZone" className="col-sm-2 col-form-label">
              Time Zone
            </label>
            <div className="col-sm-10">
              <select className="form-control" id="timeZone">
                <option>(GMT-08:00) Pacific Time (US & Canada)</option>
              </select>
            </div>
          </div>
        </form>
        <form className="pt-4">
          <h5>Email Notifications</h5>
          <fieldset className="form-group">
            <div className="row">
              <legend className="col-form-label col-sm-3 pt-0">
                <span>Portfolio Summary</span>
                <br />
                <small className="text-muted">
                  Receive periodic email reports about your portfolio
                </small>
              </legend>
              <div className="col-sm-9">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gridRadios"
                    id="gridRadios1"
                    value="daily"
                  />
                  <label className="form-check-label" htmlFor="gridRadios1">
                    Daily
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gridRadios"
                    id="gridRadios2"
                    value="weekly"
                  />
                  <label className="form-check-label" htmlFor="gridRadios2">
                    Weekly
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gridRadios"
                    id="gridRadios3"
                    value="monthly"
                  />
                  <label className="form-check-label" htmlFor="gridRadios3">
                    Monthly
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gridRadios"
                    id="gridRadios4"
                    value="quarterly"
                  />
                  <label className="form-check-label" htmlFor="gridRadios3">
                    Quarterly
                  </label>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default PreferencesSettings;
