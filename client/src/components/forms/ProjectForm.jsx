import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import ActionButton from "../button/ActionButton";
import styles from "./form.module.css";
import useFetchProjects from "../../hooks/useFetchProjects";
import { useAlert } from "../../context/Alert";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

const ProjectForm = ({ isEditMode }) => {
  const [materialsZip, setMaterialsZip] = useState(null);
  const [serverZip, setServerZip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const { createProject, projects, editProject } = useFetchProjects();
  const { showSuccess, showError } = useAlert();
  const { refetch } = useOutletContext();
  const { id } = useParams();
  const project = projects?.find((p) => p._id === id);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: project?.title || "",
      figma: project?.figma || "",
      isVisible: project?.isVisible || false,
    },
  });

  useEffect(() => {
    if (project) {
      setValue("title", project.title);
      setValue("figma", project.figma);
      setValue("isVisible", project.isVisible);
      setValue("description", project.description);
    }
  }, [project, setValue]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedProject(selectedValue === "true");
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("isVisible", selectedProject ? "true" : "false");
      data.append("figma", formData.figma);

      if (isEditMode && id) {
        data.append("id", id);
      }

      if (materialsZip) {
        data.append("materialsZip", materialsZip);
      }
      if (serverZip) {
        data.append("serverZip", serverZip);
      }

      const response = isEditMode
        ? await editProject(data)
        : await createProject(data);

      if (response.status === "ok") {
        showSuccess("Projektet er oprettet med succes!");
        if (isEditMode) {
          showSuccess("Opdateret!", "Projektet er opdateret med succes!");
        }
        await refetch();
      } else {
        showError("Fejl ved oprettelse af projekt:");
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("Fejl ved tilføjelse af projekt:", error);
    } finally {
      setIsLoading(false);
      navigate(-1);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <h2>{isEditMode ? "Rediger Projekt" : "Opret nyt projekt"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label>
          <input
            type='text'
            placeholder='Titel'
            {...register("title", { required: "Projektet skal have en titel" })}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </label>

        <label>
          <input
            type='text'
            placeholder='Beskrivelse'
            {...register("description")}
          />
          {errors.description && <p>{errors.description.message}</p>}
        </label>

        <label>
          <input type='text' placeholder='Figma Link' {...register("figma")} />
        </label>

        <label>
          <h3>Materialer (zip)</h3>
          <input
            type='file'
            accept='.zip'
            onChange={(e) => setMaterialsZip(e.target.files[0])}
          />
        </label>

        <label>
          <h3>Server (zip)</h3>
          <input
            type='file'
            accept='.zip'
            onChange={(e) => setServerZip(e.target.files[0])}
          />
        </label>
        <label>
          <h3>Synlighed for elever</h3>
          <select
            onChange={handleSelectChange}
            defaultValue={project?.isVisible ? "Synlig" : "Usynlig"}>
            {isEditMode ? (
              <>
                <option value={project?.isVisible} disabled>
                  {project?.isVisible ? "Synlig" : "Usynlig"}
                </option>

                {!project?.isVisible && <option value='true'>Synlig</option>}
                {project?.isVisible && <option value='false'>Usynlig</option>}
              </>
            ) : (
              <>
                <option value='false'>Usynlig</option>
                <option value='true'>Synlig</option>
              </>
            )}
          </select>
        </label>

        <div id='buttons'>
          <ActionButton
            onClick={() => {
              navigate(-1);
            }}
            buttonText='Annuller'
            cancel={true}
          />
          <ActionButton
            buttonText={project ? "Opdater Projekt" : "Tilføj Projekt"}
            type='submit'
            background={isEditMode ? "orange" : "green"}
          />
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
