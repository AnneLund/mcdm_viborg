import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  isAllowed,
  redirectTo = "/login",
  children,
  user,
}) => {
  const location = useLocation();

  // Hvis ikke tilladt: redirect til login eller angivet redirectTo
  if (!isAllowed) {
    return <Navigate to={redirectTo} />;
  }

  // Hvis brugeren er 'host' og forsøger at tilgå admin guests-siden
  if (user?.role === "host" && location.pathname === "/admin/guests") {
    return <Navigate to='/admin/invitations' replace />;
  }

  return children;
};

export default ProtectedRoute;
