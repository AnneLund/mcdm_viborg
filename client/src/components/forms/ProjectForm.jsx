import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import ActionButton from "../button/ActionButton";
import styles from "./form.module.css";
import useFetchProjects from "../../hooks/useFetchProjects";
import { useAlert } from "../../context/Alert";
import { useOutletContext } from "react-router-dom";

const ProjectForm = ({ isEditMode, project }) => {
  const [materialsZip, setMaterialsZip] = useState(null);
  const [serverZip, setServerZip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { createProject } = useFetchProjects();
  const { showSuccess, showError, showConfirmation } = useAlert();
  const { refetch } = useOutletContext();

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
    }
  }, [project, setValue]);

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("isVisible", formData.isVisible ? "true" : "false");
      data.append("figma", formData.figma);

      if (materialsZip) {
        data.append("materialsZip", materialsZip);
      }
      if (serverZip) {
        data.append("serverZip", serverZip);
      }

      const response = await createProject(data);
      if (response.status === "ok") {
        showSuccess("Projektet er oprettet med succes!");
        if (isEditMode) {
          showConfirmation("Projektet er redigeret med succes!");
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
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <h2>{project ? "Rediger Projekt" : "Opret nyt projekt"}</h2>
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

        <div className='buttons'>
          <ActionButton
            onClick={() => isEditMode(false)}
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
