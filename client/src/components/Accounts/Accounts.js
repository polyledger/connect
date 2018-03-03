import React, { Component } from 'react';
import ExchangeList from '../ExchangeList/ExchangeList';
import AddressList from '../AddressList/AddressList';

class Accounts extends Component {
  render() {
    return (
      <div className="Accounts">
        <ExchangeList />
        <AddressList />
      </div>
    );
  }
}

export default Accounts;
