import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IAlert } from "../Components/Alert/alert";
import { IResponse } from "../InterfaceGlobals/globalsInterface";


const CREATE_USER = gql`
  mutation CreateUser($input: SavePersonInput!) {
    createUser(input: $input) {
      status
      message
    }
  }
`;

const MODIFIED_USER = gql`
  mutation ModifiedUser($input: ModifiedUserInput!) {
    modifiedUser(input: $input) {
      status
      message
    }
  }
`;

interface IValuesForm {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  image?: any;
}

const initialState: IAlert = {
  open: false,
  message: "",
  severty: undefined,
};

type IActionType = {
  type: "CHANGE_ALERT";
  payload: IAlert;
};


const reducerAlert = (state: IAlert, action: IActionType) => {
  if (action.type === "CHANGE_ALERT") {
    return {
      ...state,
      open: action.payload.open,
      message: action.payload.message,
      severty: action.payload.severty,
    };
  } else {
    return state;
  }
};


export default function useAddUser() {
    const [alertState, dispatch] = useReducer(reducerAlert, initialState);
     const navigate = useNavigate();
     const [imageSelected, setImageSelected] = useState<any>();
      const [preview, setPreview] = useState<any>();


      const [userCreate, { reset, loading }] = useMutation<
    { createUser: IResponse },
    {
      input: IValuesForm;
    }
  >(CREATE_USER);

  const [userModified, { reset: reset2, loading: loading2 }] = useMutation<
    { modifiedUser: IResponse },
    { input: IValuesForm }
  >(MODIFIED_USER);



  
  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setImageSelected("");
      return;
    }
    setImageSelected(event.target.files[0]);
  };

  useEffect(() => {
    let objUrl: any;
    if (!imageSelected) {
      setPreview(undefined);
      URL.revokeObjectURL(objUrl);
      return;
    }

    objUrl = URL.createObjectURL(imageSelected);
    setPreview(objUrl);

    return () => URL.revokeObjectURL(objUrl);
  }, [imageSelected]);

  const handleRemoveImage = () => {
    setImageSelected("");
  };


 const handleSubmitForm = (values: IValuesForm, onEdit:boolean) => {
    if (!onEdit) {
      const input: IValuesForm = {
        ...values,
        image: imageSelected,
      };
      userCreate({ variables: { input: input } })
        .then((res) => {
          if (res.data?.createUser.status) {
            dispatch({
              type: "CHANGE_ALERT",
              payload: {
                open: true,
                message: "User added successfully",
                severty: "success",
              },
            });
            setTimeout(() => {
              navigate("/");
            }, 2000);
          } else if (res.data?.createUser) {
            dispatch({
              type: "CHANGE_ALERT",
              payload: {
                open: true,
                message: res.data?.createUser.message,
                severty: "error",
              },
            });
            reset();
          } else {
            dispatch({
              type: "CHANGE_ALERT",
              payload: {
                open: true,
                message: "Error, try again later",
                severty: "error",
              },
            });
            reset();
          }
        })
        .catch((err) => {
          console.log(err.message);
          dispatch({
            type: "CHANGE_ALERT",
            payload: {
              open: true,
              message: "Error, try again later",
              severty: "error",
            },
          });
          reset();
        });
    } else if (values) {
      const input: any = {
        ...values,
      };
      userModified({ variables: { input: input } })
        .then((response) => {
          if (response.data?.modifiedUser.status) {
            dispatch({
              type: "CHANGE_ALERT",
              payload: {
                open: true,
                message: "user modified successfully",
                severty: "success",
              },
            });
          } else if (response.data?.modifiedUser) {
            dispatch({
              type: "CHANGE_ALERT",
              payload: {
                open: true,
                message: response.data?.modifiedUser.message,
                severty: "error",
              },
            });
            reset2();
          } else {
            dispatch({
              type: "CHANGE_ALERT",
              payload: {
                open: true,
                message: "Error, try again later",
                severty: "error",
              },
            });
            reset2();
          }
        })
        .catch(() => {
          dispatch({
            type: "CHANGE_ALERT",
            payload: {
              open: true,
              message: "Error, try again later",
              severty: "error",
            },
          });
          reset2();
        });
    }
  };

const handleCloseAlert = () => {
    dispatch({
      type: "CHANGE_ALERT",
      payload: { open: false, message: "", severty: undefined },
    });
  };



return {
    handleSubmitForm,
    loading,
    loading2,
    handleCloseAlert,
    preview,
    handleChangeFile,
    handleRemoveImage,
    alertState,
}
}