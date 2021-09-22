import { combineReducers } from "redux";
import drivers from "./drivers/reducer";
import allDriversReports from "./reports/allDrivers/reducer";

const allReducers = combineReducers({
  drivers,
  allDriversReports,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STATE') {
    localStorage.clear()
    state = undefined;
  }

  return allReducers(state, action);
};

export default rootReducer;