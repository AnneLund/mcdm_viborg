import { useState } from "react";
import useFetchExercises from "../../hooks/useFetchExercises";
import ActionButton from "../button/ActionButton";
import Exercise from "../Exercise";
import styles from "./taskAssignment.module.css";

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
  const assignTasksToGroups = () => {
    if (selectedExercises.length === 0) return;

    let distributedTasks = {};
    const groupCount = groups.length;

    selectedExercises.forEach((exercise, index) => {
      const groupIndex = index % groupCount;
      if (!distributedTasks[groupIndex]) {
        distributedTasks[groupIndex] = [];
      }
      distributedTasks[groupIndex].push(exercise);
    });

    setAssignedTasks(distributedTasks);
  };

  return (
    <div>
      <h3>Vælg opgaver</h3>
      <ul>
        {exercises.map((exercise, index) => (
          <li key={index}>
            <label>
              <input
                type='checkbox'
                checked={selectedExercises.includes(exercise)}
                onChange={() => handleExerciseSelection(exercise)}
              />
              {exercise.title}
            </label>
          </li>
        ))}
      </ul>

      <ActionButton
        onClick={assignTasksToGroups}
        background='green'
        buttonText='Tildel opgaver'
      />

      {Object.keys(assignedTasks).length > 0 && (
        <>
          <h3>Opgaver fordelt i grupper</h3>
          {groups.map((group, index) => (
            <div className={styles.groupBox} key={index}>
              <div className='group-info'>
                <h4>Gruppe {index + 1}</h4>
                <ul>
                  {group.map((student, i) => (
                    <li key={i}>{student}</li>
                  ))}
                </ul>
              </div>

              <div className='task-info'>
                <strong>Opgaver:</strong>
                <ul>
                  {(assignedTasks[index] || []).map((task, i) => (
                    <Exercise key={task._id} exercise={task} />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TaskAssignment;
