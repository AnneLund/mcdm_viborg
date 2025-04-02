import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrlInvites } from "../../../apiUrl";
import { useAlert } from "../../../context/Alert";
import { useAuthContext } from "../../../context/useAuthContext";

const useFetchGuests = (invitationId) => {
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirmation } = useAlert();

  const fetchGuests = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${apiUrlInvites}/guests/by-invitation/${invitationId}`
      );
      const data = await response.json();
      setGuests(data.guests);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching guests:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setGuests]);

  const refetch = useCallback(async () => {
    await fetchGuests();
  }, [fetchGuests]);

  useEffect(() => {
    if (invitationId) {
      fetchGuests();
    }
  }, [invitationId]);

  /* Create Guest */
  const createGuest = async (payload) => {
    setIsLoading(true);

    const response = await fetch(`${apiUrlInvites}/guest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      setIsLoading(false);
      return { status: "ok", data: result.data };
    } else {
      throw new Error(result.message || "Fejl ved oprettelse af gæst");
    }
  };

  /* Edit Guest */
  const updateGuest = async (guestId, data) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${apiUrlInvites}/guest/${guestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        showError("Fejl fra server:", errorText);
        throw new Error("Fejl ved opdatering af gæst");
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

  /* Delete Guest */
  const deleteGuest = async (guestId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrlInvites}/guest/${guestId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess("Guest slettet!");
        return result;
      } else {
        throw new Error(result.message || "Fejl ved sletning af guest");
      }
    } catch (error) {
      showError("Fejl:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    guests,
    createGuest,
    updateGuest,
    deleteGuest,
    isLoading,
    refetch,
    fetchGuests,
  };
};

export default useFetchGuests;
