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
      setEvents(data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch-funktion, der blot kalder fetchTerms
  const refetch = useCallback(() => {
    fetchEvents();
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🚨 Fejl fra server:", errorText);
        throw new Error("Fejl ved opdatering af event");
      }

      const result = await response.json();

      return result.data;
    } catch (error) {
      console.error("Fejl i updateEvent:", error.message);
      showError("Der skete en fejl:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* Delete Event */
  const deleteEvent = async (eventId) => {
    setIsLoading(true);
    const response = await fetch(`${apiUrl}/event/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (response.ok) {
      refetch();
      setIsLoading(false);
      showSuccess("Projektet slettet!");
      navigate("/events");
      return result;
    } else {
      throw new Error(result.message || "Fejl ved sletning af klub");
    }
  };

  return {
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    isLoading,
    refetch,
  };
};

export default useFetchEvents;
