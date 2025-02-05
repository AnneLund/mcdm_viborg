import { useNavigate } from "react-router-dom";
import { projects } from "../projects.json";
import styled from "styled-components";
import { useState } from "react";

const Navigation = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState("");

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedProject(selectedValue);

    if (selectedValue) {
      navigate(`/${selectedValue}`);
    }
  };

  return (
    <NavContainer>
      <Select onChange={handleSelectChange} value={selectedProject}>
        <option value=''>Vælg en opgave</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.upcomingExam ? "Kommende eksamen" : project.title}
          </option>
        ))}
      </Select>
    </NavContainer>
  );
};

export default Navigation;

// 🎨 Styled Components for flot styling
const NavContainer = styled.nav`
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const Select = styled.select`
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: none;
  background: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #f0f0f0;
  }

  &:focus {
    outline: none;
    border: 2px solid #4ca1af;
  }
`;
