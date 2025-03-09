import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import {
  MainBurgerMenu,
  MainNav,
  MainNavContainer,
  MainNavWrapper,
  MainStyledNavLink,
} from "../styles/navigationStyles";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuthContext();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <MainNav>
      <MainNavWrapper>
        <MainBurgerMenu onClick={toggleMenu} $menuOpen={menuOpen}>
          <span />
          <span />
          <span />
        </MainBurgerMenu>

        <MainNavContainer $menuOpen={menuOpen}>
          <MainStyledNavLink to='/projects' onClick={closeMenu}>
            Projekter
          </MainStyledNavLink>
          <MainStyledNavLink to='/exercises' onClick={closeMenu}>
            Opgaver
          </MainStyledNavLink>
          <MainStyledNavLink to='/register' onClick={closeMenu}>
            Stikordsregister
          </MainStyledNavLink>
          <MainStyledNavLink to='/faqs' onClick={closeMenu}>
            FAQ
          </MainStyledNavLink>
          <MainStyledNavLink to='/examproject' onClick={closeMenu}>
            Eksamensprojektet
          </MainStyledNavLink>
          <MainStyledNavLink to='/exam' onClick={closeMenu}>
            Eksamen
          </MainStyledNavLink>
          <MainStyledNavLink to='/events' onClick={closeMenu}>
            Vigtige datoer
          </MainStyledNavLink>
          {user.role === "admin" && (
            <MainStyledNavLink to='/backoffice' onClick={closeMenu}>
              Backoffice
            </MainStyledNavLink>
          )}
        </MainNavContainer>
      </MainNavWrapper>
    </MainNav>
  );
};

export default Navigation;
