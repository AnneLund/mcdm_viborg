import { Outlet, useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const isBackoffice = location.pathname.startsWith("/backoffice");

  return <>{!isBackoffice && <Outlet />}</>;
};

export default Home;
