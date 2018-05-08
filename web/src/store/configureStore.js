import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "../reducers";
import storage from "redux-persist/lib/storage";

const loggerMiddleware = createLogger();
const persistConfig = {
  key: "root",
  storage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore(preloadedState) {
  const store = createStore(
    persistedReducer,
    preloadedState,
    applyMiddleware(thunkMiddleware, loggerMiddleware)
  );
  const persistor = persistStore(store);
  return { store, persistor };
}
