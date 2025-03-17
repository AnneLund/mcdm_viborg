import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const NavContainer = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 15px;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    gap: 10px;
    padding: 10px;
  }

  @media (max-width: 500px) {
    flex-direction: column;
    text-align: center;
    padding: 10px 5px;
  }
`;

export const StyledNavLink = styled(NavLink)`
  font-size: 18px;
  font-weight: 500;
  color: white;
  background: #2c3e50;
  text-decoration: none;
  padding: 12px 18px;
  border-radius: 5px;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #4ca2af;
    transform: scale(1.05);
  }

  &.active {
    background: #346c74;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 10px 15px;
  }

  @media (max-width: 500px) {
    font-size: 14px;
    padding: 8px 12px;
    width: 100%;
    text-align: center;
  }
`;

// Hovednavigation (baggrund, skygge, border-radius)
export const MainNav = styled.nav`
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  position: relative;
`;

// Wrapper for navigationens indhold
export const MainNavWrapper = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

// Burger-menu ikon
export const MainBurgerMenu = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  z-index: 10;
  margin-left: auto;

  span {
    background: white;
    height: 4px;
    width: 30px;
    margin: 3px 0;
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
export const MainNavContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  transition: all 0.3s ease-in-out;
  border-radius: 0 0 10px 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    background: linear-gradient(135deg, #2c3e50, #4ca1af);
    position: absolute;
    top: 85%;
    left: 0;
    width: 100%;
    z-index: 200;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    padding: 10px 0;
    overflow: hidden;
    height: ${({ $menuOpen }) => ($menuOpen ? "auto" : "0")};
    opacity: ${({ $menuOpen }) => ($menuOpen ? "1" : "0")};
    visibility: ${({ $menuOpen }) => ($menuOpen ? "visible" : "hidden")};
  }
`;

// Links i navigationen
export const MainStyledNavLink = styled(NavLink)`
  color: white;
  font-size: 18px;
  font-weight: 500;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  text-align: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  &.active {
    font-weight: bold;
    text-decoration: underline 3px;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 12px 20px;
  }

  @media (max-width: 500px) {
    font-size: 14px;
    padding: 10px 15px;
  }
`;

// Dropdown container
export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// Dropdown-knap
export const DropdownToggle = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 12px 20px;
  }
`;

// Dropdown-indhold
export const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 5px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  min-width: 150px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 10px 0;

  a {
    color: black;
    padding: 10px;
    text-decoration: none;
    transition: background 0.3s ease-in-out;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
`;
