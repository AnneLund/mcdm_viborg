import { useState } from "react";
import useFetchExercises from "../../hooks/useFetchExercises";
import ActionButton from "../button/ActionButton";
import Exercise from "../Exercise";
import styles from "./taskAssignment.module.css";
import { List, ListItem } from "../../styles/listStyles";
import { Section } from "../../styles/containerStyles";

const TaskAssignment = ({ groups }) => {
  const { exercises } = useFetchExercises();
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState({});

  // Håndter valg af opgaver via checkboxes
  const handleExerciseSelection = (exercise) => {
    setSelectedExercises((prevSelected) =>
      prevSelected.includes(exercise)
        ? prevSelected.filter((e) => e !== exercise)
        : [...prevSelected, exercise]
    );
  };

  // Fordel opgaverne ligeligt mellem grupperne
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const assignTasksToGroups = () => {
    if (selectedExercises.length === 0) return;

    const shuffledExercises = shuffleArray(selectedExercises);
    let distributedTasks = {};
    const groupCount = groups.length;

    shuffledExercises.forEach((exercise, index) => {
      const groupIndex = index % groupCount;
      if (!distributedTasks[groupIndex]) {
        distributedTasks[groupIndex] = [];
      }
      distributedTasks[groupIndex].push(exercise);
    });

    setAssignedTasks(distributedTasks);
  };

  return (
    <Section>
      <h3>Vælg opgaver</h3>
      <List>
        {exercises.map((exercise, index) => (
          <ListItem key={index}>
            <label>
              <input
                type='checkbox'
                checked={selectedExercises.includes(exercise)}
                onChange={() => handleExerciseSelection(exercise)}
              />
              {exercise.title}
            </label>
          </ListItem>
        ))}

        <ActionButton
          onClick={assignTasksToGroups}
          background='green'
          buttonText='Tildel opgaver'
        />
      </List>

      {Object.keys(assignedTasks).length > 0 && (
        <>
          <h3>Opgaver fordelt i grupper</h3>
          {groups.map((group, index) => (
            <div className={styles.groupBox} key={index}>
              <div className='group-info'>
                <h4>Gruppe {index + 1}</h4>
                <List>
                  {group.map((student, i) => (
                    <ListItem key={i}>{student.name}</ListItem>
                  ))}
                </List>
              </div>

              <div className='task-info'>
                <strong>Opgaver:</strong>
                <List>
                  {(assignedTasks[index] || []).map((task, i) => (
                    <Exercise key={task._id} exercise={task} />
                  ))}
                </List>
              </div>
            </div>
          ))}
        </>
      )}
    </Section>
  );
};

export default TaskAssignment;
