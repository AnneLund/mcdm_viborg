import { useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <Nav>
      <NavWrapper>
        <BurgerMenu onClick={toggleMenu} $menuOpen={menuOpen}>
          <span />
          <span />
          <span />
        </BurgerMenu>

        <NavContainer $menuOpen={menuOpen}>
          <StyledNavLink to='/projects' onClick={closeMenu}>
            Projekter
          </StyledNavLink>
          <StyledNavLink to='/smallprojects' onClick={closeMenu}>
            Opgaver
          </StyledNavLink>
          <StyledNavLink to='/register' onClick={closeMenu}>
            Stikordsregister
          </StyledNavLink>
          <StyledNavLink to='/faqs' onClick={closeMenu}>
            FAQ
          </StyledNavLink>
          <StyledNavLink to='/examproject' onClick={closeMenu}>
            Eksamensprojektet
          </StyledNavLink>
          <StyledNavLink to='/exam' onClick={closeMenu}>
            Eksamen
          </StyledNavLink>
          <StyledNavLink to='/dates' onClick={closeMenu}>
            Vigtige datoer
          </StyledNavLink>
        </NavContainer>
      </NavWrapper>
    </Nav>
  );
};

export default Navigation;

// ----------- STYLED COMPONENTS -----------

const Nav = styled.nav`
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  margin: 20px 0;
  width: 100%;
`;

const NavWrapper = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

// Burger-menu ikon
const BurgerMenu = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  z-index: 10;

  span {
    background: white;
    height: 4px;
    width: 30px;
    margin: 5px 0;
    border-radius: 3px;
    transition: all 0.3s ease;
  }

  /* Menu-animation */
  ${({ $menuOpen }) =>
    $menuOpen &&
    `
    span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  `}

  @media (max-width: 768px) {
    display: flex;
  }
`;

// Navigation container (grid for desktop, dropdown for mobile)
const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;
  width: 100%;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    flex-direction: column;
    background: linear-gradient(135deg, #2c3e50, #4ca1af);
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    padding: 10px 0;
    overflow: hidden;

    /* ✅ Bruger transiente props ($menuOpen), så det ikke sendes til DOM */
    height: ${({ $menuOpen }) => ($menuOpen ? "auto" : "0")};
    opacity: ${({ $menuOpen }) => ($menuOpen ? "1" : "0")};
    visibility: ${({ $menuOpen }) => ($menuOpen ? "visible" : "hidden")};
  }
`;

const StyledNavLink = styled(NavLink)`
  color: white;
  font-size: 18px;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    text-decoration: none;
  }

  &.active {
    font-weight: bold;
    border-bottom: 2px solid white;
  }

  @media (max-width: 768px) {
    padding: 15px;
    display: block;
  }
`;
