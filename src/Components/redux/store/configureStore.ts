import * as Redux from "redux";
import thunk from "redux-thunk";
import rootReducer from "../../redux/reducers";

/* redux-persist */
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
    key: "root",
    storage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore(): Redux.Store {
    return Redux.createStore(
        persistedReducer,
        Redux.applyMiddleware(thunk)
    );
}