import { Outlet } from "react-router-dom";
import AdminNavigation from "../components/AdminNavigation";
import { Article } from "../styles/containerStyles";

const Backoffice = () => {
  return (
    <Article>
      <h2>Backoffice</h2>
      <AdminNavigation />
      <Outlet />
    </Article>
  );
};

export default Backoffice;
