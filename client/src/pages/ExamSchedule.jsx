import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useAlert } from "../context/Alert";
import useFetchEvents from "../hooks/useFetchEvents";
import { downloadExamPDF } from "../helpers/downloadExamPdf";

const ExamSchedule = ({ event }) => {
  const [newStudent, setNewStudent] = useState("");
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
  const [schedule, setSchedule] = useState([]);
  const [numDays, setNumDays] = useState(1);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [remainingStudents, setRemainingStudents] = useLocalStorage(
    "remainingStudents",
    []
  );
  const pdfRef = useRef();
  const { showSuccess } = useAlert();
  const { updateEvent } = useFetchEvents();

  useEffect(() => {
    if (isDownloadingPDF && pdfRef.current) {
      setTimeout(
        () =>
          downloadExamPDF({
            pdfRef,
            updateEvent,
            showSuccess,
            event,
          }),
        300
      );
    }
  }, [isDownloadingPDF]);
  const dayNames = {
    1: "Mandag",
    2: "Tirsdag",
    3: "Onsdag",
    4: "Torsdag",
    5: "Fredag",
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

  const generateSchedule = () => {
    const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
    const studentsPerDay = Math.ceil(shuffledStudents.length / numDays);
    let currentDay = 1;
    let currentHour = 9;
    let currentSchedule = [];

    shuffledStudents.forEach((student, index) => {
      if (currentHour === 12) currentHour = 13; // Spring frokostpausen over
      if (index % studentsPerDay === 0 && index !== 0) {
        currentDay++;
        currentHour = 9;
      }

      if (currentDay > numDays) return;

      currentSchedule.push({
        name: student,
        day: dayNames[currentDay],
        time: `${currentHour}:00`,
      });

      currentHour++;
    });

    console.log("Plan genereret:", currentSchedule.length > 0);

    setSchedule(currentSchedule);
    setPlanGenerated(true);
  };

  const resetSchedule = () => {
    setSchedule([]);
    setPlanGenerated(false);
    setRemainingStudents([]);
  };

  return (
    <div>
      <h3>Tilføj elever</h3>
      <ul>
        {students.map((student, index) => (
          <li key={index}>
            {student}{" "}
            <button onClick={() => removeStudent(student)}>Fjern</button>
          </li>
        ))}
      </ul>
      <input
        type='text'
        value={newStudent}
        onChange={(e) => setNewStudent(e.target.value)}
        placeholder='Tilføj elev'
      />
      <button onClick={addStudent}>Tilføj</button>

      <h3>Vælg antal eksamensdage</h3>
      <input
        type='number'
        min='1'
        max='5'
        value={numDays}
        onChange={(e) => setNumDays(Number(e.target.value))}
      />

      <button onClick={generateSchedule}>Generer eksamensplan</button>

      {planGenerated && (
        <>
          <h3>Eksamensplan</h3>
          <ul>
            {schedule.map((item, index) => (
              <li key={index}>
                {item.day} kl. {item.time} - {item.name}
              </li>
            ))}
          </ul>

          <button onClick={resetSchedule}>Nulstil plan</button>
          <button onClick={() => setIsDownloadingPDF(true)}>
            Download PDF
          </button>

          {/* Skjult PDF-generering */}
          <div
            ref={pdfRef}
            style={{
              position: "absolute",
              left: "-9999px",
              top: "-9999px",
              width: "100%",
              backgroundColor: "#fff",
              fontFamily: "Arial, sans-serif",
            }}>
            <h2>Eksamensplan</h2>
            <ul>
              {schedule.map((item, index) => (
                <li key={index}>
                  {item.day} kl. {item.time} - {item.name}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ExamSchedule;
