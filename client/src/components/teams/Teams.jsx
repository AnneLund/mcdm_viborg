import { Outlet, useNavigate } from "react-router-dom";
import Team from "./Team";
import Loading from "../Loading/Loading";
import { Table } from "../../styles/tableStyles";
import useFetchTeams from "../../hooks/useFetchTeams";
import { Add } from "../icons/Icons";

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
            <td>Handlinger</td>
          </tr>
        </thead>
        <tbody>
          {teams?.map((team) => (
            <Team key={team._id} team={team} />
          ))}
          <tr>
            <td data-label='Hold'>
              <Add onClick={handleAdd} />
            </td>
          </tr>
        </tbody>
      </Table>

      <Outlet context={{ refetch }} />
    </>
  );
};

export default Teams;
