import React, { Component } from "react";
import Alert from "./Alert/Alert";

class AlertList extends Component {
  render() {
    let { alerts, children } = this.props;
    let renderAlerts = () => {
      return alerts.map(alert => {
        return (
          <Alert
            text={alert.text}
            style={alert.style}
            key={alert.id}
            id={alert.id}
            icon={alert.icon}
            onRemove={this.props.removeAlert}
          />
        );
      });
    };

    return (
      <div className="AlertList">
        {renderAlerts()}
        {children}
      </div>
    );
  }
}

export default AlertList;
