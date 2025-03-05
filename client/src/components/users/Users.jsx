import { Outlet, useNavigate } from "react-router-dom";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import { MdAdd } from "react-icons/md";
import User from "./User";
import Loading from "../Loading/Loading";
import { UsersContainer } from "../../styles/containerStyles";
import { Table, Th } from "../../styles/tableStyles";

const Users = () => {
  const { users, refetch, isLoading } = useFetchUsers();
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/backoffice/users/add");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <UsersContainer>
      <h2>Brugerliste</h2>
      <Table>
        <thead>
          <tr>
            <Th>Navn</Th>
            <Th>Email</Th>
            <Th>Rolle</Th>
            <Th>Handlinger</Th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <User key={user._id} user={user} />
          ))}
        </tbody>
      </Table>
      <MdAdd size={40} onClick={handleAdd} />
      <Outlet context={{ refetch }} />
    </UsersContainer>
  );
};

export default Users;
