import { useState, useRef, useEffect } from "react";
import ActionButton from "../components/button/ActionButton";
import { useAlert } from "../context/Alert";
import Loading from "../components/Loading/Loading";
import useFetchEvents from "../hooks/useFetchEvents";
import { useLocalStorage } from "@uidotdev/usehooks";
import { downloadPDF } from "../helpers/downloadPdf.js";
import { InputContainer } from "../styles/formStyles.jsx";
import { Article, Section } from "../styles/containerStyles.jsx";
import { List, ListItem } from "../styles/listStyles.jsx";
import { ButtonContainer } from "../styles/buttonStyles.jsx";

const GroupGenerator = () => {
  const [newStudent, setNewStudent] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess } = useAlert();

  const [students, setStudents] = useState([
    "Laura",
    "Adi",
    "Serhii",
    "Nureddin",
    "Thomas",
    "Elsbet",
    "Mark",
    "Mathias",
    "Maria",
    "Emil",
    "Marcus",
    "Juliya",
    "Gabriel",
  ]);

  // Inddel i grupper
  const [groups, setGroups] = useState([]);

  const divideIntoGroups = () => {
    if (students.length === 0) return;

    const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
    let groupSize = 3;
    let newGroups = [];

    if (shuffledStudents.length <= 5) {
      // Hvis der kun er 5 elever, lav en 2'er og en 3'er i stedet for en 3'er og en 2'er
      newGroups.push(shuffledStudents.slice(0, 2));
      newGroups.push(shuffledStudents.slice(2));
    } else {
      // Standard gruppering med 3 personer pr. gruppe
      for (let i = 0; i < shuffledStudents.length; i += groupSize) {
        newGroups.push(shuffledStudents.slice(i, i + groupSize));
      }

      // Hvis sidste gruppe kun har 1 person, fordel dem til andre grupper
      if (
        newGroups.length > 1 &&
        newGroups[newGroups.length - 1].length === 1
      ) {
        const lastStudent = newGroups.pop()[0]; // Fjern den sidste gruppe og tag personen
        newGroups[0].push(lastStudent);
      }
    }

    setGroups(newGroups);
  };

  const addStudent = () => {
    if (newStudent.trim() !== "" && !students.includes(newStudent)) {
      setStudents([...students, newStudent]);
      setNewStudent("");
    }
  };

  const removeStudent = (name) => {
    setStudents(students.filter((student) => student !== name));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Article>
      <Section>
        <h3>Tilføj elever</h3>
        <List>
          {students.map((student, index) => (
            <ListItem key={index}>
              {student}{" "}
              <ActionButton
                onClick={() => removeStudent(student)}
                actionType='delete'
                background='red'
              />
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
              <ActionButton
                onClick={addStudent}
                actionType='add'
                background='green'
              />
            </InputContainer>
          </ListItem>
        </List>
        <ActionButton
          onClick={divideIntoGroups}
          buttonText='👥 Opdel i grupper'
        />
        {groups.length > 0 && (
          <>
            <h3>Grupper</h3>
            {groups.map((group, index) => (
              <div key={index}>
                <h4>Gruppe {index + 1}</h4>
                <List>
                  {group.map((student, i) => (
                    <ListItem key={i}>{student}</ListItem>
                  ))}
                </List>
              </div>
            ))}
          </>
        )}
      </Section>
    </Article>
  );
};

export default GroupGenerator;
