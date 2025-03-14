import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import ActionButton from "../button/ActionButton";
import styles from "./form.module.css";
import { useAlert } from "../../context/Alert";
import { useFetchUsers } from "../../hooks/useFetchUsers";

const StudentFeedbackForm = ({
  isEditMode,
  setShowForm,
  existingFeedback,
  teacher,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserFeedback, refetch } = useFetchUsers();
  const { showSuccess, showError } = useAlert();
  const userId = teacher._id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues:
      isEditMode && existingFeedback
        ? {
            comments: existingFeedback.comments || "",
          }
        : {
            comments: "",
          },
  });

  useEffect(() => {
    if (
      isEditMode &&
      teacher &&
      teacher.feedback &&
      teacher.feedback.length > 0
    ) {
      setValue("comments", teacher.feedback[0]?.comments || "");
    }
  }, [teacher, existingFeedback, setValue]);

  const onSubmit = async (formData) => {
    setIsLoading(true);

    // Opbygning af feedback objekt baseret på formular input
    const feedbackData = {
      comments: formData.comments || "",
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
        <h5>Kommentarer</h5>
        <textarea
          name='comments'
          placeholder='Skriv feedback her...'
          {...register("comments")}
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

export default StudentFeedbackForm;
