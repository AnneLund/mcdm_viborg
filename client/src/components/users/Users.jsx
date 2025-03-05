import { Outlet, useNavigate } from "react-router-dom";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import styled from "styled-components";
import { MdAdd } from "react-icons/md";
import User from "./User";
import Loading from "../Loading/Loading";

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

const UsersContainer = styled.section`
  width: 100%;
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  svg {
    cursor: pointer;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const Th = styled.th`
  background: #007bff;
  color: white;
  padding: 10px;
  text-align: left;
`;

export default Users;
