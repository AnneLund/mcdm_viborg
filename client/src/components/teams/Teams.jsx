import { Outlet, useNavigate } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import Team from "./Team";
import Loading from "../Loading/Loading";
import { Container } from "../../styles/containerStyles";
import { Table, Th } from "../../styles/tableStyles";
import useFetchTeams from "../../hooks/useFetchTeams";

const Teams = () => {
  const { teams, refetch, isLoading } = useFetchTeams();
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/backoffice/teams/add");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <h2>Holdliste</h2>
      <Table>
        <thead>
          <tr>
            <th>Hold</th>
            <th>Beskrivelse</th>
            <td>Handlinger</td>
          </tr>
        </thead>
        <tbody>
          {teams?.map((team) => (
            <Team key={team._id} team={team} />
          ))}
        </tbody>
      </Table>
      <MdAdd size={40} onClick={handleAdd} />
      <Outlet context={{ refetch }} />
    </>
  );
};

export default Teams;
