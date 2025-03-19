import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetchTeamUsers from "../../hooks/useFetchTeamUsers";
import { Section } from "../../styles/containerStyles";
import { List, ListItem } from "../../styles/listStyles";
import FocusPointComponent from "../GeneralFocusPoints";
import { StyledNavLink } from "../../styles/navigationStyles";
import { IoIosArrowDown } from "react-icons/io";
import { ArrowIcon, StudentList, ToggleButton } from "./Teams.styled";
import TeamUser from "./TeamUser";

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
            Studerende
            <ArrowIcon $isOpen={showStudents}>
              <IoIosArrowDown size={30} />
            </ArrowIcon>
          </ToggleButton>

          <StudentList className={showStudents ? "show" : ""}>
            <ListItem>
              <div id='buttons'>
                <p
                  onClick={() =>
                    navigate(`/backoffice/teams/team/${id}/groups`)
                  }>
                  <StyledNavLink>Gruppegenerator</StyledNavLink>
                </p>
                <p onClick={() => navigate("/backoffice/examSchedule")}>
                  <StyledNavLink>EksamensplansGenerator</StyledNavLink>
                </p>
              </div>
            </ListItem>
            {students.map((user) => (
              <TeamUser
                user={user}
                onClick={() =>
                  navigate(`/backoffice/team/${id}/user/${user._id}`)
                }
                key={user._id}
              />
            ))}
          </StudentList>
        </>
      )}

      {teachers.length > 0 && (
        <>
          <ToggleButton onClick={() => setShowTeachers(!showTeachers)}>
            Undervisere{" "}
            <ArrowIcon $isOpen={showTeachers}>
              <IoIosArrowDown size={30} />
            </ArrowIcon>
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
            Gæster
            <ArrowIcon $isOpen={showGuests}>
              <IoIosArrowDown size={30} />
            </ArrowIcon>
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
          Projekter
          <ArrowIcon $isOpen={showProjects}>
            <IoIosArrowDown size={30} />
          </ArrowIcon>
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
