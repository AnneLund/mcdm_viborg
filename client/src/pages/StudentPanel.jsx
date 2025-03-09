import { useParams } from "react-router-dom";
import { Section } from "../styles/containerStyles";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useEffect, useState } from "react";
import ActionButton from "../components/button/ActionButton";
import FeedbackForm from "../components/forms/FeedbackForm";
import { useAuthContext } from "../context/useAuthContext";
import UserFeedBack from "../components/users/UserFeedback";

const StudentPanel = () => {
  const { id } = useParams();
  const { fetchUserById, isLoading, error } = useFetchUsers();
  const [student, setStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    if (id) {
      fetchUserById(id)
        .then((data) => {
          if (data) setStudent(data);
        })
        .catch((error) => console.error("Fejl ved hentning af bruger:", error));
    }
  }, [id]);

  const handleShowForm = () => {
    setShowForm((prev) => !prev);
  };

  if (isLoading) return <p>Indlæser bruger...</p>;
  if (error) return <p>Fejl: {error}</p>;
  if (!student) return <p>Ingen bruger fundet.</p>;

  return (
    <Section>
      <header>
        <h1>{student.name}</h1>
        <img src={student.picture} alt={student.name} className='studentImg' />
        <p>
          <strong>Email:</strong> {student.email}
        </p>
        {student.team && (
          <p>
            <strong>Hold:</strong> {student.team.team}
          </p>
        )}
      </header>

      {student.feedback.length > 0 && (
        <>
          {student.feedback.map((feedback, index) => (
            <div key={index}>
              <h4>Feedback</h4>
              {(user.role === "teacher" || user.role === "admin") && (
                <div className='button'>
                  <ActionButton
                    onClick={handleShowForm}
                    buttonText='Tilføj feedback'
                    background='green'
                  />
                  {showForm && <FeedbackForm isEditMode={true} />}
                </div>
              )}
              <UserFeedBack feedback={feedback} />
            </div>
          ))}
        </>
      )}
    </Section>
  );
};

export default StudentPanel;
