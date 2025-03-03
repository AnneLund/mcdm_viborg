import { dates } from "../calendar.json";
import { useMemo } from "react";
import styled from "styled-components";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Article = styled.article`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 16px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  background: ${(props) => (props.$isToday ? "#4ca2af3e" : "#fff")};
  border-left: 5px solid ${(props) => (props.$isToday ? "#60cadb" : "#2c3e50")};
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EventTitle = styled.strong`
  display: block;
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #555;
`;

const Dates = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedDates = useMemo(() => {
    return dates
      .map((date) => {
        const dateObj = new Date(date.date);
        dateObj.setHours(0, 0, 0, 0);
        return { ...date, dateObj };
      })
      .filter((date) => date.dateObj >= today)
      .sort((a, b) => a.dateObj - b.dateObj);
  }, [dates]);

  return (
    <Article>
      <Title>Vigtige datoer</Title>
      <List>
        {sortedDates.length > 0 ? (
          sortedDates.map((date, index) => {
            const isToday = date.dateObj.getTime() === today.getTime();
            const formattedDate = isToday
              ? "I dag"
              : capitalizeFirstLetter(
                  date.dateObj.toLocaleDateString("da-DK", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                );

            return (
              <ListItem key={index} $isToday={isToday}>
                <EventTitle>
                  {formattedDate} {date.time}
                </EventTitle>
                {date.event}
                <Description>{date.description}</Description>
              </ListItem>
            );
          })
        ) : (
          <p>Ingen kommende begivenheder.</p>
        )}
      </List>
    </Article>
  );
};

export default Dates;
