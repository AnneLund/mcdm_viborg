import { Outlet, useNavigate } from "react-router-dom";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import { MdAdd } from "react-icons/md";
import User from "./User";
import Loading from "../Loading/Loading";
import { Table } from "../../styles/tableStyles";

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
    <>
      <h2>Brugerliste</h2>
      <Table>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Billede</th>
            <th>Email</th>
            <th>Rolle</th>
            <th>Handlinger</th>
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
    </>
  );
};

export default Users;
