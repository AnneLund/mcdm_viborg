import { Link, useParams } from "react-router-dom";
import { Section, ColumnContainer } from "../styles/containerStyles";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useEffect, useState } from "react";
import ActionButton from "../components/button/ActionButton";
import FeedbackForm from "../components/forms/FeedbackForm";
import { useAuthContext } from "../context/useAuthContext";
import UserFeedBack from "../components/users/UserFeedback";
import { List, ListItem } from "../styles/listStyles";

const StudentPanel = () => {
  const { userId } = useParams();
  const { fetchUserById, isLoading, error } = useFetchUsers();
  const [student, setStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [openFeedbacks, setOpenFeedbacks] = useState({});
  const { user } = useAuthContext();

  useEffect(() => {
    if (userId) {
      fetchUserById(userId)
        .then((data) => {
          if (data) setStudent(data);
        })
        .catch((error) => console.error("Fejl ved hentning af bruger:", error));
    }
  }, [userId]);

  const handleShowForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleToggleFeedback = (index) => {
    setOpenFeedbacks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (isLoading) return <p>Indlæser bruger...</p>;
  if (error) return <p>Fejl: {error}</p>;
  if (!student) return <p>Ingen bruger fundet.</p>;

  return (
    <Section>
      <header>
        <h1>{student.name}</h1>
        <p>
          <strong>Email:</strong> {student.email}
        </p>
        {student.team && (
          <Link to={`/studentpanel/${student._id}/team/${student.team._id}`}>
            <strong>Hold:</strong> {student.team.team}
          </Link>
        )}
      </header>

      <>
        {(user.role === "teacher" || user.role === "admin") && (
          <>
            {showForm ? (
              <FeedbackForm isEditMode={true} setShowForm={setShowForm} />
            ) : (
              <div className='button'>
                <ActionButton
                  onClick={handleShowForm}
                  buttonText='Tilføj feedback på en opgave'
                  background='green'
                />
              </div>
            )}
          </>
        )}
        {student.feedback.length > 0 && (
          <ColumnContainer>
            <h3>Feedback på opgaver</h3>
            {student.feedback.map((feedback, index) => (
              <div key={index}>
                <List>
                  <ListItem>
                    {feedback.project.title}
                    <p onClick={() => handleToggleFeedback(index)}>
                      {openFeedbacks[index] ? "Skjul feedback" : "Vis feedback"}
                    </p>
                  </ListItem>
                </List>
                {openFeedbacks[index] && <UserFeedBack feedback={feedback} />}
              </div>
            ))}
          </ColumnContainer>
        )}
      </>
    </Section>
  );
};

export default StudentPanel;
