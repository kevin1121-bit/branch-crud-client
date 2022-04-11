import { useReducer } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import clsx from "clsx";
import { Box, Button, Grid, Typography } from "@mui/material";
import Modal from "../Modals/modal";
import { useSelector } from "react-redux";
import { IInitialState } from "../../Redux/store";
import { useMutation, gql } from "@apollo/client";
import { IResponse } from "../../InterfaceGlobals/globalsInterface";
import Alert, { IAlert } from "../Alert/alert";
import _ from "lodash";
import { Link } from "react-router-dom";

const REMOVE_USER = gql`
  mutation RemovePerson($input: RemovePersonInput!) {
    removePerson(input: $input) {
      status
      message
    }
  }
`;

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: "22px 55px 22px 55px",
      bottom: 0,
      backgroundColor: "#0C4D27",
    },
    button: {
      color: "white",
      marginRight: "35px",
    },
    fixed: {
      position: "fixed",
    },
  })
);

const initialStateModal = {
  title: "",
  content: <></>,
  open: false,
};

type ActionType = {
  type: "OPEN_MODAL_CLOSE_MODAL";
  payload: { title: string; content: JSX.Element; open: boolean };
};

const reducerModal = (state: typeof initialStateModal, action: ActionType) => {
  if (action.type === "OPEN_MODAL_CLOSE_MODAL") {
    return {
      ...state,
      content: action.payload.content,
      open: action.payload.open,
      title: action.payload.title,
    };
  }
  return state;
};

interface IRemovePersonInput {
  username: string;
}

const initialStateAlert: IAlert = {
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
function Footer() {
  const classes = useStyles();
  const selectUser = useSelector((state: IInitialState) => state.user);

  const [alertState, dispatchAlert] = useReducer(
    reducerAlert,
    initialStateAlert
  );
  const [modalInfo, dispatchModal] = useReducer(
    reducerModal,
    initialStateModal
  );
  const [userRemove, { loading, reset }] = useMutation<
    { removePerson: IResponse },
    { input: IRemovePersonInput }
  >(REMOVE_USER);

  const handleCloseModal = () => {
    dispatchModal({
      type: "OPEN_MODAL_CLOSE_MODAL",
      payload: {
        title: "",
        content: <></>,
        open: false,
      },
    });
  };

  const handleCloseAlert = () => {
    dispatchAlert({
      type: "CHANGE_ALERT",
      payload: { open: false, message: "", severty: undefined },
    });
  };

  const handleRemovePerson = () => {
    dispatchModal({
      type: "OPEN_MODAL_CLOSE_MODAL",
      payload: {
        open: true,
        content: (
          <Box display='flex' justifyContent='center' flexDirection='column'>
            <Typography>
              Esta seguro que quiere borrar el usuario{" "}
              <b>{selectUser.username.toLocaleUpperCase()}</b>
            </Typography>
            <Box margin='0 auto'>
              <Button onClick={handleRemoveAccepted}>SI</Button>
              <Button onClick={handleCloseModal}>No</Button>
            </Box>
          </Box>
        ),
        title: "Advertencia",
      },
    });
  };

  const handleRemoveAccepted = () => {
    handleCloseModal();
    if (selectUser.username) {
      const input = { username: selectUser.username };
      userRemove({ variables: { input: input } })
        .then((response) => {
          if (response.data?.removePerson.status) {
            dispatchAlert({
              type: "CHANGE_ALERT",
              payload: {
                open: true,
                message: "It was deleted correctly",
                severty: "success",
              },
            });
            reset();
          } else {
            dispatchAlert({
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
          dispatchAlert({
            type: "CHANGE_ALERT",
            payload: {
              open: true,
              message: err.message,
              severty: "error",
            },
          });
          reset();
        });
    }
  };

  return (
    <>
      <Grid
        container
        direction='row'
        className={clsx(classes.root, classes.fixed)}
        alignItems='flex-end'>
        <Grid item xs={12} md={7}>
          <Box display='flex' flexDirection={"row"}>
            <Link to={"/edit-user"} style={{ textDecoration: "none" }}>
              <Button
                variant='outlined'
                className={classes.button}
                size='small'
                disabled={
                  loading || _.isEmpty(selectUser.username) ? true : false
                }>
                Edit
              </Button>
            </Link>
            <Button
              variant='outlined'
              className={classes.button}
              size='small'
              onClick={handleRemovePerson}
              disabled={
                loading || _.isEmpty(selectUser.username) ? true : false
              }>
              Remove
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Modal
        title={modalInfo.title}
        content={modalInfo.content}
        open={modalInfo.open}
        close={handleCloseModal}
      />
      <Alert
        message={alertState.message}
        open={alertState.open}
        severty={alertState.severty}
        onClose={handleCloseAlert}
      />
    </>
  );
}
export default Footer;
