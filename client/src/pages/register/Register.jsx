import { useState } from "react";
import { useFetchTerms } from "../../hooks/useFetchTerms";
import styled from "styled-components";
import { Outlet, useNavigate } from "react-router-dom";
import ActionButton from "../../components/button/ActionButton";
import { Article, ColumnContainer } from "../../styles/containerStyles";

// Styling for alfabet-navigation
const AlphabetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background-color: ${({ $active }) => ($active ? "#007bff" : "#f8f9fa")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #007bff;
    color: #fff;
  }
`;

// Styling for søgefeltet
const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

// Styling for termer
const Term = styled.li`
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

// Styling for definitionen
const Definition = styled.div`
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

const Register = () => {
  const { terms, refetch, deleteTerm } = useFetchTerms();
  const [openTerm, setOpenTerm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (termId) => {
    navigate(`/register/edit/${termId}`);
  };

  // Hele alfabetet inkl. Æ, Ø, Å
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ".split("");

  // Funktion til at åbne/lukke accordion
  const toggleTerm = (id) => {
    setOpenTerm((prev) => (prev === id ? null : id));
  };

  // Filtrerer termer ud fra bogstav og søgning
  const filteredTerms = terms
    ?.filter((term) => {
      if (selectedLetter) {
        return term.term[0]?.toUpperCase() === selectedLetter;
      }
      return true; // Hvis ingen bogstav er valgt, vis alle
    })
    .filter((term) =>
      term.term.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.term.localeCompare(b.term));

  return (
    <article className='register'>
      <h1>Stikordsregister</h1>

      <SearchInput
        type='text'
        placeholder='Søg blandt termer...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <AlphabetContainer>
        <Button
          onClick={() => setSelectedLetter(null)}
          $active={selectedLetter === null}>
          Alle
        </Button>
        {alphabet.map((letter) => (
          <Button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            $active={selectedLetter === letter}>
            {letter}
          </Button>
        ))}
        <Button className='button' onClick={() => navigate("/register/add")}>
          Tilføj ny term
        </Button>
      </AlphabetContainer>
      <Outlet context={{ refetch }} />
      <ul>
        {filteredTerms?.length > 0 ? (
          filteredTerms.map((term) => (
            <Term key={term._id} onClick={() => toggleTerm(term._id)}>
              <strong>{term.term}</strong>
              {openTerm === term._id && (
                <Definition>
                  {term.definition ? (
                    <p>{term.definition}</p>
                  ) : (
                    <p>Ingen beskrivelse endnu..</p>
                  )}
                  <div className='buttons'>
                    <ActionButton
                      buttonText='Slet'
                      background='red'
                      onClick={() => deleteTerm(term._id)}
                    />
                    <ActionButton
                      buttonText='Redigér'
                      onClick={() => handleEdit(term._id)}
                    />
                  </div>
                </Definition>
              )}
            </Term>
          ))
        ) : (
          <p>
            Ingen termer fundet for{" "}
            {selectedLetter ? `"${selectedLetter}"` : "alle bogstaver"} med
            søgningen &quot;{searchQuery}&quot;.
          </p>
        )}
      </ul>
    </article>
  );
};

export default Register;
