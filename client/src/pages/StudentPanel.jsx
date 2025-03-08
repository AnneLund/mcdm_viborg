import { useParams } from "react-router-dom";
import { Section } from "../styles/containerStyles";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useEffect, useState } from "react";
import ActionButton from "../components/button/ActionButton";
import FeedbackForm from "../components/forms/FeedbackForm";
import UserFeedBack from "../components/users/UserFeedback";

const StudentPanel = () => {
  const { id } = useParams();
  const { fetchUserById, isLoading, error } = useFetchUsers();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUserById(id)
        .then((data) => {
          if (data) setUser(data);
        })
        .catch((error) => console.error("Fejl ved hentning af bruger:", error));
    }
  }, [id]);

  const handleShowForm = () => {
    setShowForm((prev) => !prev);
  };

  if (isLoading) return <p>Indlæser bruger...</p>;
  if (error) return <p>Fejl: {error}</p>;
  if (!user) return <p>Ingen bruger fundet.</p>;

  return (
    <Section>
      <h1>{user.name}</h1>
      <img src={user.picture} alt={user.name} className='studentImg' />
      <header>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {user.team && (
          <p>
            <strong>Hold:</strong> {user.team.team}
          </p>
        )}
      </header>

      {user.feedback.length > 0 && (
        <>
          {user.feedback.map((feedback, index) => (
            <div key={index}>
              <h4>Feedback</h4>
              <UserFeedBack feedback={feedback} />
            </div>
          ))}
        </>
      )}
      {user.admin === "teacher" && (
        <>
          {" "}
          <ActionButton
            onClick={handleShowForm}
            buttonText='Tilføj feedback'
            background='green'
          />
          {showForm && <FeedbackForm isEditMode={true} />}
        </>
      )}
    </Section>
  );
};

export default StudentPanel;
