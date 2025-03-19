import { useMemo, useState } from "react";
import useFetchEvents from "../hooks/useFetchEvents";
import { useAuthContext } from "../context/useAuthContext";
import { MdAdd } from "react-icons/md";
import Event from "../components/Event";
import { Article } from "../styles/containerStyles";
import { Title } from "../styles/textStyles";
import { EventList, EventListItem } from "../styles/listStyles";
import EventForm from "../components/forms/EventForm";

const Events = () => {
  const { user } = useAuthContext();
  const { events, refetch } = useFetchEvents();
  const [showEventForm, setShowEventForm] = useState();
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

  const [eventData, setEventData] = useState(null);

  const handleAdd = () => {
    setEventData(null);
    setShowEventForm(true);
  };

  return (
    <Article>
      <Title>Vigtige datoer</Title>
      <EventList>
        {(user?.role === "admin" || user?.role === "teacher") && (
          <EventListItem>
            <div className='addnewEvent'>
              <MdAdd size={50} onClick={handleAdd} />
              {showEventForm && (
                <EventForm
                  event={eventData}
                  setShowEventForm={setShowEventForm}
                  refetch={refetch}
                />
              )}
            </div>
          </EventListItem>
        )}
        {sortedDates.length > 0 ? (
          sortedDates.map((event) => (
            <Event key={event._id} event={event} refetch={refetch} />
          ))
        ) : (
          <p className='noEvents'>Ingen kommende begivenheder.</p>
        )}
      </EventList>
    </Article>
  );
};

export default Events;
