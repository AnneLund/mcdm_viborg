import { Outlet } from "react-router-dom";
import AdminNavigation from "../components/AdminNavigation";
import { BackofficeContainer } from "../styles/containerStyles";

const Backoffice = () => {
  return (
    <BackofficeContainer>
      <h2>Backoffice</h2>
      <AdminNavigation />
      <Outlet />
    </BackofficeContainer>
  );
};

export default Backoffice;
