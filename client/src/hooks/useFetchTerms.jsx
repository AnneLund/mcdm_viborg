import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import { apiUrl } from "../apiUrl";

const useFetchTerms = () => {
  const [terms, setTerms] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthContext();

  // HENT ALLE AKTIVITETER – memoiseret med useCallback, så referencen forbliver stabil (dvs at den ikke bliver genoprettet ved hver render)
  const fetchTerms = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/terms`);
      const data = await response.json();
      setTerms(data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching terms:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch-funktion, der blot kalder fetchTerms
  const refetch = useCallback(() => {
    fetchTerms();
  }, [fetchTerms]);

  const createTerm = async (termData) => {
    try {
      const response = await fetch(`${apiUrl}/term`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Fortæller serveren, at vi sender JSON
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(termData),
      });

      if (!response.ok) {
        throw new Error("Fejl ved oprettelse af term");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Fejl ved oprettelse:", error);
      throw error;
    }
  };

  // OPDATER TERM
  const updateTerm = async (termData) => {
    try {
      const response = await fetch(`${apiUrl}/term`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(termData),
      });

      if (!response.ok) {
        throw new Error("Fejl ved opdatering af term");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Fejl ved oprettelse:", error);
      throw error;
    }
  };

  // SLET TERM
  const deleteTerm = async (params) => {
    await fetch(`${apiUrl}/api/term/${params}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    /* Filter all the terms without the matching ID. */
    const filteredArray = terms.filter((act) => act._id !== params);

    setTerms(filteredArray);
  };

  // HENT TERM BASERET PÅ ID
  const fetchTermById = async (id) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/term/${id}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch term: ${errorText}`);
      }

      const term = await response.json();
      return term.data;
    } catch (error) {
      setError(error.message);
      console.error("Error fetching term:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return {
    terms,
    createTerm,
    deleteTerm,
    setTerms,
    fetchTerms,
    fetchTermById,
    updateTerm,
    isLoading,
    refetch,
    error,
  };
};

export { useFetchTerms };
