import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Navigation = () => {
  return (
    <NavContainer>
      <StyledNavLink to='/projects'>Projekter</StyledNavLink>
      <StyledNavLink to='/smallprojects'>Opgaver</StyledNavLink>
      <StyledNavLink to='/register'>Stikordsregister</StyledNavLink>
      <StyledNavLink to='/faqs'>Faq</StyledNavLink>
      <StyledNavLink to='/examproject'>Eksamensprojektet</StyledNavLink>
      <StyledNavLink to='/exam'>Eksamen</StyledNavLink>
    </NavContainer>
  );
};

export default Navigation;

const NavContainer = styled.nav`
  display: flex;
  justify-content: center;
  gap: 25px;
  padding: 1rem;
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  margin: 20px 0;
`;

const StyledNavLink = styled(NavLink)`
  color: white;
  font-size: 20px;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    text-decoration: none;
  }

  &.active {
    font-weight: bold;
    border-bottom: 2px solid white;
  }
`;
