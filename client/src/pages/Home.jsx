import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useAuthContext } from "../context/useAuthContext";
import styled from "styled-components";
import ActionButton from "../components/button/ActionButton";
import BackArrow from "../components/button/BackArrow";
import AdminNavigation from "../components/AdminNavigation";
import Backoffice from "./Backoffice";
import { useMemo } from "react";
import { ButtonContainer } from "../styles/buttonStyles";

const Home = () => {
  const { user, signOut } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const isBackoffice = location.pathname.startsWith("/backoffice");
  const showBackArrow = useMemo(
    () => location.pathname !== "/",
    [location.pathname]
  );

  return (
    <>
      <Navigation />
      <StyledUserInfo>
        <p>Logget ind som:</p>
        <UserName>{user?.name}</UserName>
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
      </StyledUserInfo>
      {showBackArrow && <BackArrow />}
      {!isBackoffice && <Outlet />}
    </>
  );
};

// Styling til login-info sektionen
const StyledUserInfo = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #6487a918;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

// Brugernavn styling
const UserName = styled.p`
  font-weight: bold;
  color: #0077b6;
`;

export default Home;
