import styled from "styled-components";
import ActionButton from "../button/ActionButton";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/useAuthContext";

const Question = styled.li`
  margin-bottom: 1rem;
  list-style: none;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1rem;
  background: #f8f9fa;

  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const Answer = styled.div`
  margin-top: 0.5rem;
  padding: 10px;
  background: #e9ecef;
  border-radius: 5px;
  transition: max-height 0.3s ease-in-out;

  .buttons {
    display: flex;
    width: fit-content;
    margin: 0 auto;
    margin-right: 0;
    gap: 10px;
  }
`;

const Faq = ({ faq, openFaq, toggleFaq, deleteFaq }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleEdit = (faqId) => {
    navigate(`/faqs/edit/${faqId}`);
  };

  return (
    <Question onClick={() => toggleFaq(faq._id)}>
      {/* Tilføj onClick her */}
      <strong>{faq?.question}</strong>

      {openFaq === faq._id && (
        <Answer>
          {faq.answer ? <p>{faq.answer}</p> : <p>Ingen besvarelse endnu..</p>}
        </Answer>
      )}

      {user.role === "admin" && (
        <div className='buttons'>
          <ActionButton
            buttonText='Slet'
            background='red'
            onClick={(e) => {
              e.stopPropagation();
              deleteFaq(faq._id);
            }}
          />
          <ActionButton
            buttonText='Redigér'
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(faq._id);
            }}
          />
        </div>
      )}
    </Question>
  );
};

export default Faq;
