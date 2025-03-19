import styled from "styled-components";

const Exercise = ({ exercise }) => {
  return (
    <ListItem>
      <DownloadLink href={exercise.file} download>
        📄 {exercise.title}
      </DownloadLink>
    </ListItem>
  );
};

export default Exercise;

const ListItem = styled.li`
  list-style: none;
  margin: 10px 0;
`;

const DownloadLink = styled.a`
  display: flex;
  gap: 8px;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  background: #2c3e50;
  border-radius: 5px;
  transition: background 0.3s ease;

  &:hover {
    background: #407d94;
  }

  &:active {
    background: #003f7f;
  }
`;
