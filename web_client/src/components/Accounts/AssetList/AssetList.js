import React, { Component } from "react";
import Toolbar from "../Toolbar/Toolbar";
import AssetListItem from "./AssetListItem/AssetListItem";

class AssetList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assets: this.props.assets
    };

    this.filterList = this.filterList.bind(this);
  }

  componentDidMount() {
    this.props.fetchAssets();
  }

  filterList(event) {
    let updatedList = this.props.assets;
    updatedList = updatedList.filter(asset => {
      return (
        asset.symbol.toLowerCase().search(event.target.value.toLowerCase()) !==
        -1
      );
    });
    this.setState({ assets: updatedList });
  }

  render() {
    let assets = [];
    this.state.assets.forEach((asset, index) => {
      assets.push(
        <AssetListItem
          id={asset.id}
          key={asset.id}
          symbol={asset.symbol}
          connectAddress={this.props.connectAddress}
        />
      );
    });

    return (
      <div className="AssetList">
        <Toolbar title="Connect an address" onChange={this.filterList} />
        <div className="alert alert-info" role="alert">
          <div className="row">
            <div className="col-1 d-flex justify-content-center align-items-center">
              <i className="fa fa-info-circle" />
            </div>
            <div className="col-10">
              Select an asset and enter your public address to connect your
              wallet.
            </div>
          </div>
        </div>
        <div className="row">{assets}</div>
      </div>
    );
  }
}

export default AssetList;
