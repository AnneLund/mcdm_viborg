import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrlInvites } from "../../../apiUrl";
import { useAlert } from "../../../context/Alert";
import { useAuthContext } from "../../../context/useAuthContext";

const useFetchInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();
  const { showSuccess, showError } = useAlert();

  const fetchInvitations = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrlInvites}/invitations`);
      const data = await response.json();
      setInvitations(data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching invitations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setInvitations]);

  const refetch = useCallback(async () => {
    await fetchInvitations();
  }, [fetchInvitations]);

  useEffect(() => {
    fetchInvitations();
  }, []);

  /* Create Invitation */
  const createInvitation = async (formData, isMultipart = false) => {
    const res = await fetch(`${apiUrlInvites}/invitation`, {
      method: "POST",
      body: formData,
      headers: isMultipart ? undefined : { "Content-Type": "application/json" },
    });

    const data = await res.json();
    return data;
  };

  /* Edit Invitation */
  const updateInvitation = async (
    invitationId,
    formData,
    isMultipart = false
  ) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${apiUrlInvites}/invitation/${invitationId}`,
        {
          method: "PUT",
          body: formData,
          headers: isMultipart
            ? undefined
            : { "Content-Type": "application/json" },
        }
      );

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

  /* Delete Invitation */
  const deleteInvitation = async (invitationId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${apiUrlInvites}/invitation/${invitationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.status === "ok") {
        showSuccess("Invitation slettet!");
        return result;
      } else {
        throw new Error(result.message || "Fejl ved sletning af invitation");
      }
    } catch (error) {
      showError("Fejl:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvitationById = async (id) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrlInvites}/invitation/${id}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch faq: ${errorText}`);
      }

      const invitation = await response.json();
      console.log("FETCHED INVITATION:", invitation);
      return invitation.data;
    } catch (error) {
      setError(error.message);
      console.error("Error fetching faq:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    invitations,
    createInvitation,
    updateInvitation,
    deleteInvitation,
    fetchInvitationById,
    isLoading,
    refetch,
    fetchInvitations,
  };
};

export default useFetchInvitations;
