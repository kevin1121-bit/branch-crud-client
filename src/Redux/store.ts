import { applyMiddleware, createStore, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { IDataUsers } from "../InterfaceGlobals/globalsInterface";

export interface IInitialState {
  user: IDataUsers;
}

export const initialState: IInitialState = {
  user: {
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    image: "",
  },
};

type ActionType = { type: "ADD_USER"; payload: any };

export const reducer: any = (state = initialState, action: ActionType) => {
  if (action.type === "ADD_USER") {
    return { ...state, user: action.payload };
  }
  return state;
};

const middlewareEnhancer = applyMiddleware(thunkMiddleware);
const composedEnhancers = compose(middlewareEnhancer);

export const store = createStore(reducer, composedEnhancers);
