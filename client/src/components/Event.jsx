import { useState } from "react";
import styled from "styled-components";
import ActionButton from "./button/ActionButton";
import { useAuthContext } from "../context/useAuthContext";
import PresentationSchema from "../pages/PresentationSchema";

const Event = ({ event }) => {
  const { user } = useAuthContext();
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const tomorrowMidnight = new Date(todayMidnight);
  tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

  const isToday = event.eventObj.getTime() === todayMidnight.getTime();
  const isTomorrow = event.eventObj.getTime() === tomorrowMidnight.getTime();

  const [showSchema, setShowSchema] = useState(false);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formattedDate = isToday
    ? "I dag"
    : isTomorrow
    ? "I morgen"
    : capitalizeFirstLetter(
        event.eventObj.toLocaleDateString("da-DK", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      );

  const handleUploadClick = () => {
    setShowSchema((prev) => !prev);
  };

  return (
    <ListItem key={event._id} $isToday={isToday}>
      <EventTitle>
        {formattedDate}
        {event.time && <p>Kl. {event.time}</p>}
      </EventTitle>
      {event.event}
      {user.role === "admin" && (
        <div>
          {event.presentation && !event.file ? (
            <div>
              <ActionButton
                onClick={handleUploadClick}
                buttonText='Upload fremlæggelsesprogram'
              />
              {showSchema && (
                <PresentationSchema
                  event={event}
                  setShowSchema={setShowSchema}
                />
              )}
            </div>
          ) : (
            <>
              {event.presentation && event.file && (
                <a href={event.file} target='_blank'>
                  Se fremlæggelsesplan
                </a>
              )}
            </>
          )}
        </div>
      )}
      {event.description && <Description>{event.description}</Description>}

      {user.role === "guest" && (
        <>
          {event.presentation && event.file && (
            <div>
              <a href={event.file} target='_blank'>
                Se fremlæggelsesplan
              </a>
            </div>
          )}
        </>
      )}
    </ListItem>
  );
};

export default Event;

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
