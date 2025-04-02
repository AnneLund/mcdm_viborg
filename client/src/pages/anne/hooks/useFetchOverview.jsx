import { useCallback, useEffect, useState } from "react";
import { apiUrlInvites } from "../../../apiUrl";

const useFetchOverview = () => {
  const [overview, setOverview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrlInvites}/overview`);
      const data = await response.json();
      setOverview(data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching overview:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setOverview]);

  const refetch = useCallback(async () => {
    await fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    fetchOverview();
  }, []);

  return {
    overview,
    isLoading,
    refetch,
    fetchOverview,
  };
};

export default useFetchOverview;
