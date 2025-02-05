import { useParams } from "react-router-dom";
import { projects } from "../../projects.json";

const Project = () => {
  const { projectId } = useParams();

  const project = projects.find(
    (p) => p.projectName.toLowerCase() === projectId
  );

  if (!project) {
    return <h2>Projekt ikke fundet</h2>;
  }

  return (
    <article>
      <header>
        <h1>Opgave: {project.title}</h1>
      </header>

      <ol>
        <li>
          <a href={project.zip} download>
            Hent alle materialer som en zip-fil (inkl. hovedopgave)
          </a>
        </li>
        <li>
          <a href={project.figma} target='_blank' rel='noopener noreferrer'>
            Åbn Figma-designet
          </a>
        </li>
      </ol>
    </article>
  );
};

export default Project;
