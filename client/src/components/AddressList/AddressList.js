import React, { Component } from "react";
import AddressListItem from "../AddressListItem/AddressListItem";

class AddressList extends Component {
  render() {
    return (
      <div className="AddressList">
        <div className="hr-divider my-3">
          <h3 className="hr-divider-content hr-divider-heading">Addresses</h3>
        </div>

        <ul className="list-group mb-3">
          <AddressListItem symbol="BTC" />
        </ul>
      </div>
    );
  }
}

export default AddressList;
