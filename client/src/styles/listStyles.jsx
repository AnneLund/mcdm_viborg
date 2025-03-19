import styled from "styled-components";

export const List = styled.ul`
  list-style: none;
  padding: 10px 0;
  margin: 5px auto;
  text-align: center;
  max-width: fit-content;

  h4 {
    padding-left: 0;
    margin-left: 0;
  }
`;

export const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  margin: 5px 0;
  border-bottom: 1px solid #eee;
  font-size: 16px;

  &:last-child {
    border-bottom: none;
  }

  strong {
    display: block;
  }

  button {
    padding: 2px 5px;
    margin: 0;
    cursor: pointer;
    border: none;
    box-shadow: grey 1px 1px 2px;
    color: white;
    font-size: 20px;
  }

  .add {
    background-color: #00800071;
  }

  .remove {
    background-color: #ff000061;
  }

  input {
    margin: 0 5px;
  }

  label {
    font-size: 20px;
  }
`;

export const FeedbackListItem = styled.li`
  background: white;
  padding: 10px;
  margin-bottom: 6px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #007bff;
  font-size: 14px;
  color: #333;
`;

export const EventList = styled.ul`
  list-style: none;
  padding: 0;
  .noEvents {
    margin: 20px 0;
  }
`;

export const EventListItem = styled.li`
  background: ${(props) => (props.$isToday ? "#4ca2af3e" : "#fff")};
  border-left: 5px solid ${(props) => (props.$isToday ? "#60cadb" : "#2c3e50")};
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .addnewEvent {
    text-align: center;
    cursor: pointer;
  }
`;
