import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import ActionButton from "../button/ActionButton";
import styles from "./form.module.css";
import { useAlert } from "../../context/Alert";
import useFetchEvents from "../../hooks/useFetchEvents";

const EventForm = ({ isEditMode, event, setShowEventForm, refetch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const { createEvent, updateEvent } = useFetchEvents();
  const { showSuccess, showError } = useAlert();
  const eventId = event?._id;

  useEffect(() => {
    if (window.location.hash === "#form") {
      document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

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
      exam: event?.exam || false,
      file: event?.file || "",
    },
  });

  useEffect(() => {
    if (event) {
      setValue("event", event.event);
      setValue("date", event.date);
      setValue("time", event.time);
      setValue("file", event.file);
      setValue("description", event.description);
    }
  }, [event, setValue]);

  const handleSelectPresentation = (event) => {
    setValue("presentation", event.target.value === "true");
  };
  const handleSelectExam = (event) => {
    setValue("exam", event.target.value === "true");
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
      data.append("exam", formData.exam ? "true" : "false");

      if (isEditMode && eventId) {
        data.append("id", eventId);
      }

      if (file) {
        data.append("file", file);
      }

      const response = isEditMode
        ? await updateEvent(eventId, data)
        : await createEvent(data);

      if (response.status === "ok") {
        await refetch();
        showSuccess(isEditMode ? "Event opdateret!" : "Event oprettet!");
      } else {
        showError("Fejl ved oprettelse af event:");
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("Fejl ved tilføjelse af event:", error);
    } finally {
      setShowEventForm((prev) => !prev);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} id='form'>
        <h2>{isEditMode ? "Rediger Event" : "Opret nyt Event"}</h2>
        <label>
          <input type='text' placeholder='Titel' {...register("event")} />
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
            onChange={handleSelectPresentation}
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

        <label>
          <h3>Eksamen</h3>
          <select
            onChange={handleSelectExam}
            defaultValue={event?.exam ? "true" : "false"}>
            {isEditMode ? (
              <>
                <option value={event?.exam.toString()} disabled>
                  {event?.exam ? "Ja" : "Nej"}
                </option>
                {!event?.exam && <option value='true'>Ja</option>}
                {event?.exam && <option value='false'>Nej</option>}
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

        {event?.exam && (
          <label>
            <h3>Eksamensplan</h3>
            <input type='file' onChange={(e) => setFile(e.target.files[0])} />
          </label>
        )}

        <div id='buttons'>
          <ActionButton
            onClick={() => {
              setShowEventForm(false);
            }}
            buttonText='Annuller'
            cancel={true}
          />
          <ActionButton
            buttonText={event ? "Opdater Event" : "Tilføj Event"}
            type='submit'
            background='green'
          />
        </div>
      </form>
    </>
  );
};

export default EventForm;
