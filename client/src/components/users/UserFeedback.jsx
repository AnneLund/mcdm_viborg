import { useState } from "react";
import { formatDate } from "../../helpers/formatDate";
import { FeedbackContainer } from "../../styles/containerStyles";
import { List, ListItem } from "../../styles/listStyles";
import { CommentText, DateText, ProjectTitle } from "../../styles/textStyles";
import ActionButton from "../button/ActionButton";
import FeedbackForm from "../forms/FeedbackForm";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../context/useAuthContext";
import { apiUrl } from "../../apiUrl";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";

const UserFeedBack = ({ feedback }) => {
  const [showForm, setShowForm] = useState(false);
  const [isVisible, setIsVisible] = useState(feedback.isVisible);
  const { userId } = useParams();
  const { user } = useAuthContext();

  const projectComments = feedback.projectComments.filter(
    (comment) => comment.type === "project"
  );

  const presentationComments = feedback.projectComments.filter(
    (comment) => comment.type === "presentation"
  );

  const handleEditClick = () => {
    setShowForm(true);
  };

  const toggleVisibility = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/user/${userId}/feedback/${feedback._id}/visibility`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isVisible: !isVisible }),
        }
      );

      if (response.ok) {
        setIsVisible(!isVisible);
      }
    } catch (error) {
      console.error("Fejl ved opdatering af synlighed", error);
    }
  };

  const isTeacher = user?.role === "teacher";

  return (
    <FeedbackContainer>
      {/* Kun lærere kan ændre synlighed */}
      {isTeacher && (
        <>
          {isVisible ? (
            <div className='visibility'>
              <MdVisibility size={30} onClick={toggleVisibility} />
              <p>(Synlig for elev)</p>
            </div>
          ) : (
            <div className='visibility'>
              <MdVisibilityOff size={30} onClick={toggleVisibility} />

              <p>(Usynlig for elev)</p>
            </div>
          )}
        </>
      )}
      {/* Feedback vises altid for læreren, men kun for eleven hvis isVisible er true */}
      {(isTeacher || isVisible) && (
        <>
          {feedback.project && (
            <ProjectTitle>
              Feedback på {feedback.project.title}
              {feedback.createdBy && (
                <p>- oprettet af {feedback.createdBy.name}</p>
              )}
            </ProjectTitle>
          )}

          {feedback.exercise && (
            <ProjectTitle>
              Feedback på {feedback.exercise.title}
              {feedback.createdBy && (
                <p>- oprettet af {feedback.createdBy.name}</p>
              )}
            </ProjectTitle>
          )}
          <DateText>{formatDate(feedback.date)}</DateText>
          {/* <CommentText>Kommentarer</CommentText>
          <List>
            <ListItem>{feedback.comments}</ListItem>
          </List> */}

          {projectComments.length > 0 && (
            <>
              <CommentText>Projektet</CommentText>
              <List>
                {projectComments && (
                  <>
                    {projectComments.map((pc, index) => (
                      <ListItem key={index}>{pc.content}</ListItem>
                    ))}
                  </>
                )}
              </List>
            </>
          )}

          {presentationComments.length > 0 && (
            <>
              <CommentText>Mundtlig præstation</CommentText>
              <List>
                {presentationComments && (
                  <>
                    {presentationComments.map((pc, index) => (
                      <ListItem key={index}>{pc.content}</ListItem>
                    ))}
                  </>
                )}
              </List>
            </>
          )}
          {feedback.focusPoints && (
            <>
              <CommentText>Fokuspunkter</CommentText>
              <List>
                {feedback.focusPoints.map((focusPoint, index) => (
                  <ListItem key={index}>{focusPoint}</ListItem>
                ))}
              </List>
            </>
          )}
          <div className='buttons'>
            <ActionButton
              buttonText='Redigér feedback'
              background='blue'
              onClick={handleEditClick}
            />
          </div>
        </>
      )}

      {showForm && (
        <FeedbackForm
          isEditMode={true}
          setShowForm={setShowForm}
          existingFeedback={feedback}
        />
      )}
    </FeedbackContainer>
  );
};

export default UserFeedBack;
