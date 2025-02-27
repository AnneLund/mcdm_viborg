import { Outlet, useNavigate } from "react-router-dom";
import Faq from "../components/faq/Faq";
import { useFetchFaqs } from "../hooks/useFetchFaqs";
import styled from "styled-components";
import { useState } from "react";

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background-color: #2c3e50;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 10px;
  &:hover {
    background-color: #144115;
    color: #fff;
  }
`;

const Faqs = () => {
  const { faqs, refetch, deleteFaq } = useFetchFaqs();
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <article className='faq'>
      <div>
        <h2>Faqs</h2>
        <Button className='button' onClick={() => navigate("/faqs/add")}>
          Tilføj nyt spørgsmål
        </Button>
        <Outlet context={{ refetch }} />
        {faqs?.length > 0 ? (
          faqs.map((faq) => (
            <Faq
              key={faq._id}
              faq={faq}
              openFaq={openFaq}
              toggleFaq={toggleFaq}
              deleteFaq={() => deleteFaq(faq._id)}
            />
          ))
        ) : (
          <p>Endnu ingen spørgsmål..</p>
        )}
      </div>
    </article>
  );
};

export default Faqs;
