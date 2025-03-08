import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useAuthContext } from "../context/useAuthContext";
import BackArrow from "../components/button/BackArrow";
import { useMemo } from "react";
import UserProfile from "../components/UserProfile";

const Home = () => {
  const { user, signOut } = useAuthContext();
  const location = useLocation();
  const isBackoffice = location.pathname.startsWith("/backoffice");
  const showBackArrow = useMemo(
    () => location.pathname !== "/",
    [location.pathname]
  );

  return (
    <>
      <Navigation />
      <UserProfile signOut={signOut} user={user} />

      {showBackArrow && <BackArrow />}
      {!isBackoffice && <Outlet />}
    </>
  );
};

export default Home;
