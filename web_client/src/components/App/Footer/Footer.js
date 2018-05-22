import React, { Component } from "react";
import "../Footer/Footer.css";

class Footer extends Component {
  render() {
    return (
      <div className="Footer py-4 mt-3">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h6 className="my-4 text-uppercase">Disclaimer</h6>
              <small className="text-muted">
                <p>
                  Investing in cryptocurrencies involves huge risk, including
                  the possible loss of money you invest, and past performance
                  does not guarantee future performance. Historical returns,
                  expected returns, and probability projections are provided for
                  informational and illustrative purposes, and may not reflect
                  actual future performance.
                </p>
                <p>© Copyright 2018 Polyledger</p>
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
