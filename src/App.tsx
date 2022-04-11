import HomePage from "./Components/homePage";
import NavBar from "./Components/NavBar/navBar";
import Footer from "./Components/Footer/footer";
import { Routes, Route, useLocation } from "react-router-dom";
import AddUsers from "./Components/AddUsers/addUsers";
import FormEditUser from "./Components/Forms/formEditUser";

function App() {
  const location = useLocation();
  return (
    <div>
      <NavBar />
      <Routes>
        <Route element={<HomePage />} path={"/"} />
        <Route element={<AddUsers />} path={"/add-user"} />
        <Route element={<FormEditUser />} path={"/edit-user"} />
      </Routes>
      {location.pathname === "/" ? <Footer /> : ""}
    </div>
  );
}

export default App;
