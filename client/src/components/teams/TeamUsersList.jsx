import { useNavigate, useParams } from "react-router-dom";
import useFetchTeamUsers from "../../hooks/useFetchTeamUsers";
import { Section } from "../../styles/containerStyles";
import { List, ListItem } from "../../styles/listStyles";

const TeamUsersList = () => {
  const { id } = useParams();
  const { users, team, isLoading, error } = useFetchTeamUsers(id);
  const navigate = useNavigate();

  if (isLoading) return <p>Henter brugere...</p>;
  if (error) return <p>Fejl: {error}</p>;
  if (users.length === 0) return <p>Ingen brugere i dette team.</p>;

  const sortUsersByName = (usersArray) => {
    return usersArray.sort((a, b) => a.name.localeCompare(b.name));
  };

  const students = sortUsersByName(
    users.filter((user) => user.role === "student")
  );
  const teachers = sortUsersByName(
    users.filter((user) => user.role === "teacher")
  );
  const guests = sortUsersByName(users.filter((user) => user.role === "guest"));

  return (
    <Section>
      <h3>{team.team}</h3>

      {students.length > 0 && (
        <>
          <h4>Studerende</h4>
          <List>
            {students.map((user) => (
              <ListItem
                onClick={() =>
                  navigate(`/backoffice/team/${id}/user/${user._id}`)
                }
                key={user._id}>
                <div className='teams-list'>
                  <strong>{user.name}</strong>
                  <p>
                    {user.email} ({user.role})
                  </p>
                </div>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {teachers.length > 0 && (
        <>
          <h4>Lærere</h4>
          <List>
            {teachers.map((user) => (
              <ListItem
                onClick={() =>
                  navigate(`/backoffice/teams/team/${id}/user/${user._id}`)
                }
                key={user._id}>
                <div className='teams-list'>
                  <strong>{user.name}</strong>
                  <p>
                    {user.email} ({user.role})
                  </p>
                </div>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Gæster */}
      {guests.length > 0 && (
        <>
          <h4>Gæster</h4>
          <List>
            {guests.map((user) => (
              <ListItem
                onClick={() =>
                  navigate(`/backoffice/teams/team/${id}/user/${user._id}`)
                }
                key={user._id}>
                <div className='teams-list'>
                  <strong>{user.name}</strong>
                  <p>
                    {user.email} ({user.role})
                  </p>
                </div>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Section>
  );
};

export default TeamUsersList;
