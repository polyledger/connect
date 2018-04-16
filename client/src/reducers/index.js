import { combineReducers } from "redux";
import alerts from "./alerts";
import portfolio from "./portfolio";
import accounts from "./accounts";
import analytics from "./analytics";
import user from "./user";
import markets from "./markets";
import settings from "./settings";

const rootReducer = combineReducers({
  alerts,
  portfolio,
  accounts,
  analytics,
  user,
  markets,
  settings
});

export default rootReducer;
