import { useEffect, useState } from "react";
import ActionButton from "../components/button/ActionButton";
import { useAlert } from "../context/Alert";
import Loading from "../components/Loading/Loading";
import { InputContainer } from "../styles/formStyles.jsx";
import { ColumnContainer, Section } from "../styles/containerStyles.jsx";
import { List, ListItem } from "../styles/listStyles.jsx";
import TaskAssignment from "../components/taskAssignment/TaskAssignment.jsx";
import { useParams } from "react-router-dom";
import useFetchTeamUsers from "../hooks/useFetchTeamUsers.jsx";
import { Add, Close, Remove } from "../components/icons/Icons.jsx";

const GroupGenerator = () => {
  const [newStudent, setNewStudent] = useState("");
  const [showAssignment, setShowAssignment] = useState(false);
  const { id } = useParams();
  const { students: apiStudents, isLoading, error } = useFetchTeamUsers(id);
  const [students, setStudents] = useState([]);

  const { showSucces, showError } = useAlert();

  // 🔹 Opdater students med API-data, men bevar tilføjede elever
  useEffect(() => {
    if (apiStudents && apiStudents.length > 0) {
      setStudents((prevStudents) => {
        // 🔹 Sørg for, at vi ikke tilføjer duplikater, hvis de allerede findes
        const existingNames = new Set(prevStudents.map((s) => s.name));
        const newStudents = apiStudents.filter(
          (s) => !existingNames.has(s.name)
        );
        return [...prevStudents, ...newStudents];
      });
    }
  }, [apiStudents]);

  // 🔹 Gruppedannelse
  const [groups, setGroups] = useState([]);

  const divideIntoGroups = () => {
    if (students.length === 0) return;
    const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
    let groupSize = 3;
    let newGroups = [];

    if (shuffledStudents.length <= 5) {
      newGroups.push(shuffledStudents.slice(0, 2));
      newGroups.push(shuffledStudents.slice(2));
    } else {
      for (let i = 0; i < shuffledStudents.length; i += groupSize) {
        newGroups.push(shuffledStudents.slice(i, i + groupSize));
      }

      if (
        newGroups.length > 1 &&
        newGroups[newGroups.length - 1].length === 1
      ) {
        const lastStudent = newGroups.pop()[0];
        newGroups[0].push(lastStudent);
      }
    }
    setGroups(newGroups);
  };

  // 🔹 Tilføj elev (som et objekt)
  const addStudent = () => {
    if (
      newStudent.trim() !== "" &&
      !students.some((s) => s.name === newStudent)
    ) {
      setStudents([
        ...students,
        { name: newStudent, email: "", role: "Student" },
      ]);
      setNewStudent("");
    }
  };

  // 🔹 Slet elev
  const removeStudent = (studentToRemove) => {
    setStudents(
      students.filter((student) => student.name !== studentToRemove.name)
    );
  };

  // 🔹 Opgavetildeling
  const handleAssignmentButtonClick = () => {
    if (groups.length === 0) {
      showError("Ingen grupper fundet. Opret grupper først.");
      return;
    }
    setShowAssignment(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {showAssignment ? (
        <TaskAssignment groups={groups} />
      ) : (
        <Section>
          {groups.length > 0 ? (
            <ColumnContainer>
              <header>
                <h3>Grupper</h3>
                <ActionButton
                  buttonText='Tildel opgaver'
                  background='blue'
                  onClick={handleAssignmentButtonClick}
                />
              </header>
              {groups.map((group, index) => (
                <div key={index}>
                  <List>
                    <h4>Gruppe {index + 1}</h4>
                    {group.map((student, i) => (
                      <ListItem key={i}>{student.name}</ListItem>
                    ))}
                  </List>
                </div>
              ))}
            </ColumnContainer>
          ) : (
            <>
              <h3>Tilføj/fjern elever</h3>
              <List>
                {students?.map((student, index) => (
                  <ListItem key={index}>
                    {student.name}

                    <Remove onClick={() => removeStudent(student)} />
                  </ListItem>
                ))}
                <ListItem>
                  <InputContainer>
                    <input
                      type='text'
                      value={newStudent}
                      onChange={(e) => setNewStudent(e.target.value)}
                      placeholder='Tilføj elevens navn'
                    />

                    <Add onClick={addStudent} />
                  </InputContainer>
                </ListItem>

                <ActionButton
                  onClick={divideIntoGroups}
                  buttonText='👥 Opdel i grupper'
                  background='green'
                />
              </List>
            </>
          )}
        </Section>
      )}
    </>
  );
};

export default GroupGenerator;
