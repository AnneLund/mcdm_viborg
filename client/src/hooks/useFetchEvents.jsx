import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../apiUrl";
import { useAuthContext } from "../context/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/Alert";

const useFetchEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirmation } = useAlert();

  // HENT ALLE PROJEKTER– memoiseret med useCallback, så referencen forbliver stabil (dvs at den ikke bliver genoprettet ved hver render)
  const fetchEvents = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/events`);
      const data = await response.json();
      setEvents(data.data); // Sørg for at opdatere en useState!
    } catch (error) {
      setError(error.message);
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setEvents]);

  const refetch = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchEvents();
  }, []);

  /* Create Event */
  const createEvent = async (formData) => {
    setIsLoading(true);
    const response = await fetch(`${apiUrl}/event`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      setIsLoading(false);
      return result.data;
    } else {
      throw new Error(result.message || "Fejl ved oprettelse af klub");
    }
  };

  /* Edit Event */
  const updateEvent = async (eventId, data) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${apiUrl}/event/${eventId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorText = await response.text();
        showError("Fejl fra server:", errorText);
        throw new Error("Fejl ved opdatering af event");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      showError("Der skete en fejl:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* Delete Event */
  const deleteEvent = async (eventId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/event/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess("Event slettet!");
        return result;
      } else {
        throw new Error(result.message || "Fejl ved sletning af event");
      }
    } catch (error) {
      showError("Fejl:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    isLoading,
    refetch,
    fetchEvents,
  };
};

export default useFetchEvents;
