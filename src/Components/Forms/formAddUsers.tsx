import { ChangeEvent, useEffect, useReducer, useState } from "react";
import {
  Grid,
  Button,
  Container,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { IDataUsers, IResponse } from "../../InterfaceGlobals/globalsInterface";
import Alert, { IAlert } from "../Alert/alert";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
//@ts-ignore
import noImage from "../../assets/Image/imageNo.jpg";

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

interface IProps {
  onEdit: boolean;
  valuesForm?: IDataUsers;
}

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

const useStyles = makeStyles({
  textField: {
    marginTop: "20px",
  },
  buttonUpload: {
    margin: "0 auto",
    marginTop: "10px",
  },
  image: {
    margin: "0 auto",
  },
});

const validationSchema = yup.object().shape({
  username: yup.string().required("username is required").min(3),
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  password: yup.string().required("Last Name is required"),
});

function FormAddUsers(props: IProps) {
  const navigate = useNavigate();
  const { valuesForm, onEdit } = props;
  const [imageSelected, setImageSelected] = useState<any>();
  const clasess = useStyles();
  const [preview, setPreview] = useState<any>();
  const [alertState, dispatch] = useReducer(reducerAlert, initialState);
  const formik = useFormik({
    initialValues: onEdit
      ? {
          username: valuesForm?.username || "",
          password: valuesForm?.password || "",
          firstName: valuesForm?.firstName || "",
          lastName: valuesForm?.lastName || "",
        }
      : {
          username: "",
          password: "",
          firstName: "",
          lastName: "",
        },
    validationSchema: validationSchema,
    onSubmit: (values: IValuesForm) => {
      handleSubmitForm(values);
    },
  });
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

  const handleSubmitForm = (values: IValuesForm) => {
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
    } else if (valuesForm) {
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

  return (
    <>
      <Container>
        <form
          onSubmit={formik.handleSubmit}
          style={{ height: "70vh", display: "flex", alignItems: "center" }}>
          <Grid container direction='row' spacing={2} justifyContent='center'>
            <Grid item xs={6}>
              <TextField
                fullWidth
                className={clasess.textField}
                id='username'
                label='Username*'
                name='username'
                variant='outlined'
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
              <TextField
                fullWidth
                className={clasess.textField}
                id='firstName'
                label='First Name*'
                name='firstName'
                variant='outlined'
                value={formik?.values?.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />

              <TextField
                fullWidth
                className={clasess.textField}
                id='lastName'
                label='Last Name*'
                name='lastName'
                variant='outlined'
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
              <TextField
                fullWidth
                className={clasess.textField}
                id='password'
                label='Password*'
                name='password'
                type='password'
                variant='outlined'
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}>
              <img
                src={preview || noImage}
                width={200}
                height={200}
                alt=''
                className={clasess.image}
              />
              <div className={clasess.buttonUpload}>
                <input
                  accept='image/*'
                  id='contained-button-file'
                  type='file'
                  onChange={handleChangeFile}
                  style={{ display: "none" }}
                />
                <label htmlFor='contained-button-file'>
                  <Button variant='outlined' component='span'>
                    Upload image
                  </Button>
                </label>
                <Button
                  variant='contained'
                  onClick={handleRemoveImage}
                  sx={{ ml: 3 }}>
                  Remove
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button type='submit' disabled={loading} variant='outlined'>
                {loading || loading2 ? (
                  <Box display='flex'>
                    <CircularProgress color='success' size={35} />
                  </Box>
                ) : (
                  "Save"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      <Alert
        open={alertState.open}
        message={alertState.message}
        severty={alertState.severty}
        onClose={handleCloseAlert}
      />
    </>
  );
}

export default FormAddUsers;
