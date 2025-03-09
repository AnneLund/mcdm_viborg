import styled from "styled-components";
import { useAlert } from "../../context/Alert";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete, MdOutlineEditNote } from "react-icons/md";
import useFetchTeams from "../../hooks/useFetchTeams";

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
      onClick={() => navigate(`/backoffice/teams/team/${team._id}`)}
      style={{ cursor: "pointer" }}>
      <td data-label='Hold'>{team.team}</td>
      <td data-label='Beskrivelse'>{team.description}</td>
      <td data-label='Handlinger' className='teamActions'>
        <div>
          <MdDelete size={30} onClick={handleDelete} />
          <MdOutlineEditNote size={30} onClick={() => handleEdit(team._id)} />
        </div>
      </td>
    </tr>
  );
};

export default Team;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
`;
