import { Link, useParams } from "react-router-dom";
import { Section, ColumnContainer } from "../styles/containerStyles";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useEffect, useState } from "react";
import { formatDate } from "../helpers/formatDate";

const TeacherPanel = () => {
  const { userId } = useParams();
  const { fetchUserById, isLoading, error } = useFetchUsers();
  const [teacher, setTeacher] = useState(null);
  useEffect(() => {
    if (userId) {
      fetchUserById(userId)
        .then((data) => {
          if (data) setTeacher(data);
        })
        .catch((error) => console.error("Fejl ved hentning af bruger:", error));
    }
  }, [userId]);

  if (isLoading) return <p>Indlæser bruger...</p>;
  if (error) return <p>Fejl: {error}</p>;
  if (!teacher) return <p>Ingen bruger fundet.</p>;

  return (
    <Section>
      <header>
        <h1>{teacher.name}</h1>
        <p>
          <strong>Email:</strong> {teacher.email}
        </p>
        {teacher.team && (
          <Link to={`/teacherpanel/${teacher._id}/team/${teacher.team._id}`}>
            <strong>Hold:</strong> {teacher.team.team}
          </Link>
        )}
      </header>

      <>
        {teacher.feedback.length > 0 && (
          <ColumnContainer>
            <h3>Feedback fra elever</h3>
            {teacher.feedback.map((feedback, index) => (
              <div key={index}>
                <ul>
                  <li>
                    <h5>{feedback.comments}</h5>
                    <p>oprettet: {formatDate(feedback.date)}</p>
                  </li>
                </ul>
              </div>
            ))}
          </ColumnContainer>
        )}
      </>
    </Section>
  );
};

export default TeacherPanel;
