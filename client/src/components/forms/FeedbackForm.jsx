import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import ActionButton from "../button/ActionButton";
import styles from "./form.module.css";
import { useAlert } from "../../context/Alert";
import { useParams } from "react-router-dom";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import useFetchProjects from "../../hooks/useFetchProjects";
import useFetchExercises from "../../hooks/useFetchExercises";
import { useAuthContext } from "../../context/useAuthContext";

const FeedbackForm = ({ isEditMode, setShowForm, existingFeedback }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserFeedback, refetch } = useFetchUsers();
  const { projects } = useFetchProjects();
  const { exercises } = useFetchExercises();
  const { showSuccess, showError } = useAlert();
  const { userId } = useParams();
  const textareaRef = useRef();

  const handleInput = () => {
    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };
  const loggedInUser = useAuthContext();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues:
      isEditMode && existingFeedback
        ? {
            project: existingFeedback.project || "",
            exercise: existingFeedback.exercise || "",
            projectComments: existingFeedback.projectComments || "",
            focusPoints: existingFeedback.focusPoints?.join(", ") || "",
          }
        : {
            project: "",
            exercise: "",
            projectComments: "",
            focusPoints: "",
          },
  });

  useEffect(() => {
    if (isEditMode && existingFeedback) {
      setValue("comments", existingFeedback.comments || "");
      setValue(
        "projectComments",
        existingFeedback.projectComments?.find((c) => c.type === "project")
          ?.content || ""
      );
      setValue(
        "presentationComments",
        existingFeedback.projectComments?.find((c) => c.type === "presentation")
          ?.content || ""
      );
      setValue("project", existingFeedback.project || "");
      setValue("createdBy", existingFeedback.createdBy || "");
      setValue("exercise", existingFeedback.exercise || "");
      setValue("focusPoints", existingFeedback.focusPoints?.join(", ") || "");
    }
  }, [isEditMode, existingFeedback, setValue]);

  const onSubmit = async (formData) => {
    setIsLoading(true);

    // Opbygning af feedback objekt baseret på formular input
    const feedbackData = {
      projectComments: [
        formData.projectComments
          ? { type: "project", content: formData.projectComments }
          : null,
        formData.presentationComments
          ? { type: "presentation", content: formData.presentationComments }
          : null,
      ].filter(Boolean), // Fjerner tomme værdier
      createdBy: loggedInUser.user._id,
      project: formData.project || null,
      exercise: formData.exercise || null,
      focusPoints: formData.focusPoints
        ? formData.focusPoints.split(",").map((point) => point.trim())
        : [],
      date: new Date().toISOString(),
    };

    try {
      if (isEditMode && existingFeedback) {
        // **Opdater eksisterende feedback**
        await updateUserFeedback(userId, existingFeedback._id, feedbackData);
        showSuccess("Feedback opdateret!");
      } else {
        // **Opret ny feedback**
        console.log("prøver at oprette");
        await updateUserFeedback(userId, null, feedbackData);
        showSuccess("Feedback tilføjet!");
      }
      refetch();
      setShowForm(false);
    } catch (error) {
      console.error("Fejl ved håndtering af feedback:", error.message);
      showError("Kunne ikke gemme feedback.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2>{isEditMode ? "Redigér feedback" : "Opret feedback"}</h2>
      <label>
        <h5>Giv feedback på et projekt</h5>
        <select {...register("project")} defaultValue=''>
          <option value=''>Vælg projekt</option>
          {projects?.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>
      </label>
      <h5>Eller</h5>
      <label>
        <h5>Giv feedback på en opgave</h5>
        <select {...register("exercise")} defaultValue=''>
          <option value=''>Vælg opgave</option>
          {exercises?.map((exercise) => (
            <option key={exercise._id} value={exercise._id}>
              {exercise.title}
            </option>
          ))}
        </select>
      </label>

      <label>
        <h5>Projekt</h5>
        <textarea
          name='projectComments'
          placeholder='Skriv skriftlig feedback her...'
          {...register("projectComments")}
          ref={textareaRef}
          onInput={handleInput}
          style={{ overflow: "hidden", resize: "none" }}
        />
      </label>

      {/* Mundtlig feedback */}
      <label>
        <h5>Præsentation</h5>
        <textarea
          name='presentationComments'
          placeholder='Skriv noter til projektet her...'
          // ref={textareaRef}
          // onInput={handleInput}
          {...register("presentationComments")}
        />
      </label>

      <label>
        <h5>Fokusområder</h5>
        <input
          type='text'
          name='focusPoints'
          placeholder='Skriv fokuspunkter, adskilt med komma'
          {...register("focusPoints")}
        />
      </label>

      <div id='buttons'>
        <ActionButton
          onClick={() => {
            setShowForm(false);
          }}
          buttonText='Annuller'
          cancel={true}
        />
        <ActionButton
          buttonText={isEditMode ? "Opdatér feedback" : "Tilføj feedback"}
          type='submit'
          background={isEditMode ? "blue" : "green"}
        />
      </div>
    </form>
  );
};

export default FeedbackForm;
