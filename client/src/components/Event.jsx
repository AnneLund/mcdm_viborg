import { useState } from "react";
import styled from "styled-components";
import ActionButton from "./button/ActionButton";
import { useAuthContext } from "../context/useAuthContext";
import PresentationSchema from "../pages/PresentationSchema";
import ExamSchedule from "../pages/ExamSchedule";
import useFetchEvents from "../hooks/useFetchEvents";
import { useAlert } from "../context/Alert";
import EventForm from "./forms/EventForm";

const Event = ({ event, refetch }) => {
  const { user } = useAuthContext();
  const { deleteEvent } = useFetchEvents();
  const { showConfirmation } = useAlert();
  const [eventData, setEventData] = useState(null);
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const tomorrowMidnight = new Date(todayMidnight);
  tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

  const isToday = event.eventObj.getTime() === todayMidnight.getTime();
  const isTomorrow = event.eventObj.getTime() === tomorrowMidnight.getTime();

  const [showSchema, setShowSchema] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);

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

  const handleDeleteClick = async () => {
    showConfirmation(
      "Slet event",
      `Er du sikker på, at du vil slette dette event?`,
      async () => {
        await deleteEvent(event._id);
        await refetch();
      }
    );
  };

  const handleEditClick = () => {
    setEventData(event);
    setShowEventForm(true);
  };
  return (
    <>
      {showEventForm ? (
        <EventForm
          event={eventData}
          isEditMode={true}
          setShowEventForm={setShowEventForm}
          refetch={refetch}
        />
      ) : (
        <ListItem key={event._id} $isToday={isToday}>
          <EventTitle>
            {formattedDate}
            {event.time && <p>Kl. {event.time}</p>}
          </EventTitle>
          {event.event}

          {(user.role === "admin" || user.role === "teacher") && (
            <div>
              {event.presentation && !event.file && (
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
              )}

              {event.exam && !event.file && (
                <div>
                  <ActionButton
                    onClick={handleUploadClick}
                    buttonText='Upload eksamensplan'
                  />
                  {showSchema && (
                    <ExamSchedule
                      event={event}
                      setShowSchema={setShowSchema}
                      refetch={refetch}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {event.description && <Description>{event.description}</Description>}

          {(user.role === "admin" || user.role === "teacher") && (
            <div className='buttons'>
              <ActionButton
                onClick={handleDeleteClick}
                buttonText='Slet'
                background='red'
              />
              <ActionButton
                onClick={() => handleEditClick(event)}
                buttonText='Redigér'
              />
            </div>
          )}

          {event.presentation && event.file && (
            <div>
              <a href={event.file} target='_blank'>
                Se fremlæggelsesplan
              </a>
            </div>
          )}
          {event.exam && event.file && (
            <div>
              <a href={event.file} target='_blank'>
                Se eksamensplan
              </a>
            </div>
          )}
        </ListItem>
      )}
    </>
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
  position: relative;

  .buttons {
    text-align: center;
  }
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
