import { useParams } from "react-router-dom";
import { projects } from "../../projects.json";
import styled from "styled-components";
import { useAuthContext } from "../../context/useAuthContext";
import Login from "../login/Login";

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
  const { id } = useParams();
  const { token } = useAuthContext();

  const project = projects?.find((p) => p.id === id);

  if (!project) {
    return <h2>Projekt ikke fundet</h2>;
  }

  return (
    <article>
      <header>
        <h1>{project.title}</h1>
      </header>

      {!token ? (
        <Login />
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
