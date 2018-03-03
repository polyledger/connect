import "@polyledger/bootstrap";
import "@polyledger/bootstrap/css/index.css";
import React from "react";
import ReactDOM from "react-dom";
import RootContainer from "./components/RootContainer/RootContainer";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<RootContainer />, document.getElementById("root"));
registerServiceWorker();
