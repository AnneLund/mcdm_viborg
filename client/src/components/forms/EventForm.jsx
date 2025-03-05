import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import ActionButton from "../button/ActionButton";
import styles from "./form.module.css";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useAlert } from "../../context/Alert";
import useFetchEvents from "../../hooks/useFetchEvents";

const EventForm = ({ isEditMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const { createEvent, events, editEvent } = useFetchEvents();
  const { showSuccess, showError } = useAlert();
  const { refetch } = useOutletContext();
  const { id } = useParams();
  const event = events?.find((e) => e._id === id);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      event: event?.event || "",
      description: event?.description || "",
      date: event?.date || "",
      presentation: event?.presentation || false,
      file: event?.file || "",
    },
  });

  useEffect(() => {
    if (event) {
      setValue("event", event.event);
      setValue("date", event.date);
      setValue("time", event.ftime);
      setValue("file", event.file);
      setValue("description", event.description);
    }
  }, [event, setValue]);

  const handleSelectChange = (event) => {
    setValue("presentation", event.target.value === "true");
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("event", formData.event);
      data.append("description", formData.description);
      data.append("date", formData.date);
      data.append("time", formData.time);
      data.append("presentation", formData.presentation ? "true" : "false");

      if (isEditMode && id) {
        data.append("id", id);
      }

      if (file) {
        data.append("file", file);
      }

      const response = isEditMode
        ? await editEvent(data)
        : await createEvent(data);

      if (response.status === "ok") {
        showSuccess(isEditMode ? "Event opdateret!" : "Event oprettet!");
        await refetch();
      } else {
        showError("Fejl ved oprettelse af event:");
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("Fejl ved tilføjelse af event:", error);
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
      <h2>{isEditMode ? "Rediger Event" : "Opret nyt Event"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label>
          <input
            type='text'
            placeholder='Titel'
            {...register("event", { required: "Eventet skal have en titel" })}
          />
          {errors.event && <p>{errors.event.message}</p>}
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
          <input
            type='date'
            {...register("date", { required: "Dato er påkrævet" })}
          />
          {errors.date && <p>{errors.date.message}</p>}
        </label>

        <label>
          <input type='text' placeholder='Tidspunkt' {...register("time")} />
          {errors.time && <p>{errors.time.message}</p>}
        </label>

        <label>
          <h3>Fremlæggelse</h3>
          <select
            onChange={handleSelectChange}
            defaultValue={event?.presentation ? "true" : "false"}>
            {isEditMode ? (
              <>
                <option value={event?.presentation.toString()} disabled>
                  {event?.presentation ? "Ja" : "Nej"}
                </option>
                {!event?.presentation && <option value='true'>Ja</option>}
                {event?.presentation && <option value='false'>Nej</option>}
              </>
            ) : (
              <>
                <option value='false'>Nej</option>
                <option value='true'>Ja</option>
              </>
            )}
          </select>
        </label>

        {event?.presentation && (
          <label>
            <h3>Fremlæggelsesplan</h3>
            <input type='file' onChange={(e) => setFile(e.target.files[0])} />
          </label>
        )}

        <div id='buttons'>
          <ActionButton
            onClick={() => {
              navigate(-1);
            }}
            buttonText='Annuller'
            cancel={true}
          />
          <ActionButton
            buttonText={event ? "Opdater Event" : "Tilføj Event"}
            type='submit'
            background={isEditMode ? "orange" : "green"}
          />
        </div>
      </form>
    </div>
  );
};

export default EventForm;
