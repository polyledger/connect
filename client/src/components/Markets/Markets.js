import React, { Component } from 'react';
import PriceTable from '../PriceTable/PriceTable';
import './Markets.css';

class Markets extends Component {
  render() {
    return (
      <div className="Markets">
        <PriceTable />
      </div>
    );
  }
}

export default Markets;
