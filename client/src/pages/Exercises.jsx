import { Outlet, useNavigate } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import { useAuthContext } from "../context/useAuthContext";
import useFetchExercises from "../hooks/useFetchExercises";
import Exercise from "../components/Exercise";

const Exercises = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { exercises, refetch } = useFetchExercises();

  const handleAdd = () => {
    navigate("/exercises/add");
  };

  return (
    <article className='exercises'>
      <div>
        <h2>Øvelser</h2>

        {exercises &&
          exercises.map((exercise) => (
            <Exercise key={exercise._id} exercise={exercise} />
          ))}

        {user?.role === "admin" && (
          <>
            <MdAdd size={50} onClick={handleAdd} />
            <Outlet context={{ refetch }} />
          </>
        )}
      </div>
    </article>
  );
};

export default Exercises;
