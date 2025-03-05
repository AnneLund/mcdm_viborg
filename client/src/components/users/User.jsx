import styled from "styled-components";
import { useAlert } from "../../context/Alert";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdOutlineEditNote } from "react-icons/md";

const User = ({ user }) => {
  const { showConfirmation } = useAlert();
  const { deleteUser } = useFetchUsers();
  const navigate = useNavigate();

  const handleEdit = (userId) => {
    navigate(`/backoffice/users/edit/${userId}`);
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
    <tr key={user._id}>
      <Td>{user.name}</Td>
      <Td>{user.email}</Td>
      <Td>{user.role}</Td>
      <Td>
        <MdDelete size={30} onClick={handleDelete} />
        <MdOutlineEditNote size={30} onClick={() => handleEdit(user._id)} />
      </Td>
    </tr>
  );
};

export default User;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
`;
