import { NavContainer, StyledNavLink } from "../styles/navigationStyles";

const AdminNavigation = () => {
  return (
    <NavContainer>
      <StyledNavLink to='/backoffice/users'>Brugere</StyledNavLink>
      <StyledNavLink to='/backoffice/teams'>Hold</StyledNavLink>
    </NavContainer>
  );
};

export default AdminNavigation;
