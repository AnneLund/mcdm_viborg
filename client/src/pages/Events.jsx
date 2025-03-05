import { useMemo, useState } from "react";
import styled from "styled-components";
import useFetchEvents from "../hooks/useFetchEvents";
import { useAuthContext } from "../context/useAuthContext";
import { MdAdd } from "react-icons/md";
import { Outlet, useNavigate } from "react-router-dom";
import Event from "../components/Event";

const Events = () => {
  const { user } = useAuthContext();
  const { events, refetch } = useFetchEvents();

  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedDates = useMemo(() => {
    return events
      .map((event) => {
        const eventObj = new Date(event.date);
        eventObj.setHours(0, 0, 0, 0);
        return { ...event, eventObj };
      })
      .filter((event) => event.eventObj.getTime() >= today.getTime())
      .sort((a, b) => a.eventObj - b.eventObj);
  }, [events]);

  const handleAdd = () => {
    navigate("/backoffice/events/add");
  };

  return (
    <Article>
      <Title>Vigtige datoer</Title>
      <List>
        {sortedDates.length > 0 ? (
          sortedDates.map((event) => {
            return <Event key={event._id} event={event} />;
          })
        ) : (
          <p className='noEvents'>Ingen kommende begivenheder.</p>
        )}

        {user?.role === "admin" && (
          <ListItem>
            <MdAdd size={50} onClick={handleAdd} />
            <Outlet context={{ refetch }} />
          </ListItem>
        )}
      </List>
    </Article>
  );
};

export default Events;

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
  .noEvents {
    margin: 20px 0;
  }
`;

const ListItem = styled.li`
  background: ${(props) => (props.$isToday ? "#4ca2af3e" : "#fff")};
  border-left: 5px solid ${(props) => (props.$isToday ? "#60cadb" : "#2c3e50")};
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
