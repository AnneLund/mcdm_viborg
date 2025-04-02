import { useCallback, useEffect, useState } from "react";
import { apiUrlInvites } from "../../../apiUrl";

const useFetchOverview = (invitationId) => {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    if (!invitationId) return;

    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrlInvites}/overview/${invitationId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Uventet fejl ved hentning af statistik"
        );
      }

      setOverview(data.data);
    } catch (error) {
      setError(error.message);
      console.error("Fejl ved hentning af overview:", error);
    } finally {
      setIsLoading(false);
    }
  }, [invitationId]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const refetch = fetchOverview;

  return {
    overview,
    isLoading,
    error,
    refetch,
  };
};

export default useFetchOverview;
