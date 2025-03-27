import styled from "styled-components";

const Exercise = ({ exercise, localExercise }) => {
  const data = exercise || localExercise;

  if (!data) return null;

  return (
    <ListItem>
      <DownloadLink
        href={data.file || data.url}
        target='_blank'
        rel='noopener noreferrer'>
        📄 {data.title || data.name}
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
