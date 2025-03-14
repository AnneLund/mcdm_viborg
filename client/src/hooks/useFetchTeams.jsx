import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../apiUrl";
import { useAuthContext } from "../context/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/Alert";

const useFetchTeams = () => {
  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirmation } = useAlert();

  // HENT ALLE TEAMS – memoiseret med useCallback, så referencen forbliver stabil (dvs at den ikke bliver genoprettet ved hver render)
  const fetchTeams = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/teams`);
      const data = await response.json();
      setTeams(data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching teams:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch-funktion, der blot kalder fetchTeams
  const refetch = useCallback(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    fetchTeams();
  }, []);

  // CREATE TEAM
  const createTeam = async (formData) => {
    setIsLoading(true);
    const response = await fetch(`${apiUrl}/team`, {
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

  // UPDATE TEAM
  const updateTeam = async (teamId, data) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${apiUrl}/team/${teamId}`, {
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
        throw new Error("Fejl ved opdatering af team");
      }

      const result = await response.json();

      return result.data;
    } catch (error) {
      console.error("Fejl i updateTeam:", error.message);
      showError("Der skete en fejl:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE TEAM
  const deleteTeam = async (teamId) => {
    setIsLoading(true);
    const response = await fetch(`${apiUrl}/team/${teamId}`, {
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
      navigate("/teams");
      return result;
    } else {
      throw new Error(result.message || "Fejl ved sletning af klub");
    }
  };

  // HENT TEAM BY ID
  const fetchTeamById = useCallback(async (teamId) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/team/${teamId}`);
      if (!response.ok) {
        throw new Error("Team ikke fundet");
      }
      const data = await response.json();
      setTeam(data.data); // Sæt det hentede team i state
    } catch (error) {
      setError(error.message);
      console.error("Error fetching team by ID:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    team,
    fetchTeamById,
    teams,
    createTeam,
    updateTeam,
    deleteTeam,
    isLoading,
    refetch,
  };
};

export default useFetchTeams;
