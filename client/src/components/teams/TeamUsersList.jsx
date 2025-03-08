import { useNavigate, useParams } from "react-router-dom";
import useFetchTeamUsers from "../../hooks/useFetchTeamUsers";
import { Section } from "../../styles/containerStyles";
import { List, ListItem } from "../../styles/listStyles";

const TeamUsersList = () => {
  const { id } = useParams();
  const { users, team, isLoading, error } = useFetchTeamUsers(id);
  const navigate = useNavigate();

  console.log(users);

  if (isLoading) return <p>Henter brugere...</p>;
  if (error) return <p>Fejl: {error}</p>;
  if (users.length === 0) return <p>Ingen brugere i dette team.</p>;

  return (
    <Section>
      <h3>{team.team}</h3>
      <List>
        {users.map((user) => (
          <ListItem
            onClick={() =>
              navigate(`/backoffice/teams/team/${id}/user/${user._id}`)
            }
            key={user._id}>
            <strong>{user.name}</strong> {user.email} ({user.role})
          </ListItem>
        ))}
      </List>
    </Section>
  );
};

export default TeamUsersList;
