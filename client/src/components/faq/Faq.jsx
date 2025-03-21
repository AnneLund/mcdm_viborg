import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/useAuthContext";
import { Edit, Remove } from "../icons/Icons";
import { useState } from "react";
import FaqForm from "../forms/FaqForm";
import DOMPurify from "dompurify";

const Question = styled.div`
  margin-bottom: 1rem;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
  background: #f8f9fa;
  cursor: pointer;

  a {
    text-align: left;
    margin: 10px 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const Answer = styled.div`
  margin-top: 0.5rem;
  border-radius: 5px;
  transition: max-height 0.3s ease-in-out;
  text-align: left;

  p {
    margin: 10px 0;
  }

  strong {
    margin: 20px 0;
  }

  li:last-of-type {
    margin-bottom: 10px;
  }

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
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (faqId) => {
    setShowForm((prev) => !prev);
    // navigate(`/faqs/edit/${faqId}`);
  };

  return (
    <figure>
      {showForm ? (
        <FaqForm isEditMode={true} faq={faq} />
      ) : (
        <Question onClick={() => toggleFaq(faq._id)}>
          <strong>{faq?.question}</strong>

          {openFaq === faq._id && (
            <>
              {faq.answer ? (
                <Answer
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(faq.answer),
                  }}
                />
              ) : (
                <p>Ingen besvarelse endnu..</p>
              )}

              {faq.link && <Link to={faq.link}>Se mere her</Link>}
            </>
          )}

          {(user.role === "teacher" || user.role === "admin") && (
            <div id='buttons'>
              <Remove
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFaq(faq._id);
                }}
              />

              <Edit
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(faq._id);
                }}
              />
            </div>
          )}
        </Question>
      )}
    </figure>
  );
};

export default Faq;
