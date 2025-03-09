import { useAlert } from "../../context/Alert";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdOutlineEditNote } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { RiAdminFill } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";

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
      <td data-label='Navn'>
        {user.role === "student" && (
          <>
            {user.name} <PiStudentFill />
          </>
        )}
        {user.role === "admin" && (
          <>
            {user.name}
            <RiAdminFill />
          </>
        )}
        {user.role === "guest" && (
          <>
            {user.name}
            <IoPersonOutline />
          </>
        )}
      </td>
      <td data-label='Billede'>
        {user.picture && (
          <img src={user.picture} alt={user.name} width='50' height='50' />
        )}
      </td>
      <td data-label='Email'>{user.email}</td>
      <td data-label='Rolle'>{user.role}</td>
      <td data-label='Handlinger' className='actions'>
        <MdDelete size={30} onClick={handleDelete} />
        <MdOutlineEditNote size={30} onClick={() => handleEdit(user._id)} />
      </td>
    </tr>
  );
};

export default User;
