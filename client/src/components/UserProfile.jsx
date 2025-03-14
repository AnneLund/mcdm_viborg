import styled from "styled-components";
import { ButtonContainer } from "../styles/buttonStyles";
import ActionButton from "./button/ActionButton";
import { Link, useNavigate } from "react-router-dom";

const UserProfile = ({ user, signOut }) => {
  const navigate = useNavigate();
  return (
    <StyledUserInfo>
      <p>Logget ind som:</p>

      {user.role === "student" ? (
        <Link to={`/studentpanel/${user._id}`}>
          <h4> {user?.name} </h4>
        </Link>
      ) : (
        <Link to={`/teacherpanel/${user._id}`}>
          <h4> {user?.name} </h4>
        </Link>
      )}

      <ButtonContainer>
        {user.role === "student" && (
          <ActionButton
            buttonText='Skift kode'
            background='blue'
            onClick={() => navigate("/change-password")}
          />
        )}
        <ActionButton buttonText='Log ud' background='red' onClick={signOut} />
      </ButtonContainer>
    </StyledUserInfo>
  );
};

export default UserProfile;

const StyledUserInfo = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #6487a918;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
  position: fixed;
  right: 10px;
  top: 0;
  z-index: 2000;

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px;
    text-decoration: none;
    text-decoration: underline;
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 5px;
  }
`;
