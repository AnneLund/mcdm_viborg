import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import { apiUrl } from "../apiUrl";
import { useAlert } from "../context/Alert";

const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthContext();
  const { showSuccess, showError } = useAlert();

  // HENT ALLE BRUGERE – memoiseret med useCallback, så referencen forbliver stabil (dvs at den ikke bliver genoprettet ved hver render)
  const fetchUsers = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/users`);
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch-funktion, der blot kalder fetchUsers
  const refetch = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (userData, isFormData = false) => {
    try {
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: userData,
      };

      if (!isFormData) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(userData);
      }

      const response = await fetch(`${apiUrl}/user`, options);

      if (!response.ok) {
        throw new Error("Fejl ved oprettelse af user");
      }

      return await response.json();
    } catch (error) {
      console.error("Fejl ved oprettelse:", error);
      throw error;
    }
  };

  // OPDATER BRUGER
  const updateUser = async (id, userData) => {
    try {
      const response = await fetch(`${apiUrl}/user/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: userData,
      });

      if (!response.ok) {
        throw new Error("Fejl ved opdatering af user");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Fejl ved oprettelse:", error);
      throw error;
    }
  };

  // OPDATÉR FEEDBACK PÅ BRUGER
  const updateUserFeedback = async (
    userId,
    feedbackId = null,
    feedbackData
  ) => {
    try {
      const url = feedbackId
        ? `${apiUrl}/user/${userId}/feedback`
        : `${apiUrl}/user/${userId}/feedback/new`;

      const method = feedbackId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          feedbackId: feedbackId,
          ...feedbackData,
        }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(
          feedbackId
            ? "Fejl ved opdatering af feedback"
            : "Fejl ved oprettelse af feedback"
        );
      }

      return await response.json();
    } catch (error) {
      console.error(
        feedbackId
          ? "Fejl ved opdatering af feedback:"
          : "Fejl ved oprettelse af feedback:",
        error
      );
      throw error;
    }
  };

  // SLET BRUGER
  const deleteUser = async (params) => {
    try {
      const response = await fetch(`${apiUrl}/user/${params}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        showError(data.message || "Kunne ikke slette brugeren");
        throw new Error(data.message || "Kunne ikke slette brugeren");
      }
      if (response.ok) {
        showSuccess("Bruger slettet!");
      }

      return { success: true, params };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
    }
  };

  // HENT USER BASERET PÅ ID
  const fetchUserById = async (id) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/user/${id}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch user: ${errorText}`);
      }

      const user = await response.json();
      setUser(user.data);
      return user.data;
    } catch (error) {
      setError(error.message);
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    user,
    createUser,
    deleteUser,
    setUsers,
    fetchUsers,
    fetchUserById,
    updateUser,
    updateUserFeedback,
    isLoading,
    refetch,
    error,
  };
};

export { useFetchUsers };
