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

const NavContainer = styled.nav`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px;
  padding: 12px 20px;

  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const StyledNavLink = styled(NavLink)`
  font-size: 18px;
  font-weight: 500;
  color: white;
  background-color: linear-gradient(to right, #2c3e50, #4ca2af);
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: linear-gradient(to right, #2c3e50, #4ca2af);
  }

  &.active {
    background-color: #346c74;
    font-weight: bold;
    text-decoration: none;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 8px 12px;
  }
`;
