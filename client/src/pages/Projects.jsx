import { useNavigate } from "react-router-dom";
import { projects } from "../projects.json";
import styled from "styled-components";
import { useState } from "react";

const Select = styled.select`
  font-size: 1rem;
  padding: 0 10px;
  border-radius: 5px;
  border: none;
  background: #2c3e50;
  height: 50px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  color: white;
  margin: 10px 0;
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
      <div>
        <h2>Projekter</h2>
        <p>Vælg et projekt for at se opgaver og materialer.</p>
        <Select onChange={handleSelectChange} value={selectedProject}>
          <option value=''>Vælg et projekt</option>
          {visibleProjects > 0 ? (
            <>
              {visibleProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </>
          ) : (
            <option value=''>Ingen opgaver lige nu..</option>
          )}
        </Select>
      </div>
    </article>
  );
};

export default Projects;
