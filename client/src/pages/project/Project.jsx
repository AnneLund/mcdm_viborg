import { Outlet, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAuthContext } from "../../context/useAuthContext";
import Login from "../../components/login/Login";
import useFetchProjects from "../../hooks/useFetchProjects";
import Loading from "../../components/Loading/Loading";
import { FaExclamationTriangle } from "react-icons/fa";
import { MdDelete, MdOutlineEditNote } from "react-icons/md";
import { useAlert } from "../../context/Alert";

const ResourceList = styled.ol`
  list-style: none;
  padding: 20px;
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
  const { projects, isLoading, deleteProject, refetch } = useFetchProjects();
  const project = projects?.find((p) => p._id === id);
  const { user, token } = useAuthContext();
  const { showConfirmation } = useAlert();
  const navigate = useNavigate();

  const handleConfirmation = () => {
    showConfirmation(
      "Slet projekt",
      "Er du sikker på, at du vil slette dette projekt?",
      () => deleteProject(project._id)
    );
  };

  const handleEdit = () => {
    navigate(`/projects/${id}/edit/${id}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!project) {
    return <h2>Projekt ikke fundet</h2>;
  }

  return (
    <article className='project'>
      <header>
        <h1>
          {project.title}
          {user.role === "admin" && (
            <>
              <MdDelete onClick={() => handleConfirmation()} />{" "}
              <MdOutlineEditNote onClick={() => handleEdit()} />
            </>
          )}
        </h1>
        {user.role === "admin" && (
          <p className='attention'>
            <FaExclamationTriangle />
            Dette projekt er
            {project.isVisible ? (
              <span> synligt for eleverne</span>
            ) : (
              <span> kun synligt for underviseren.</span>
            )}
          </p>
        )}
      </header>
      {project.description == !null && (
        <div className='projectDescription'>
          <h3>Beskrivelse</h3>
          <p>{project.description}</p>
        </div>
      )}

      {!token ? (
        <Login />
      ) : (
        <article className='project'>
          <Outlet context={{ refetch }} />
          <ResourceList>
            {project.materialsZip ? (
              <ResourceItem>
                <ResourceLink href={project.materialsZip} download>
                  📁 Hent alle materialer (inkl. hovedopgave)
                </ResourceLink>
              </ResourceItem>
            ) : (
              <ResourceItem>
                <p className='attention'>
                  <FaExclamationTriangle />
                  <span> Ingen materialer tilføjet endnu..</span>
                </p>
              </ResourceItem>
            )}

            {project.figma ? (
              <ResourceItem>
                <ResourceLink
                  href={project.figma}
                  target='_blank'
                  rel='noopener noreferrer'>
                  🎨 Åbn Figma-designet
                </ResourceLink>
              </ResourceItem>
            ) : (
              <ResourceItem>
                <p className='attention'>
                  <FaExclamationTriangle />
                  <span> Intet design tilføjet endnu..</span>
                </p>
              </ResourceItem>
            )}

            {project.serverZip ? (
              <ResourceItem>
                <ResourceLink href={project.serverZip} download>
                  🌍 Hent serveren
                </ResourceLink>
              </ResourceItem>
            ) : (
              <ResourceItem>
                <p className='attention'>
                  <FaExclamationTriangle />
                  <span> Ingen server tilføjet endnu..</span>
                </p>
              </ResourceItem>
            )}
          </ResourceList>
        </article>
      )}
    </article>
  );
};

export default Project;
