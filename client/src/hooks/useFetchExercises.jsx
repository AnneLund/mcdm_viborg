import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../apiUrl";
import { useAuthContext } from "../context/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/Alert";

const useFetchExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirmation } = useAlert();

  // HENT ALLE ØVELSER – memoiseret med useCallback, så referencen forbliver stabil (dvs at den ikke bliver genoprettet ved hver render)
  const fetchExercises = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/exercises`);
      const data = await response.json();
      setExercises(data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching exercises:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchExercises();
  }, [fetchExercises]);

  useEffect(() => {
    fetchExercises();
  }, []);

  /* Create Exercise */
  const createExercise = async (formData) => {
    setIsLoading(true);
    const response = await fetch(`${apiUrl}/exercise`, {
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

  /* Edit Exercise */
  const editExercise = async (data) => {
    const id = data.get("id");

    if (!id) {
      console.error("Fejl: ID mangler i editExercise!");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${apiUrl}/exercise/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      console.log(response);

      if (!response.ok) {
        showError("Der skete en fejl:", error);
        throw new Error("Fejl ved opdatering af projekt");
      }

      const result = await response.json();

      refetch();

      return result.data;
    } catch (error) {
      console.error("Fejl i editExercise:", error.message);
      showError("Der skete en fejl:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* Delete Exercise */
  const deleteExercise = async (exerciseId) => {
    setIsLoading(true);
    const response = await fetch(`${apiUrl}/exercise/${exerciseId}`, {
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
      navigate("/exercises");
      return result;
    } else {
      throw new Error(result.message || "Fejl ved sletning af klub");
    }
  };

  return {
    exercises,
    createExercise,
    editExercise,
    deleteExercise,
    isLoading,
    refetch,
  };
};

export default useFetchExercises;
