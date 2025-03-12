import { useState, useEffect } from "react";
import { apiUrl } from "../apiUrl";
import { useAuthContext } from "../context/useAuthContext";

const useFetchTeamUsers = (teamId) => {
  const [team, setTeam] = useState(null);
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();

  const sortUsersByName = (usersArray) => {
    return usersArray.sort((a, b) => a.name.localeCompare(b.name));
  };

  useEffect(() => {
    if (!teamId || !token) return;

    const fetchTeamData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/user/team/${teamId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setTeam(data.team);
          setUsers(data.users);

          const sortedStudents = sortUsersByName(
            data.users.filter((user) => user.role === "student")
          );
          const sortedTeachers = sortUsersByName(
            data.users.filter((user) => user.role === "teacher")
          );
          const sortedGuests = sortUsersByName(
            data.users.filter((user) => user.role === "guest")
          );

          setStudents(sortedStudents);
          setTeachers(sortedTeachers);
          setGuests(sortedGuests);
        } else {
          throw new Error(data.message || "Kunne ikke hente team og brugere");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId, token]);

  return { team, users, students, teachers, guests, isLoading, error };
};

export default useFetchTeamUsers;
