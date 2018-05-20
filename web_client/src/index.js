import "babel-polyfill";
import "@polyledger/bootstrap";
import "@polyledger/bootstrap/css/dark.min.css";
import "font-awesome/css/font-awesome.min.css";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/Root/Root";

ReactDOM.render(<Root />, document.getElementById("root"));
