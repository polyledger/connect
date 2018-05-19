import React, { Component } from "react";
import PositionRow from "../PositionRow/PositionRow";
import "./PositionTable.css";

class PositionTable extends Component {
  componentDidMount() {
    this.props.fetchPositions();
  }

  render() {
    let positions = [];
    Array.from(this.props.positions).forEach((position, index) => {
      positions.push(
        <PositionRow
          key={position.id}
          coin={position.asset.name}
          symbol={position.asset.symbol}
          quantity={position.asset.size}
          price={position.asset.price}
          marketValue={position.asset.market_value}
        />
      );
    });
    return (
      <div className="PositionTable">
        <div className="card table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">Coin</th>
                <th scope="col">Quantity</th>
                <th scope="col" className="text-right">
                  Price
                </th>
                <th scope="col" className="text-right">
                  Market Value
                </th>
              </tr>
            </thead>
            <tbody>{positions}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default PositionTable;
