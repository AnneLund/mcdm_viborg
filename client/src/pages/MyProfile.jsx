import { useAuthContext } from "../context/useAuthContext";
import { Article } from "../styles/containerStyles";
import StudentPanel from "./StudentPanel";
import TeacherPanel from "./TeacherPanel";

const MyProfile = () => {
  const { user } = useAuthContext();
  return (
    <Article>
      <h1>Min Profil</h1>

      {user.role === "student" ? <StudentPanel /> : <TeacherPanel />}
    </Article>
  );
};

export default MyProfile;
