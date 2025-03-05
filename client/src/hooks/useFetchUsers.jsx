import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import { apiUrl } from "../apiUrl";

const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthContext();

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
        body: userData, // 📌 Hvis det er FormData, skal vi IKKE tilføje Content-Type
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

  // OPDATER FAQ
  const updateUser = async (userData) => {
    try {
      const response = await fetch(`${apiUrl}/user`, {
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

  // SLET FAQ
  const deleteUser = async (params) => {
    await fetch(`${apiUrl}/user/${params}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    /* Filter all the users without the matching ID. */
    const filteredArray = users.filter((act) => act._id !== params);

    setUsers(filteredArray);
  };

  // HENT FAQ BASERET PÅ ID
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
    createUser,
    deleteUser,
    setUsers,
    fetchUsers,
    fetchUserById,
    updateUser,
    isLoading,
    refetch,
    error,
  };
};

export { useFetchUsers };
