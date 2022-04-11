import { IDataUsers } from "../InterfaceGlobals/globalsInterface";

const addUser = (payload: IDataUsers) => {
  return {
    type: "ADD_USER",
    payload: payload,
  };
};

export { addUser };
