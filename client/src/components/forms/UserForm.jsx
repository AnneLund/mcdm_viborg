import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import ActionButton from "../button/ActionButton";
import styles from "./form.module.css";
import { useAlert } from "../../context/Alert";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import useFetchTeams from "../../hooks/useFetchTeams";

const UserForm = ({ isEditMode }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { createUser, users, updateUser } = useFetchUsers();
  const { teams } = useFetchTeams();
  const { showSuccess, showError } = useAlert();
  const { refetch } = useOutletContext();
  const { id } = useParams();
  const user = users?.find((p) => p._id === id);
  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objUrl = window.URL.createObjectURL(file);
      setImage(objUrl);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      team: user?.team || "",
      role: user?.role || "",
      password: "",
      comments: "",
      focusPoints: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("team", user.team);
      setValue("role", user.role || "");
      setValue("comments", user.feedback?.[0]?.comments || "");
      setValue(
        "focusPoints",
        user.feedback?.[0]?.focusPoints?.join(", ") || ""
      );
    }
  }, [user, setValue]);

  const onSubmit = async (formData) => {
    setIsLoading(true);
    const data = new FormData();

    // if (isEditMode && id) {
    //   data.append("id", id);
    // }

    if (selectedFile) {
      data.append("picture", selectedFile);
    }

    Object.keys(formData).forEach((key) => {
      if (key !== "id") {
        data.append(key, formData[key]);
      }
    });

    if (formData.comments || formData.focusPoints) {
      data.append(
        "feedback",
        JSON.stringify([
          {
            comments: formData.comments,
            focusPoints: formData.focusPoints
              .split(",")
              .map((point) => point.trim()),
            date: new Date().toISOString(),
          },
        ])
      );
    }

    try {
      isEditMode ? await updateUser(id, data) : await createUser(data, true);
      await refetch();
      navigate(-1);
    } catch (error) {
      console.error("Fejl ved oprettelse af bruger:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='form'>
      <h2>{isEditMode ? "Rediger bruger" : "Opret ny bruger"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label>
          <h3>Billede</h3>
          <img src={image} alt='' width='100' />
          <input type='file' name='image' onChange={onImageChange} />
        </label>
        <label>
          <input
            type='text'
            name='name'
            placeholder='Navn'
            {...register("name", { required: "Brugeren skal have et navn" })}
          />
          {errors.name && <p>{errors.name?.message}</p>}
        </label>
        <label>
          <input
            type='text'
            name='email'
            placeholder='Email'
            {...register("email", {
              required: "Brugeren skal have en email",
            })}
          />
          {errors.email && <p>{errors.email?.message}</p>}
        </label>
        <label>
          <input
            type='password'
            name='password'
            placeholder='Password'
            {...register("password", { required: "Password er påkrævet" })}
          />
          {errors.password && <p>{errors.password?.message}</p>}
        </label>
        <label>
          <select name='team' {...register("team")} onChange={handleTeamChange}>
            <option value=''>Vælg hold</option>
            {teams.map((team) => (
              <option value={team.team} key={team._id}>
                {team.team}
              </option>
            ))}
          </select>
          {errors.role && <p>{errors.role?.message}</p>}
        </label>

        <label>
          <select
            name='role'
            {...register("role", { required: "Brugeren skal have en rolle" })}
            onChange={handleRoleChange}>
            <option value=''>Vælg rolle</option>
            <option value='student'>Studerende</option>
            <option value='admin'>Underviser</option>
            <option value='teacher'>Lærer</option>
            <option value='guest'>Gæst</option>
          </select>
          {errors.role && <p>{errors.role?.message}</p>}
        </label>
        {isEditMode && (
          <>
            <label>
              <h3>Feedback</h3>
              <textarea
                name='comments'
                placeholder='Skriv feedback her...'
                {...register("comments")}
              />
            </label>

            <label>
              <h3>Fokusområder</h3>
              <input
                type='text'
                name='focusPoints'
                placeholder='Skriv fokuspunkter, adskilt med komma'
                {...register("focusPoints")}
              />
            </label>
          </>
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
            buttonText={isEditMode ? "Opdater bruger" : "Tilføj ny bruger"}
            type='submit'
            background={isEditMode ? "orange" : "green"}
          />
        </div>
      </form>
    </div>
  );
};

export default UserForm;
