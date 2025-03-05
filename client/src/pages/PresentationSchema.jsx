import { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ActionButton from "../components/button/ActionButton";
import styled from "styled-components";
import { apiUrl } from "../apiUrl";
import { useAlert } from "../context/Alert";
import Loading from "../components/Loading/Loading";
import useFetchEvents from "../hooks/useFetchEvents";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";

const PresentationSchema = ({ event }) => {
  const [newStudent, setNewStudent] = useState("");
  const pdfRef = useRef();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const dayNames = {
    1: "Mandag",
    2: "Tirsdag",
    3: "Onsdag",
    4: "Torsdag",
    5: "Fredag",
  };

  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess } = useAlert();
  const [selectedDay, setSelectedDay] = useState(null);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const { updateEvent } = useFetchEvents();
  const [remainingStudents, setRemainingStudents] = useLocalStorage(
    "remainingStudents",
    []
  );

  const [students, setStudents] = useState(
    remainingStudents.length > 0
      ? remainingStudents
      : [
          "Laura",
          "Adi",
          "Serhii",
          "Nureddin",
          "Thomas",
          "Elsbeth",
          "Mark",
          "Mathias",
          "Maria",
          "Emil",
          "Marcus",
          "Juliya",
          "Gabriel",
        ]
  );

  useEffect(() => {
    if (isDownloadingPDF && pdfRef.current) {
      console.log("✅ pdfRef er nu klar til screenshot:", pdfRef.current);
      setTimeout(() => downloadPDF(), 300);
    }
  }, [isDownloadingPDF]);

  useEffect(() => {
    if (event?.date) {
      const eventDay = new Date(event.date).getDay();

      const weekdayMapping = {
        1: 1, // Mandag → 1
        2: 2, // Tirsdag → 2
        3: 3, // Onsdag → 3
        4: 4, // Torsdag → 4
        5: 5, // Fredag → 5
        6: 1, // Lørdag → Sæt til Mandag
        0: 1, // Søndag → Sæt til Mandag
      };

      const correctedDay = weekdayMapping[eventDay];
      setSelectedDay(correctedDay);
    }
  }, [event]);

  const getWeekdayName = (dayIndex) => {
    const weekdays = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"];
    return weekdays[dayIndex];
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

  const handleButtonClicked = () => {
    const eventDay = new Date(event.date).getDay();
    const weekdayMapping = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 1, // Lørdag → Mandag
      0: 1, // Søndag → Mandag
    };

    const correctedDay = weekdayMapping[eventDay];

    setSelectedDay(correctedDay);
    setRemainingStudents([]);
    localStorage.removeItem("remainingStudents");
    generateSchedule();
    setPlanGenerated(true);
  };

  const generateSchedule = () => {
    const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
    const startTime = 9;
    const endTime = 13;
    const duration = 0.5;
    const timeSlots = [];
    let currentTime = startTime;

    while (currentTime < endTime) {
      const hours = Math.floor(currentTime);
      const minutes = (currentTime % 1) * 60;

      if (hours === 11 && (minutes === 30 || minutes === 45)) {
        currentTime = 12;
        continue;
      }

      const time = `${hours}:${minutes === 0 ? "00" : "30"}`;
      timeSlots.push(time);
      currentTime += duration;
    }

    const assignTimeSlots = (students, day) =>
      students.map((student, index) => ({
        name: student,
        time: timeSlots[index] || "Ingen tid tilbage", // Brug tid kun hvis den eksisterer
        day,
      }));

    const eventDay = new Date(event.date).getDay();

    const matchingDay =
      parseInt(
        Object.keys(dayNames).find(
          (key) => dayNames[key] === getWeekdayName(eventDay)
        )
      ) || 1;

    const firstDay = matchingDay;
    const secondDay = firstDay + 1 > 5 ? 1 : firstDay + 1;

    let newSchedule = [];

    if (shuffledStudents.length <= timeSlots.length) {
      // 🔹 Alle elever kan være på én dag
      newSchedule = [...assignTimeSlots(shuffledStudents, firstDay)];
    } else {
      // 🔹 Fyld første dag helt op, og sæt resten på dag to
      const day1Students = shuffledStudents.slice(0, timeSlots.length);
      const day2Students = shuffledStudents.slice(timeSlots.length);

      newSchedule = [
        ...assignTimeSlots(day1Students, firstDay),
        ...assignTimeSlots(day2Students, secondDay),
      ];
    }

    setSchedule(newSchedule);

    const studentsOnEventDay = newSchedule
      .filter((item) => item.day == matchingDay)
      .map((item) => item.name);

    const uniqueRemainingStudents = [
      ...new Set(
        students.filter((student) => !studentsOnEventDay.includes(student))
      ),
    ];

    setRemainingStudents(uniqueRemainingStudents);
  };

  const downloadPDF = () => {
    if (!pdfRef.current) {
      console.error("Fejl: pdfRef.current er stadig null!");
      return;
    }

    html2canvas(pdfRef.current, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);

        const pdfBlob = pdf.output("blob");
        uploadPDF(pdfBlob);
      })
      .catch((error) => {
        console.error("Fejl i html2canvas:", error);
      });
  };

  const uploadPDF = async (pdfBlob) => {
    const formData = new FormData();
    formData.append("file", pdfBlob, "presentation.pdf");

    try {
      setIsLoading(true);

      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.fileUrl) {
        setFileUrl(data.fileUrl);
        const formData = new FormData();
        formData.append("file", fileUrl);

        await updateEvent(event._id, { file: data.fileUrl });
      } else {
        console.error("Fejl: Ingen fileUrl modtaget");
      }
    } catch (error) {
      console.error("Fejl ved upload:", error);
    } finally {
      setIsLoading(false);
      showSuccess("Gemt!", "PDF blev gemt med succes");
    }
  };

  const handleNewPlan = () => {
    setRemainingStudents([]);
    localStorage.removeItem("remainingStudents");
    setSchedule([]);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Article>
      {!planGenerated ? (
        <>
          <h3>Tilføj elever</h3>
          <StudentList>
            {students.map((student, index) => (
              <StudentItem key={index}>
                {student}{" "}
                <ActionButton
                  onClick={() => removeStudent(student)}
                  actionType='delete'
                  background='red'
                />
              </StudentItem>
            ))}
            <StudentItem>
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
            </StudentItem>
          </StudentList>
          <ActionButton
            onClick={handleButtonClicked}
            buttonText='📅 Lav fremlæggelsesplan'
          />
        </>
      ) : (
        <>
          {schedule.length > 0 ? (
            <>
              {/* 🔹 UI-visning af planen */}
              <Section>
                <h3>Fremlæggelsesplan</h3>
                <h4>{dayNames[selectedDay]}</h4>
                <StudentList>
                  {schedule
                    .filter((item) => !remainingStudents.includes(item.name))
                    .map((item, index) => (
                      <StudentItem
                        key={index}
                        style={{ margin: "10px 0", listStyle: "none" }}>
                        Kl. {item.time} - {item.name}
                      </StudentItem>
                    ))}
                </StudentList>
                <ButtonContainer>
                  <ActionButton
                    onClick={handleNewPlan}
                    buttonText='📅 Lav ny fremlæggelsesplan'
                  />
                  <ActionButton
                    onClick={() => setIsDownloadingPDF(true)}
                    buttonText='📥 Upload plan'
                  />
                </ButtonContainer>
              </Section>

              {/* 🔹 Skjult div til PDF (uden overskydende elever) */}
              <Section
                ref={pdfRef}
                style={{
                  position: "absolute",
                  top: "-10000px",
                  left: "-10000px",
                  width: "100%",
                  padding: "20px",
                  backgroundColor: "#fff",
                  fontFamily: "Arial, sans-serif",
                }}>
                <h3>Fremlæggelsesplan - {dayNames[selectedDay]}</h3>
                <StudentList>
                  {schedule
                    .filter((item) => !remainingStudents.includes(item.name))
                    .map((item, index) => (
                      <StudentItem
                        key={index}
                        style={{ margin: "10px 0", listStyle: "none" }}>
                        Kl. {item.time} - {item.name}
                      </StudentItem>
                    ))}
                </StudentList>
              </Section>

              {/* 🔹 Overskydende elever vises KUN i UI */}
              <Section>
                <h3>Overskydende elever</h3>
                <StudentList>
                  {remainingStudents.map((student, index) => (
                    <StudentItem key={index}>{student}</StudentItem>
                  ))}
                </StudentList>
              </Section>
            </>
          ) : (
            <>
              <p>Ingen plan endnu. Klik på knappen for at generere!</p>
              <ActionButton
                onClick={handleButtonClicked}
                buttonText='📅 Lav fremlæggelsesplan'
              />
            </>
          )}
        </>
      )}
    </Article>
  );
};

export default PresentationSchema;

const Article = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  width: 100%;

  input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    outline: none;
  }

  input:focus {
    border-color: #007bff;
  }
`;

const StudentList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  background: white;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const StudentItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #eee;
  font-size: 16px;

  &:last-child {
    border-bottom: none;
  }
`;

const Section = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }

  h4 {
    font-size: 18px;
    color: #555;
    margin-bottom: 15px;
  }

  ul {
    text-align: left;
    padding: 0;

    li {
      list-style-type: none;
      padding: 8px 0;
      font-size: 16px;
      border-bottom: 1px solid #eee;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;

  button {
    flex: 1;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  button:first-child {
    background: #007bff;
  }

  button:first-child:hover {
    background: #0056b3;
  }

  button:last-child {
    background: #28a745;
  }

  button:last-child:hover {
    background: #1e7e34;
  }
`;
