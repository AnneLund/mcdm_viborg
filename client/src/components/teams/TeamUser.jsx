import { useEffect, useRef, useState } from "react";
import { Edit, Remove } from "../icons/Icons";
import { useAlert } from "../../context/Alert";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import UserForm from "../forms/UserForm";
import { User } from "./Teams.styled";
import { ButtonContainer } from "../../styles/buttonStyles";
import { useNavigate, useParams } from "react-router-dom";

const TeamUser = ({ user }) => {
  const [showForm, setShowForm] = useState(false);
  const { showConfirmation } = useAlert();
  const { deleteUser, refetch } = useFetchUsers();
  const formRef = useRef();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, []);

  const handleEdit = () => {
    setShowForm((prev) => !prev);
  };

  const handleDelete = () => {
    showConfirmation(
      "Slet bruger",
      `Er du sikker på, at du vil slette ${user.name}?`,
      () => {
        deleteUser(user._id);
      }
    );
  };

  return (
    <>
      {showForm ? (
        <div ref={formRef}>
          <UserForm
            isEditMode={true}
            refetch={refetch}
            user={user}
            setShowForm={setShowForm}
          />
        </div>
      ) : (
        <User key={user._id}>
          <div
            onClick={() => navigate(`/backoffice/team/${id}/user/${user._id}`)}>
            <p>{user.name}</p>
            {/* <td data-label='Billede'>
            {user.picture && (
              <img src={user.picture} alt={user.name} width='50' height='50' />
            )}
          </td> */}
            <p>{user.email}</p>
          </div>

          <ButtonContainer>
            <Remove onClick={handleDelete} />
            <Edit onClick={() => handleEdit(user._id)} />
          </ButtonContainer>
        </User>
      )}
    </>
  );
};

export default TeamUser;
