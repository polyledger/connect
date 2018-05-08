import React, { Component } from "react";
import AssetListModalItem from "../AssetListModalItem/AssetListModalItem";

class AssetListModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assets: this.props.assets
    };
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
        <AssetListModalItem
          id={asset.id}
          key={asset.id}
          symbol={asset.symbol}
          connectAddress={this.props.connectAddress}
        />
      );
    });

    return (
      <div
        className="AssetListModal modal fade"
        id="assetModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="assetModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="assetModalLabel">
                Connect a cryptoasset address
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="container">
                <div className="alert alert-info" role="alert">
                  <div className="row">
                    <div className="col-1 d-flex justify-content-center align-items-center">
                      <i className="fa fa-info-circle" />
                    </div>
                    <div className="col-10">
                      Select an asset and enter your public address to connect
                      your wallet.
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <form>
                      <div className="input-group mb-2">
                        <input
                          className="form-control"
                          type="search"
                          placeholder="Search by symbol"
                          aria-label="Search"
                          onChange={event => this.filterList(event)}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <i
                              className="fa fa-search"
                              style={{ color: "#FFFFFF" }}
                            />
                          </span>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="row">{assets}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AssetListModal;
