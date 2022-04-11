import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();

  return (
    <>
      <AppBar
        position='relative'
        sx={{ backgroundColor: "#0C4D27", zIndex: 1000 }}>
        <Container maxWidth='xl'>
          <Toolbar>
            <Box>
              {location.pathname === "/" ? (
                <Typography>ALL USERS</Typography>
              ) : location.pathname === "/add-user" ? (
                <Typography>ADD USERS</Typography>
              ) : (
                <Typography variant='h4'>EDIT USER</Typography>
              )}
            </Box>
            <Box sx={{ flexGrow: 1 }} display='flex' justifyContent='end'>
              {location.pathname === "/" ? (
                <Tooltip title='Add users'>
                  <Link to={"/add-user"} style={{ textDecoration: "none" }}>
                    <Button variant='outlined' sx={{ color: "#fff" }}>
                      ADD USERS
                    </Button>
                  </Link>
                </Tooltip>
              ) : (
                <Tooltip title='Back'>
                  <Link to={"/"} style={{ textDecoration: "none" }}>
                    <Button variant='outlined' sx={{ color: "#fff" }}>
                      Home
                    </Button>
                  </Link>
                </Tooltip>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
export default NavBar;
