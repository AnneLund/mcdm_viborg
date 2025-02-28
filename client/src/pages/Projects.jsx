import { Outlet, useNavigate } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import styled from "styled-components";
import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import useFetchProjects from "../hooks/useFetchProjects";

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
  const { user } = useAuthContext();
  const { projects } = useFetchProjects();

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedProject(selectedValue);

    if (selectedValue) {
      navigate(`/projects/${selectedValue}`);
    }
  };

  const handleAdd = () => {
    navigate("/projects/add");
  };

  const visibleProjects =
    user?.role === "admin"
      ? projects
      : projects.filter((project) => project.isVisible === true);

  return (
    <article className='projects'>
      <div>
        <h2>Projekter</h2>
        <p>Vælg et projekt for at se opgaver og materialer.</p>
        <Select onChange={handleSelectChange} value={selectedProject}>
          <option value=''>Vælg et projekt</option>
          {visibleProjects.length > 0 ? (
            <>
              {visibleProjects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </>
          ) : (
            <option value=''>Ingen opgaver lige nu..</option>
          )}
        </Select>
        {user?.role === "admin" && (
          <>
            <MdAdd size={50} onClick={handleAdd} />
            <Outlet />
          </>
        )}
      </div>
    </article>
  );
};

export default Projects;
