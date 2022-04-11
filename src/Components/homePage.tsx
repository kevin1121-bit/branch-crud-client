import {
  DataGrid,
  GridColDef,
  GridOverlay,
  GridSelectionModel,
} from "@mui/x-data-grid";
import {
  Avatar,
  Button,
  Container,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useQuery, gql } from "@apollo/client";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../Redux/actions";
import { GridRowId } from "@material-ui/data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { IDataUsers } from "../InterfaceGlobals/globalsInterface";
import _ from "lodash";

const GET_PERSON = gql`
  query GetPerson {
    getPerson {
      username
      firstName
      lastName
      image
      password
    }
  }
`;

const columns: GridColDef[] = [
  {
    field: "imagenView",
    headerName: "profile",
    width: 100,
    renderCell: (params) => <Avatar src={params.value} alt='profile' />,
  },
  {
    field: "username",
    headerName: "Username",
    width: 140,
  },
  {
    field: "firstName",
    headerName: "First Name",
    width: 140,
  },
  {
    field: "lastName",
    headerName: "Last Name",
    width: 140,
  },
];

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

interface IGetDataPerson {
  getPerson: IDataUsers[];
}

function HomePage() {
  const { data, loading, refetch } = useQuery<IGetDataPerson>(GET_PERSON, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });
  const [dataRowPerson, setDataRowPerson] = useState<IDataUsers[]>([]);
  const [dataPerson, setDataPerson] = useState<IDataUsers[]>([]);
  const dispatch = useDispatch();
  const [dataSearch, setDataSearch] = useState<IDataUsers[]>([]);
  const onAddUser = useCallback(
    (payload: IDataUsers) => dispatch(addUser(payload)),
    [dispatch]
  );
  useEffect(() => {
    if (!loading) {
      if (data?.getPerson) {
        setDataPerson(data.getPerson);
      }
    }
  }, [data, loading]);

  useEffect(() => {
    if (dataPerson.length !== 0) {
      let objRow: IDataUsers;
      const arrayRow: IDataUsers[] = [];
      dataPerson.forEach((element: IDataUsers) => {
        objRow = {
          imagenView: `${process.env.REACT_APP_KEY_URL_BACKEND}/imageProfile/${element.image}`,
          ...element,
        };
        arrayRow.push(objRow);
      });
      setDataRowPerson(arrayRow);
      setDataSearch(arrayRow);
    }
  }, [dataPerson]);

  const handleChangeIdPerson = (username: GridRowId) => {
    if (username) {
      const dataArray = dataPerson.filter(
        (value: IDataUsers) => value.username === username.toString()
      );
      onAddUser(dataArray[0]);
    }
  };

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const arrayTemp = [...dataSearch];
    const arraySearch = arrayTemp.filter((value: IDataUsers) =>
      value.username.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setDataRowPerson(arraySearch);
  };

  return (
    <Container maxWidth={"xl"}>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <TextField
          id='outlined-basic'
          label='Search by username'
          variant='outlined'
          size='small'
          onChange={handleChangeSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button onClick={() => refetch()} variant='outlined'>
          Update
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ height: "65.9vh", my: 1 }}>
        <DataGrid
          rows={dataRowPerson}
          columns={columns}
          autoPageSize={true}
          getRowId={(row) => row.username}
          onSelectionModelChange={(selectionModel: GridSelectionModel) =>
            selectionModel && handleChangeIdPerson(selectionModel[0])
          }
          components={{
            LoadingOverlay: CustomLoadingOverlay,
          }}
          loading={loading}
        />
      </Grid>
    </Container>
  );
}

export default HomePage;
