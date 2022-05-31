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
import { IDataUsers } from "../../InterfaceGlobals/globalsInterface";
import Alert from "../Alert/alert";
import { makeStyles } from "@mui/styles";
//@ts-ignore
import noImage from "../../assets/Image/imageNo.jpg";
import useAddUser from "../../hooks/useAddUser";



interface IValuesForm {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  image?: any;
}

interface IProps {
  onEdit: boolean;
  valuesForm?: IDataUsers;
}


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
  const { valuesForm, onEdit } = props;
  const clasess = useStyles();


  const addUser = useAddUser();
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
      addUser.handleSubmitForm(values, onEdit);
    },
  });



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
                src={addUser.preview || noImage}
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
                  onChange={addUser.handleChangeFile}
                  style={{ display: "none" }}
                />
                <label htmlFor='contained-button-file'>
                  <Button variant='outlined' component='span'>
                    Upload image
                  </Button>
                </label>
                <Button
                  variant='contained'
                  onClick={addUser.handleRemoveImage}
                  sx={{ ml: 3 }}>
                  Remove
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button type='submit' disabled={addUser.loading} variant='outlined'>
                {addUser.loading || addUser.loading2 ? (
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
        open={addUser.alertState.open}
        message={addUser.alertState.message}
        severty={addUser.alertState.severty}
        onClose={addUser.handleCloseAlert}
      />
    </>
  );
}

export default FormAddUsers;
