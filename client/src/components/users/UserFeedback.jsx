import { formatDate } from "../../helpers/formatDate";
import { FeedbackContainer } from "../../styles/containerStyles";
import { List, ListItem } from "../../styles/listStyles";
import { CommentText, DateText, ProjectTitle } from "../../styles/textStyles";

const UserFeedBack = ({ feedback }) => {
  return (
    <FeedbackContainer>
      {feedback.project && (
        <ProjectTitle>Feedback på {feedback.project.title}</ProjectTitle>
      )}

      {feedback.exercise && (
        <ProjectTitle>Feedback på {feedback.exercise.title}</ProjectTitle>
      )}

      <DateText>{formatDate(feedback.date)}</DateText>
      <List>
        <CommentText>
          <span>Kommentarer</span>
        </CommentText>
        <ListItem> {feedback.comments}</ListItem>
      </List>

      {feedback.focusPoints && (
        <List>
          <CommentText>
            <span>Fokuspunkter</span>
          </CommentText>
          {feedback.focusPoints.map((focusPoint, index) => (
            <ListItem key={index}>{focusPoint}</ListItem>
          ))}
        </List>
      )}
    </FeedbackContainer>
  );
};

export default UserFeedBack;
