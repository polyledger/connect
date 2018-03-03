import React, { Component } from "react";
import "./SecuritySettings.css";

class SecuritySettings extends Component {
  render() {
    return (
      <div className="SecuritySettings">
        <form className="pt-4">
          <h5>Two-Factor Authentication</h5>
          <div className="form-group row">
            <div className="col-sm-12">
              <button type="submit" className="btn btn-primary">
                Enable 2FA
              </button>
            </div>
          </div>
        </form>
        <h5 className="pt-4">Confirmed Devices</h5>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Confirmed</th>
                <th scope="col">Browser</th>
                <th scope="col">IP Address</th>
                <th scope="col">Location</th>
                <th scope="col">Current</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2 months ago</td>
                <td>Chrome (Mac)</td>
                <td>129.210.115.7</td>
                <td>Palo Alto, USA</td>
                <td>
                  <i className="icon icon-check" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default SecuritySettings;
