import { NavLink } from "react-router-dom";
import styled from "styled-components";

const AdminNavigation = () => {
  return (
    <NavContainer>
      <StyledNavLink to='/backoffice/users'>Brugere</StyledNavLink>
    </NavContainer>
  );
};

export default AdminNavigation;

// ----------- STYLED COMPONENTS -----------

// Navigation container (grid for desktop, dropdown for mobile)
const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;
  width: 100%;
  transition: all 0.3s ease-in-out;
  border-radius: 0 0 10px 10px;
`;

const StyledNavLink = styled(NavLink)`
  font-size: 18px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease-in-out;

  &.active {
    font-weight: bold;
    /* border-bottom: 2px solid white; */
    text-decoration: underline 3px;
  }

  @media (max-width: 768px) {
    padding: 15px;
    display: block;
  }
`;
