import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Pile-ikoner
import { ButtonContainer } from "../styles/buttonStyles";
import ActionButton from "./button/ActionButton";

const UserProfile = ({ user, signOut }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768); // Altid åben på desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      setIsOpen(!mobileView); // Åben på desktop, lukket på mobil
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ProfileWrapper $isMobile={isMobile}>
      {isMobile && ( // Kun vis pilen på mobil
        <ProfileToggle onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaChevronRight /> : <FaChevronLeft />}
        </ProfileToggle>
      )}

      <DropdownMenu $isOpen={isOpen} $isMobile={isMobile}>
        <p>Logget ind som:</p>
        <Link
          to={
            user.role === "student"
              ? `/studentpanel/${user._id}`
              : `/teacherpanel/${user._id}`
          }>
          <h4>{user?.name}</h4>
        </Link>

        <ButtonContainer>
          {user.role === "student" && (
            <ActionButton
              buttonText='Skift kode'
              background='blue'
              onClick={() => navigate("/change-password")}
            />
          )}
          <ActionButton
            buttonText='Log ud'
            background='red'
            onClick={signOut}
          />
        </ButtonContainer>
      </DropdownMenu>
    </ProfileWrapper>
  );
};

export default UserProfile;

const ProfileWrapper = styled.div`
  position: fixed;
  right: ${({ $isMobile }) => ($isMobile ? "50px" : "10px")};
  bottom: ${({ $isMobile }) => ($isMobile ? "22%" : "auto")};
  top: ${({ $isMobile }) => ($isMobile ? "auto" : "10px")};
  z-index: 2000;
  display: flex;
  flex-direction: ${({ $isMobile }) => ($isMobile ? "row-reverse" : "column")};
  align-items: center;
`;

// Chevron-knap til at åbne/lukke profilen (kun på mobil)
const ProfileToggle = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 10px;
  z-index: 2100;
  position: fixed;
  right: 10px;
  bottom: 7%;
  transform: translateY(50%);

  @media (min-width: 768px) {
    display: none; // Skjules på desktop
  }
`;

// Dropdown-menu med glide-animation mod venstre/højre
const DropdownMenu = styled.div`
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  height: fit-content;
  padding: 10px;
  color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 180px;
  text-align: center;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
  transform: ${({ $isOpen, $isMobile }) =>
    $isOpen ? "translateX(0)" : $isMobile ? "translateX(110%)" : "none"};
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
  position: absolute;
  top: ${({ $isMobile }) => ($isMobile ? "50%" : "50px")};
  bottom: ${({ $isMobile }) => ($isMobile ? "5%" : "auto")};
  right: ${({ $isMobile }) => ($isMobile ? "100%" : "0")};
  transform: ${({ $isMobile, $isOpen }) =>
    $isMobile
      ? $isOpen
        ? "translateX(0) translateY(50%)"
        : "translateX(110%) translateY(50%)"
      : "none"};
  h4 {
    color: white;
  }
  @media (min-width: 768px) {
    background: linear-gradient(135deg, #2c3e507b, #4ca2af8d);
    opacity: 1; // Altid synlig på desktop
    transform: none;
    pointer-events: auto;
    position: static;
    width: fit-content;
  }
`;
