import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import ActionButton from "../button/ActionButton";
import styles from "./form.module.css";
import { useAlert } from "../../context/Alert";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import useFetchTeams from "../../hooks/useFetchTeams";

const UserForm = ({ isEditMode, refetch, user, setShowForm }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { createUser, users, updateUser } = useFetchUsers();
  const { teams } = useFetchTeams();
  const { showSuccess, showError } = useAlert();

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

    console.log("Form Data før tilføjelse:", formData);

    if (selectedFile) {
      data.append("picture", selectedFile);
    }

    Object.keys(formData).forEach((key) => {
      if (key !== "id") {
        data.append(key, formData[key]);
      }
    });

    console.log("FormData objekt:", Object.fromEntries(data.entries())); // Debugging af hvad der bliver sendt

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
      isEditMode
        ? await updateUser(user._id, data)
        : await createUser(data, true);
      await refetch();
      setShowForm(false);
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
      <h2>{isEditMode ? `Rediger ${user?.name}` : "Opret ny bruger"}</h2>
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
            <option value='admin'>Admin</option>
            <option value='teacher'>Underviser</option>
            <option value='guest'>Gæst</option>
          </select>
          {errors.role && <p>{errors.role?.message}</p>}
        </label>
        {/* {isEditMode && (
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
        )} */}

        <div id='buttons'>
          <ActionButton
            onClick={() => {
              setShowForm(false);
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
