import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Navigation = () => {
  return (
    <NavContainer>
      <NavLink to='/projects'>Opgaver</NavLink>
      <NavLink to='/register'>Stikordsregister</NavLink>
    </NavContainer>
  );
};

export default Navigation;

const NavContainer = styled.nav`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 1rem;
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

  a {
    color: white;

    &:hover {
      text-decoration: underline;
    }
  }
`;
