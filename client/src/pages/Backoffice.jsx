import { Outlet } from "react-router-dom";
import AdminNavigation from "../components/AdminNavigation";

const Backoffice = () => {
  return (
    <article className='backoffice'>
      <h2>Backoffice</h2>
      <AdminNavigation />
      <Outlet />
    </article>
  );
};

export default Backoffice;
