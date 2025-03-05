import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../apiUrl";
import { useAuthContext } from "../context/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/Alert";

const useFetchProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirmation } = useAlert();

  // HENT ALLE PROJEKTER– memoiseret med useCallback, så referencen forbliver stabil (dvs at den ikke bliver genoprettet ved hver render)
  const fetchProjects = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/projects`);
      const data = await response.json();
      setProjects(data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch-funktion, der blot kalder fetchTerms
  const refetch = useCallback(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchProjects();
  }, []);

  /* Create Project */
  const createProject = async (formData) => {
    setIsLoading(true);
    const response = await fetch(`${apiUrl}/project`, {
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

  /* Edit Project */
  const editProject = async (data) => {
    const id = data.get("id");

    if (!id) {
      console.error("Fejl: ID mangler i editProject!");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${apiUrl}/project/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        showError("Der skete en fejl:", error);
        throw new Error("Fejl ved opdatering af projekt");
      }

      const result = await response.json();

      refetch();

      return result.data;
    } catch (error) {
      console.error("Fejl i editProject:", error.message);
      showError("Der skete en fejl:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* Delete Project */
  const deleteProject = async (projectId) => {
    setIsLoading(true);
    const response = await fetch(`${apiUrl}/project/${projectId}`, {
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
      navigate("/projects");
      return result;
    } else {
      throw new Error(result.message || "Fejl ved sletning af klub");
    }
  };

  return {
    projects,
    createProject,
    editProject,
    deleteProject,
    isLoading,
    refetch,
  };
};

export default useFetchProjects;
