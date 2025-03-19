import { useAlert } from "../../context/Alert";
import { useNavigate } from "react-router-dom";
import useFetchTeams from "../../hooks/useFetchTeams";
import { Edit, Remove } from "../icons/Icons";

const Team = ({ team }) => {
  const { showConfirmation } = useAlert();
  const { deleteTeam } = useFetchTeams();
  const navigate = useNavigate();

  const handleEdit = (teamId) => {
    navigate(`/backoffice/teams/edit/${teamId}`);
  };

  const handleDelete = () => {
    showConfirmation(
      "Slet hold",
      `Er du sikker på, at du vil slette ${team.team}?`,
      () => {
        deleteTeam(team._id);
      }
    );
  };

  return (
    <tr
      key={team._id}
      onClick={() => navigate(`/backoffice/teams/team/${team._id}`)}>
      <td data-label='Hold' className='link'>
        {team.team}
      </td>
      {team.description && <td data-label='Beskrivelse'>{team.description}</td>}
      <td data-label='Handlinger' className='teamActions'>
        <div className='buttons'>
          <Remove onClick={() => handleDelete(team.id)} />
          <Edit onClick={() => handleEdit(team._id)} />
        </div>
      </td>
    </tr>
  );
};

export default Team;
