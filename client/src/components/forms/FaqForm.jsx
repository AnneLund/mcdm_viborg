import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import styles from "./form.module.css";
import { useFetchFaqs } from "../../hooks/useFetchFaqs";
import Button from "../button/ActionButton";
import { useAuthContext } from "../../context/useAuthContext";
import { useAlert } from "../../context/Alert";
import Loading from "../Loading/Loading";
const FaqForm = ({ faq, isEditMode }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [link, setLink] = useState("");
  // const { refetch } = useOutletContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const faqId = faq?._id;
  const formRef = useRef(null);
  const answerRef = useRef(null);

  const { user } = useAuthContext();
  const { createFaq, isLoading, fetchFaqById, updateFaq, refetch } =
    useFetchFaqs();
  const { showSuccess } = useAlert();

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);

    const textarea = answerRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Hent faq, hvis editMode er true
  useEffect(() => {
    if (isEditMode && faqId) {
      const loadFaqData = async () => {
        try {
          const response = await fetchFaqById(faqId);
          if (response) {
            setQuestion(response.question);
            setAnswer(response.answer);
            setLink(response.link);
            formRef.current?.scrollIntoView({ behavior: "smooth" });

            // Autoresize efter data er loaded
            setTimeout(() => {
              if (answerRef.current) {
                answerRef.current.style.height = "auto";
                answerRef.current.style.height = `${answerRef.current.scrollHeight}px`;
              }
            }, 0);
          }
        } catch (error) {
          console.error("Error fetching faq:", error);
        }
      };

      loadFaqData();
    }
  }, [faqId, isEditMode]);

  // Håndter indsendelse af formular
  const handleSubmitFaq = async (event) => {
    event.preventDefault();

    const faqData = { question, answer, link };

    try {
      let response;
      if (isEditMode && faqId) {
        response = await updateFaq({ ...faqData, faqId });
      } else {
        response = await createFaq(faqData);
      }
      if (response) {
        await refetch();
        showSuccess(isEditMode ? "FAQ opdateret!" : "FAQ oprettet!");
      }
    } catch (error) {
      console.error("Fejl ved håndtering af faq:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmitFaq} className={styles.form}>
      <h2>{isEditMode ? "Opdater faq" : "Tilføj faq"}</h2>
      <div>
        <textarea
          id='faq'
          type='text'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          placeholder='Dit spørgsmål'
        />
      </div>
      {(user.role === "teacher" || user.role === "admin") && (
        <>
          <div>
            <textarea
              id='answer'
              value={answer}
              onChange={(e) => handleAnswerChange(e)}
              placeholder='Dit svar'
              rows={1}
              style={{ resize: "none", overflow: "hidden" }}
              ref={answerRef}
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
