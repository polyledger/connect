import { combineReducers } from "redux";
import alerts from "./alerts";
import portfolio from "./portfolio";
import accounts from "./accounts";
import analytics from "./analytics";
import auth from "./auth";
import markets from "./markets";
import settings from "./settings";

const rootReducer = combineReducers({
  alerts,
  portfolio,
  accounts,
  analytics,
  auth,
  markets,
  settings
});

export default rootReducer;
