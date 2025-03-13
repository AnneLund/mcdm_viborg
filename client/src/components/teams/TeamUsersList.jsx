import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetchTeamUsers from "../../hooks/useFetchTeamUsers";
import styled from "styled-components";
import { Section } from "../../styles/containerStyles";
import { List, ListItem } from "../../styles/listStyles";
import FocusPointComponent from "../GeneralFocusPoints";
import ActionButton from "../button/ActionButton";
import { StyledNavLink } from "../../styles/navigationStyles";

const ToggleButton = styled.h4`
  cursor: pointer;
  background: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  margin: 5px 0;
  user-select: none;
`;

const TeamUsersList = () => {
  const { id } = useParams();
  const { users, students, teachers, guests, team, isLoading, error } =
    useFetchTeamUsers(id);
  const navigate = useNavigate();

  const [showStudents, setShowStudents] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showGuests, setShowGuests] = useState(false);

  if (isLoading) return <p>Henter brugere...</p>;
  if (error) return <p>Fejl: {error}</p>;
  if (users.length === 0) return <p>Ingen brugere i dette team.</p>;

  return (
    <Section>
      <h3>{team.team}</h3>

      {students.length > 0 && (
        <>
          <ToggleButton onClick={() => setShowStudents(!showStudents)}>
            Studerende {showStudents ? "▲" : "▼"}
          </ToggleButton>
          {showStudents && (
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
          )}
        </>
      )}
      <ListItem onClick={() => navigate("/backoffice/groups")}>
        <StyledNavLink>Gruppegenerator</StyledNavLink>
      </ListItem>

      {teachers.length > 0 && (
        <>
          <ToggleButton onClick={() => setShowTeachers(!showTeachers)}>
            Lærere {showTeachers ? "▲" : "▼"}
          </ToggleButton>
          {showTeachers && (
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
          )}
        </>
      )}

      {guests.length > 0 && (
        <>
          <ToggleButton onClick={() => setShowGuests(!showGuests)}>
            Gæster {showGuests ? "▲" : "▼"}
          </ToggleButton>
          {showGuests && (
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
          )}
        </>
      )}

      <>
        <ToggleButton onClick={() => setShowProjects(!showProjects)}>
          Projekter {showProjects ? "▲" : "▼"}
        </ToggleButton>
        {showProjects && (
          <>
            <FocusPointComponent users={users} />
          </>
        )}
      </>
    </Section>
  );
};

export default TeamUsersList;
