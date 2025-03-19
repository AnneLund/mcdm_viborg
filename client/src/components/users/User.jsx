import { useAlert } from "../../context/Alert";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import { MdDelete, MdOutlineEditNote } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import UserForm from "../forms/UserForm";

const User = ({ user }) => {
  const [showForm, setShowForm] = useState(false);
  const { showConfirmation } = useAlert();
  const { deleteUser, refetch } = useFetchUsers();
  const formRef = useRef();

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
        <tr ref={formRef}>
          <td colSpan='4'>
            <UserForm
              isEditMode={true}
              refetch={refetch}
              user={user}
              setShowForm={setShowForm}
            />
          </td>
        </tr>
      ) : (
        <tr key={user._id}>
          <td data-label='Navn'>{user.name}</td>
          {/* <td data-label='Billede'>
            {user.picture && (
              <img src={user.picture} alt={user.name} width='50' height='50' />
            )}
          </td> */}
          <td data-label='Email'>{user.email}</td>
          <td data-label='Rolle'>{user.role}</td>
          <td data-label='Handlinger' className='actions'>
            <div className='teamActions'>
              <MdDelete size={30} onClick={handleDelete} />
              <MdOutlineEditNote
                size={30}
                onClick={() => handleEdit(user._id)}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default User;
