import { useState } from "react";
import useFetchProjects from "../hooks/useFetchProjects";
import { Container } from "../styles/containerStyles";
import stringSimilarity from "string-similarity";
import { StyledNavLink } from "../styles/navigationStyles";
import { ButtonContainer } from "../styles/buttonStyles";

const FocusPointComponent = ({ users }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [collectedFocusPoints, setCollectedFocusPoints] = useState([]);
  const { projects } = useFetchProjects();

  const projectMap = new Map();
  users.forEach((user) => {
    user.feedback.forEach((fb) => {
      if (!projectMap.has(fb.project)) {
        projectMap.set(fb.project, []);
      }
      projectMap.get(fb.project).push(...fb.focusPoints);
    });
  });

  const teamProjects = Array.from(projectMap.keys());

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    return project ? project.title : "";
  };

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-zæøå0-9\s-]/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const isSimilar = (text1, text2) => {
    const words1 = text1.split(" ");
    const words2 = text2.split(" ");

    const matchingWords = words1.filter((word) => words2.includes(word)).length;

    return (
      stringSimilarity.compareTwoStrings(text1, text2) > 0.75 ||
      matchingWords >= 2
    );
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);

    const rawFocusPoints = projectMap.get(project) || [];
    const cleanedFocusPoints = rawFocusPoints.map(normalizeText);

    const uniqueFocusPoints = [];

    cleanedFocusPoints.forEach((point) => {
      if (!uniqueFocusPoints.some((existing) => isSimilar(existing, point))) {
        uniqueFocusPoints.push(point);
      }
    });

    setCollectedFocusPoints([...uniqueFocusPoints].sort());
  };

  return (
    <>
      <ButtonContainer>
        {teamProjects
          .filter((project) => getProjectName(project).trim() !== "") // Filtrerer tomme navne fra
          .map((project) => (
            <StyledNavLink
              key={project}
              onClick={() => handleProjectClick(project)}>
              {getProjectName(project)}
            </StyledNavLink>
          ))}
      </ButtonContainer>
      {selectedProject && (
        <Container>
          <h3>Focus Points for {getProjectName(selectedProject)}</h3>
          <ul>
            {collectedFocusPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </Container>
      )}
    </>
  );
};

export default FocusPointComponent;
