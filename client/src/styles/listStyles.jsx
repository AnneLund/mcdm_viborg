import styled from "styled-components";

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 8px;
`;

export const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  margin: 10px;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  strong {
    display: block;
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
  }
`;
