import React, { Component } from "react";
import $ from "jquery";
import Toolbar from "../Toolbar/Toolbar";
import ConnectionModal from "../ConnectionModal/ConnectionModal";
import AssetListItem from "./AssetListItem/AssetListItem";

class AssetList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assets: this.props.assets,
      selected: null
    };

    this.filterList = this.filterList.bind(this);
    this.onClick = this.onClick.bind(this);
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

  onClick(asset) {
    this.setState({ selected: asset });
    $(".modal").modal("show");
  }

  render() {
    let assets = [];
    this.state.assets.forEach((asset, index) => {
      assets.push(
        <AssetListItem
          id={asset.id}
          key={asset.id}
          name={asset.name}
          symbol={asset.symbol}
          onClick={this.onClick}
          connectAddress={this.props.connectAddress}
        />
      );
    });

    return (
      <div className="AssetList">
        <Toolbar title="Connect an address" onChange={this.filterList} />
        <div className="row">{assets}</div>
        <ConnectionModal
          title="Connect an address"
          asset={this.state.selected}
          connectAddress={this.props.connectAddress}
        />
      </div>
    );
  }
}

export default AssetList;
