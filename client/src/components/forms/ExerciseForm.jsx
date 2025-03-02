import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import ActionButton from "../button/ActionButton";
import styles from "./form.module.css";
import useFetchExercises from "../../hooks/useFetchExercises";
import { useAlert } from "../../context/Alert";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

const ExerciseForm = ({ isEditMode }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { createExercise, exercises, editExercise } = useFetchExercises();
  const { showSuccess, showError } = useAlert();
  const { refetch } = useOutletContext();
  const { id } = useParams();
  const exercise = exercises?.find((p) => p._id === id);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: exercise?.title || "",
      description: exercise?.description || "",
    },
  });

  useEffect(() => {
    if (exercise) {
      setValue("title", exercise.title);
      setValue("description", exercise.description);
    }
  }, [exercise, setValue]);

  const onSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);

      if (isEditMode && id) {
        data.append("id", id);
      }
      if (file) {
        data.append("file", file, file.name); // Fil + navn til backend
      }

      console.log("FormData-indhold:", Array.from(data.entries())); // Debug log

      const response = isEditMode
        ? await editExercise(data)
        : await createExercise(data);

      if (response.status === "ok") {
        showSuccess("Øvelsen er oprettet med succes!");
        if (isEditMode) {
          showSuccess("Opdateret!", "Øvelsen er opdateret med succes!");
        }
        await refetch();
      } else {
        showError("Fejl ved oprettelse af øvelse:");
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("Fejl ved tilføjelse af øvelse:", error);
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
      <h2>{isEditMode ? "Rediger øvelse" : "Opret nyt øvelse"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label>
          <input
            type='text'
            placeholder='Titel'
            {...register("title", { required: "Øvelseet skal have en titel" })}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </label>

        <label>
          <input
            type='text'
            placeholder='Beskrivelse'
            {...register("description")}
          />
        </label>

        <label>
          <h3>Fil</h3>
          <input type='file' onChange={(e) => setFile(e.target.files[0])} />
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
            buttonText={exercise ? "Opdater øvelse" : "Tilføj Øvelse"}
            type='submit'
            background={isEditMode ? "orange" : "green"}
          />
        </div>
      </form>
    </div>
  );
};

export default ExerciseForm;
