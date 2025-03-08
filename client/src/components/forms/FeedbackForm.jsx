import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import ActionButton from "../button/ActionButton";
import styles from "./form.module.css";
import { useAlert } from "../../context/Alert";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import useFetchProjects from "../../hooks/useFetchProjects";
import useFetchExercises from "../../hooks/useFetchExercises";

const FeedbackForm = ({ isEditMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { users, updateUserFeedback } = useFetchUsers();
  const { projects } = useFetchProjects();
  const { exercises } = useFetchExercises();
  const { showSuccess, showError } = useAlert();
  const { refetch } = useOutletContext();
  const { id } = useParams();
  const user = users?.find((p) => p._id === id);
  const navigate = useNavigate();

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
      focusPoints: user?.feedback?.[0]?.focusPoints?.join(", ") || "",
    },
  });

  useEffect(() => {
    if (user && user.feedback && user.feedback.length > 0) {
      setValue("comments", user.feedback[0]?.comments || "");
      setValue("project", user.feedback[0]?.project || "");
      setValue("exercise", user.feedback[0]?.exercise || "");
      setValue("focusPoints", user.feedback[0]?.focusPoints?.join(", ") || "");
    }
  }, [user, setValue]);

  const onSubmit = async (formData) => {
    setIsLoading(true);

    // Ny feedback-indgang
    const newFeedback = {
      comments: formData.comments,
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
      await updateUserFeedback(id, newFeedback); // Sender kun én feedback
      await refetch();
      navigate(-1);
    } catch (error) {
      console.error("Fejl ved tilføjelse af feedback:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProject = (event) => {
    setValue("project", event.target.value);
  };

  const handleSelectExercise = (event) => {
    setValue("exercise", event.target.value);
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
            navigate(-1);
          }}
          buttonText='Annuller'
          cancel={true}
        />
        <ActionButton
          buttonText={isEditMode ? "Opdater feedback" : "Tilføj feedback"}
          type='submit'
          background={isEditMode ? "orange" : "green"}
        />
      </div>
    </form>
  );
};

export default FeedbackForm;
