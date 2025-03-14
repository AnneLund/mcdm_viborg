import { useParams } from "react-router-dom";
import useFetchTeamUsers from "../hooks/useFetchTeamUsers";
import styled from "styled-components";
import { useState } from "react";
import ActionButton from "../components/button/ActionButton";
import { ButtonContainer } from "../styles/buttonStyles";
import StudentFeedbackForm from "../components/forms/StudentFeedbackForm";
import { NavContainer } from "../styles/navigationStyles";

const Team = () => {
  const { id } = useParams();
  const { students, teachers, team, isLoading, error } = useFetchTeamUsers(id);
  const [showStudents, setShowStudents] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const handleFeedbackClick = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleCloseForm = () => {
    setSelectedTeacher(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <Title>{team?.team}</Title>

      <NavContainer>
        <ActionButton
          onClick={() => {
            setShowStudents(!showStudents);
            setShowTeachers(false);
          }}
          buttonText={showStudents ? "Skjul studerende" : "Vis studerende"}
        />
        <ActionButton
          onClick={() => {
            setShowTeachers(!showTeachers);
            setShowStudents(false);
          }}
          buttonText={showTeachers ? "Skjul undervisere" : "Vis undervisere"}
        />
      </NavContainer>

      {/* Studerende liste */}
      {showStudents && (
        <Section>
          <SectionTitle>Studerende</SectionTitle>
          <List>
            {students?.map((student) => (
              <ListItem key={student._id}>
                <MemberInfo>
                  <ProfilePicture src={student.picture} alt={student.name} />
                  <div>
                    <Name>{student.name}</Name>
                    <Contact>{student.email}</Contact>
                  </div>
                </MemberInfo>
              </ListItem>
            ))}
          </List>
        </Section>
      )}

      {/* Underviser liste */}
      {showTeachers && (
        <Section>
          <SectionTitle>Undervisere</SectionTitle>
          <List>
            {teachers?.map((teacher) => (
              <ListItem key={teacher._id}>
                <MemberInfo>
                  <ProfilePicture src={teacher.picture} alt={teacher.name} />
                  <div>
                    <Name>{teacher.name}</Name>
                    <Contact>{teacher.email}</Contact>
                  </div>
                </MemberInfo>
                <ActionButton
                  onClick={() => handleFeedbackClick(teacher)}
                  background='green'
                  buttonText='Tilføj anonym feedback'
                />
              </ListItem>
            ))}
          </List>
        </Section>
      )}

      {selectedTeacher && (
        <StudentFeedbackForm
          teacher={selectedTeacher}
          setShowForm={handleCloseForm}
          isStudent={true}
        />
      )}
    </Container>
  );
};

export default Team;

// Styled Components
const Container = styled.div`
  padding: 0 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 5px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProfilePicture = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 0 20px;
`;

const MemberInfo = styled.div`
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    margin-left: 10px;
  }
`;

const Name = styled.p`
  display: block;
  font-weight: bold;
  font-size: 15px;
  color: #333;
`;

const Contact = styled.p`
  display: block;
  font-size: 10px;
  color: #777;
`;
