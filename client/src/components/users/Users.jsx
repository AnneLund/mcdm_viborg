import { useFetchUsers } from "../../hooks/useFetchUsers";
import { MdAdd } from "react-icons/md";
import User from "./User";
import Loading from "../Loading/Loading";
import { Table } from "../../styles/tableStyles";
import { useState } from "react";
import UserForm from "../forms/UserForm";
import { Section } from "../../styles/containerStyles";

const Users = () => {
  const { users, refetch, isLoading } = useFetchUsers();
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    setShowForm((prev) => !prev);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {showForm ? (
        <UserForm refetch={refetch} setShowForm={setShowForm} />
      ) : (
        <Section>
          <header>
            <h2>Brugerliste</h2>
            <MdAdd size={40} onClick={handleAdd} />
          </header>

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
        </Section>
      )}
    </>
  );
};

export default Users;
