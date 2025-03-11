import { useEffect, useState } from "react";
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
  const { users, updateUserFeedback, refetch } = useFetchUsers();
  const { projects } = useFetchProjects();
  const { exercises } = useFetchExercises();
  const { showSuccess, showError } = useAlert();
  const { userId } = useParams();
  const user = users?.find((p) => p._id === userId);
  const loggedInUser = useAuthContext();
  console.log(userId);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      feedback: user?.feedback || [],
      project: user?.feedback?.[0]?.project || "",
      exercise: user?.feedback?.[0]?.exercise || "",
      projectComments: user?.feedback?.[0]?.comments || "",
      presentationComments: user?.feedback?.[0]?.comments || "",
      comments: user?.feedback?.[0]?.comments || "",
      createdBy: user?.feedback?.[0]?.createdBy || "",
      focusPoints: user?.feedback?.[0]?.focusPoints?.join(", ") || "",
    },
  });

  useEffect(() => {
    if (user && user.feedback && user.feedback.length > 0) {
      setValue("comments", user.feedback[0]?.comments || "");
      setValue(
        "projectComments",
        user.feedback[0]?.projectComments?.find((c) => c.type === "project")
          ?.content || ""
      );
      setValue(
        "presentationComments",
        user.feedback[0]?.projectComments?.find(
          (c) => c.type === "presentation"
        )?.content || ""
      );
      setValue("project", user.feedback[0]?.project || "");
      setValue("createdBy", user.feedback[0]?.createdBy || "");
      setValue("exercise", user.feedback[0]?.exercise || "");
      setValue("focusPoints", user.feedback[0]?.focusPoints?.join(", ") || "");
    }
  }, [user, existingFeedback, setValue]);

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
        />
      </label>

      {/* Mundtlig feedback */}
      <label>
        <h5>Præsentation</h5>
        <textarea
          name='presentationComments'
          placeholder='Skriv noter til projektet her...'
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
