import { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import ActionButton from "../button/ActionButton";
import styles from "./form.module.css";
import { useAlert } from "../../context/Alert";
import useFetchTeams from "../../hooks/useFetchTeams";

const TeamForm = ({ isEditMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { createTeam, teams, editTeam } = useFetchTeams();
  const { showSuccess, showError } = useAlert();
  const { refetch } = useOutletContext();
  const { id } = useParams();
  const team = teams?.find((e) => e._id === id);
  const navigate = useNavigate();
  const formRef = useRef();
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: formRef.current?.offsetTop, behavior: "smooth" });
    }, 100);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      team: team?.team || "",
      description: team?.description || "",
    },
  });

  useEffect(() => {
    if (team) {
      setValue("team", team.team);
      setValue("description", team.description);
    }
  }, [team, setValue]);

  const onSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("team", formData.team);
      data.append("description", formData.description);

      if (isEditMode && id) {
        data.append("id", id);
      }
      const response = isEditMode
        ? await editTeam(data)
        : await createTeam(data);

      if (response.status === "ok") {
        showSuccess(isEditMode ? "Team opdateret!" : "Team oprettet!");
        await refetch();
      } else {
        showError("Fejl ved oprettelse af team:");
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("Fejl ved tilføjelse af team:", error);
    } finally {
      setIsLoading(false);
      navigate(-1);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div ref={formRef}>
      <h2>{isEditMode ? "Rediger team" : "Opret nyt team"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label>
          <input
            type='text'
            placeholder='Hold'
            {...register("team", { required: "Teamet skal have en titel" })}
          />
          {errors.team && <p>{errors.team.message}</p>}
        </label>

        <label>
          <input
            type='text'
            placeholder='Beskrivelse'
            {...register("description")}
          />
          {errors.description && <p>{errors.description.message}</p>}
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
            buttonText={team ? "Opdater team" : "Tilføj team"}
            type='submit'
            background={isEditMode ? "orange" : "green"}
          />
        </div>
      </form>
    </div>
  );
};

export default TeamForm;
