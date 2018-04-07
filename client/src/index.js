import "babel-polyfill";
import "@polyledger/bootstrap";
import "@polyledger/bootstrap/css/index.css";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/Root/Root";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();
