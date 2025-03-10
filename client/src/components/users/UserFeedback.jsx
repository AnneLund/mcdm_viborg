import { useState } from "react";
import { formatDate } from "../../helpers/formatDate";
import { FeedbackContainer } from "../../styles/containerStyles";
import { List, ListItem } from "../../styles/listStyles";
import { CommentText, DateText, ProjectTitle } from "../../styles/textStyles";
import ActionButton from "../button/ActionButton";
import FeedbackForm from "../forms/FeedbackForm";

const UserFeedBack = ({ feedback }) => {
  const [showForm, setShowForm] = useState(false);

  const handleEditClick = () => {
    setShowForm(true);
  };

  return (
    <FeedbackContainer>
      {feedback.project && (
        <ProjectTitle>
          Feedback på {feedback.project.title}
          {feedback.createdBy && <p>- oprettet af {feedback.createdBy.name}</p>}
        </ProjectTitle>
      )}
      {feedback.exercise && (
        <ProjectTitle>
          Feedback på {feedback.exercise.title}
          {feedback.createdBy && <p>- oprettet af {feedback.createdBy.name}</p>}
        </ProjectTitle>
      )}
      <DateText>{formatDate(feedback.date)}</DateText>
      <CommentText>Kommentarer</CommentText>
      <List>
        <ListItem>{feedback.comments}</ListItem>
      </List>
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
      {feedback.projectComments.length > 0 && (
        <>
          <CommentText>Mundtlig præstation</CommentText>
          <List>
            {feedback.projectComments.map((pc, index) => (
              <ListItem key={index}>{pc.content}</ListItem>
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
