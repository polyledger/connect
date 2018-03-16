import { combineReducers } from "redux";
import portfolio from "./portfolio";
import accounts from "./accounts";
import analytics from "./analytics";
import auth from "./auth";
import markets from "./markets";
import settings from "./settings";

const rootReducer = combineReducers({
  portfolio,
  accounts,
  analytics,
  auth,
  markets,
  settings
});

export default rootReducer;
