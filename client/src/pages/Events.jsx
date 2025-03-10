import { useMemo } from "react";
import useFetchEvents from "../hooks/useFetchEvents";
import { useAuthContext } from "../context/useAuthContext";
import { MdAdd } from "react-icons/md";
import { Outlet, useNavigate } from "react-router-dom";
import Event from "../components/Event";
import { Article } from "../styles/containerStyles";
import { Title } from "../styles/textStyles";
import { EventList, EventListItem } from "../styles/listStyles";

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
      <EventList>
        {sortedDates.length > 0 ? (
          sortedDates.map((event) => {
            return <Event key={event._id} event={event} />;
          })
        ) : (
          <p className='noEvents'>Ingen kommende begivenheder.</p>
        )}

        {(user?.role === "admin" || user?.role === "teacher") && (
          <EventListItem>
            <div className='addnewEvent'>
              <MdAdd size={50} onClick={handleAdd} />
              <Outlet context={{ refetch }} />
            </div>
          </EventListItem>
        )}
      </EventList>
    </Article>
  );
};

export default Events;
