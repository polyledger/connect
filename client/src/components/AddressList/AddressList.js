import React, { Component } from 'react';
import AddressListItem from '../AddressListItem/AddressListItem';

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

        <div className="d-flex flex-row-reverse">
          <button className="btn btn-primary">
            <i className="icon icon-squared-plus" /> Link Address
          </button>
        </div>
      </div>
    );
  }
}

export default AddressList;
