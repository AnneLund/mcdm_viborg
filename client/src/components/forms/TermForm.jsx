import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import styles from "./form.module.css";
import { useFetchTerms } from "../../hooks/useFetchTerms";
import Button from "../button/ActionButton";

const TermForm = ({ isEditMode }) => {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const { refetch } = useOutletContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const formRef = useRef(null);
  const { createTerm, isLoading, fetchTermById, updateTerm } = useFetchTerms();

  // Hent term, hvis editMode er true
  useEffect(() => {
    if (isEditMode && id) {
      const loadTermData = async () => {
        try {
          const response = await fetchTermById(id);
          if (response) {
            setTerm(response.term);
            setDefinition(response.definition);
            formRef.current?.scrollIntoView({ behavior: "smooth" });
          }
        } catch (error) {
          console.error("Error fetching term:", error);
        }
      };

      loadTermData();
    }
  }, [id, isEditMode]);

  // Håndter indsendelse af formular
  const handleSubmitTerm = async (event) => {
    event.preventDefault();

    // Send data som JSON i stedet for FormData
    const termData = {
      term,
      definition,
    };

    try {
      let response;
      if (isEditMode && id) {
        response = await updateTerm({ ...termData, id });
      } else {
        response = await createTerm(termData);
      }

      if (response) {
        await refetch();
        navigate("/register");
      }
    } catch (error) {
      console.error("Fejl ved håndtering af term:", error);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmitTerm} className={styles.form}>
      <h2>{isEditMode ? "Opdater term" : "Tilføj term"}</h2>
      <div>
        <label htmlFor='term'>Term:</label>
        <input
          id='term'
          type='text'
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor='definition'>Beskrivelse:</label>
        <input
          id='definition'
          type='text'
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
        />
      </div>

      <Button
        type='submit'
        buttonText={isEditMode ? "Opdater term" : "Tilføj term"}
        background={!isEditMode && "green"}
      />
    </form>
  );
};

export default TermForm;
