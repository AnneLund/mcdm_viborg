import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import styles from "./form.module.css";
import { useFetchFaqs } from "../../hooks/useFetchFaqs";
import Button from "../button/ActionButton";
import { useAuthContext } from "../../context/useAuthContext";

const FaqForm = ({ isEditMode }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [link, setLink] = useState("");
  const { refetch } = useOutletContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const formRef = useRef(null);
  const { user } = useAuthContext();
  const { createFaq, isLoading, fetchFaqById, updateFaq } = useFetchFaqs();

  // Hent faq, hvis editMode er true
  useEffect(() => {
    if (isEditMode && id) {
      const loadFaqData = async () => {
        try {
          const response = await fetchFaqById(id);
          if (response) {
            setQuestion(response.question);
            setAnswer(response.answer);
            setLink(response.link);
            formRef.current?.scrollIntoView({ behavior: "smooth" });
          }
        } catch (error) {
          console.error("Error fetching faq:", error);
        }
      };

      loadFaqData();
    }
  }, [id, isEditMode]);

  // Håndter indsendelse af formular
  const handleSubmitFaq = async (event) => {
    event.preventDefault();

    const faqData = { question, answer, link };

    try {
      let response;
      if (isEditMode && id) {
        response = await updateFaq({ ...faqData, id });
      } else {
        response = await createFaq(faqData);
      }
      if (response) {
        await refetch();
        navigate("/faqs");
      }
    } catch (error) {
      console.error("Fejl ved håndtering af faq:", error);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmitFaq} className={styles.form}>
      <h2>{isEditMode ? "Opdater faq" : "Tilføj faq"}</h2>
      <div>
        <input
          id='faq'
          type='text'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          placeholder='Dit spørgsmål'
        />
      </div>
      {user.role === "admin" && (
        <>
          <div>
            <input
              id='answer'
              type='text'
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder='Dit svar'
            />
          </div>
          <div>
            <input
              id='link'
              type='text'
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder='Evt link'
            />
          </div>
        </>
      )}

      <Button
        type='submit'
        buttonText={isEditMode ? "Opdater faq" : "Tilføj faq"}
        background={!isEditMode && "green"}
      />
    </form>
  );
};

export default FaqForm;
