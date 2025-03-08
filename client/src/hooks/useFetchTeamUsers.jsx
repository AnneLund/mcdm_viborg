import { useState, useEffect } from "react";
import { apiUrl } from "../apiUrl";
import { useAuthContext } from "../context/useAuthContext";

const useFetchTeamUsers = (teamId) => {
  const [team, setTeam] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();

  useEffect(() => {
    if (!teamId || !token) return;

    const fetchTeamData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/user/team/${teamId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setTeam(data.team); // 🔥 Gem team-data
          setUsers(data.users); // 🔥 Gem brugere i teamet
        } else {
          throw new Error(data.message || "Kunne ikke hente team og brugere");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId, token]);

  return { team, users, isLoading, error };
};

export default useFetchTeamUsers;
