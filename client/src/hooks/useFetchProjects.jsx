import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../apiUrl";
import { useAuthContext } from "../context/useAuthContext";

const useFetchProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();

  // HENT ALLE AKTIVITETER – memoiseret med useCallback, så referencen forbliver stabil (dvs at den ikke bliver genoprettet ved hver render)
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
    let formData;

    if (data instanceof FormData) {
      formData = data;
    } else {
      formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/project`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Fejl ved opdatering af klub");
      }

      const result = await response.json();
      console.log(result);

      refetch();

      return result.data;
    } catch (error) {
      console.error("Fejl i editProject:", error.message);
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
