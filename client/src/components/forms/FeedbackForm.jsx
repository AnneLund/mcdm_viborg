import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import ActionButton from "../button/ActionButton";
import styles from "./form.module.css";
import { useAlert } from "../../context/Alert";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import useFetchProjects from "../../hooks/useFetchProjects";
import useFetchExercises from "../../hooks/useFetchExercises";
import { useAuthContext } from "../../context/useAuthContext";

const FeedbackForm = ({ isEditMode, setShowForm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { users, updateUserFeedback, refetch } = useFetchUsers();
  const { projects } = useFetchProjects();
  const { exercises } = useFetchExercises();
  const { showSuccess, showError } = useAlert();
  const { id } = useParams();
  const user = users?.find((p) => p._id === id);
  const loggedInUser = useAuthContext();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      feedback: user?.feedback || [],
      project: user?.feedback?.[0]?.project || "",
      exercises: user?.feedback?.[0]?.exercise || "",
      comments: user?.feedback?.[0]?.comments || "",
      createdBy: user?.feedback?.[0]?.createdBy || "",
      focusPoints: user?.feedback?.[0]?.focusPoints?.join(", ") || "",
    },
  });

  useEffect(() => {
    if (user && user.feedback && user.feedback.length > 0) {
      setValue("comments", user.feedback[0]?.comments || "");
      setValue("project", user.feedback[0]?.project || "");
      setValue("createdBy", user.feedback[0]?.createdBy || "");
      setValue("exercise", user.feedback[0]?.exercise || "");
      setValue("focusPoints", user.feedback[0]?.focusPoints?.join(", ") || "");
    }
  }, [user, setValue]);

  const onSubmit = async (formData) => {
    setIsLoading(true);
    const newFeedback = {
      comments: formData.comments,
      createdBy: loggedInUser.user._id,
      project:
        formData.project && formData.project !== "" ? formData.project : null,
      exercise:
        formData.exercise && formData.exercise !== ""
          ? formData.exercise
          : null,
      focusPoints: formData.focusPoints.split(",").map((point) => point.trim()),
      date: new Date().toISOString(),
    };

    try {
      await updateUserFeedback(id, newFeedback);
      refetch();
      setShowForm(false);
    } catch (error) {
      console.error("Fejl ved tilføjelse af feedback:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2>Opret feedback</h2>
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
        <h5>Feedback</h5>
        <textarea
          name='comments'
          placeholder='Skriv feedback her...'
          {...register("comments")}
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
          buttonText='Tilføj feedback'
          type='submit'
          background={isEditMode ? "blue" : "green"}
        />
      </div>
    </form>
  );
};

export default FeedbackForm;
