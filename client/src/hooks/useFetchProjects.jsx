import { useEffect, useState } from "react";
import { apiUrl } from "../apiUrl";
import { useAuthContext } from "../context/useAuthContext";

const useFetchProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthContext();

  const fetchProjects = async () => {
    setIsLoading(true);
    const result = await fetch(`${apiUrl}/projects`);
    const response = await result.json();
    setProjects(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const refreshProjects = () => fetchProjects();

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
      refreshProjects();
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

      refreshProjects();

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
      refreshProjects();
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
    refreshProjects,
  };
};

export default useFetchProjects;
