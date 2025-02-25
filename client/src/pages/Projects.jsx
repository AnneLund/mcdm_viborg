import { useNavigate } from "react-router-dom";
import { projects } from "../projects.json";
import styled from "styled-components";
import { useState } from "react";

const Select = styled.select`
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: none;
  background: #357e82dc;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  width: 200px;
  margin: 20px auto;
  color: white;
`;

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState("");
  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedProject(selectedValue);

    // Naviger til det valgte projekt
    if (selectedValue) {
      navigate(`/projects/${selectedValue}`);
    }
  };

  // Filtrer kun synlige projekter
  const visibleProjects = projects.filter(
    (project) => project.isVisible === true
  );

  return (
    <article className='projects'>
      <Select onChange={handleSelectChange} value={selectedProject}>
        <option value=''>Vælg en opgave</option>
        {visibleProjects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.title}
          </option>
        ))}
      </Select>
    </article>
  );
};

export default Projects;
