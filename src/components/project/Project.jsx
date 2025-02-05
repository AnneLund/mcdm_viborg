import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { projects } from "../../projects.json";
import Form from "../Form";
import styled from "styled-components";

const ResourceList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResourceItem = styled.li`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #e9ecef;
    transform: scale(1.02);
  }
`;

const ResourceLink = styled.a`
  text-decoration: none;
  color: #0077b6;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    text-decoration: underline;
    color: #023e8a;
  }
`;

const Project = () => {
  const { projectId } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const project = projects?.find((p) => p.id === projectId);
  const requiresAuth = project.upcomingExam === true;

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthenticated(false);
      setIsLoading(true);

      const savedAuth = localStorage.getItem(`auth_${projectId}`);
      const correctHash = await hashPassword(
        import.meta.env[`VITE_${projectId.toUpperCase()}_PASSWORD`]
      );

      if (savedAuth === correctHash) {
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [projectId, requiresAuth]);

  if (!project) {
    return <h2>Projekt ikke fundet</h2>;
  }

  const handleLogin = async (inputPassword) => {
    const PASSWORDS = {
      1: import.meta.env.VITE_LEGEKROGEN_PASSWORD,
      3: import.meta.env.VITE_CINESTAR_PASSWORD,
    };

    const hashedInput = await hashPassword(inputPassword);
    const hashedCorrect = await hashPassword(PASSWORDS[projectId]);

    if (hashedInput === hashedCorrect) {
      localStorage.setItem(`auth_${projectId}`, hashedInput);
      setIsAuthenticated(true);
    } else {
      alert("Forkert kode! Prøv igen.");
    }
  };

  if (isLoading) {
    return <h2>Henter opgaven...</h2>;
  }

  return (
    <article>
      <header>
        <h1>
          {requiresAuth && !isAuthenticated
            ? "Kommende eksamensopgave"
            : `Opgave: ${project.title}`}
        </h1>
      </header>

      {requiresAuth && !isAuthenticated ? (
        <Form onLogin={handleLogin} />
      ) : (
        <ResourceList>
          <ResourceItem>
            <ResourceLink href={project.zip} download>
              📁 Hent alle materialer (inkl. hovedopgave)
            </ResourceLink>
          </ResourceItem>
          <ResourceItem>
            <ResourceLink
              href={project.figma}
              target='_blank'
              rel='noopener noreferrer'>
              🎨 Åbn Figma-designet
            </ResourceLink>
          </ResourceItem>
          <ResourceItem>
            <ResourceLink href={project.server} download>
              🌍 Hent serveren
            </ResourceLink>
          </ResourceItem>
        </ResourceList>
      )}
    </article>
  );
};

export default Project;
