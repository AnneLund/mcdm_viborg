import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../../apiUrl";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import useFetchInvitations from "../hooks/useFetchInvitations";
import { formatDateWithDay } from "../../../helpers/formatDate";

const Invitation = () => {
  const { token } = useParams();
  const [guest, setGuest] = useState(null);
  const [maxAllowedGuests, setMaxAllowedGuests] = useState(1);
  const [isAttending, setIsAttending] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { fetchInvitationById } = useFetchInvitations();
  const [invitation, setInvitation] = useState(null);

  const [currentImage, setCurrentImage] = useState(0);
  const imageArray = invitation?.images || [];

  useEffect(() => {
    if (imageArray.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % imageArray.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [imageArray]);

  const fetchGuest = async () => {
    try {
      const res = await fetch(`${apiUrl}/invitation/guest/token/${token}`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Ukendt fejl");

      const guestData = data.guest;

      const names = guestData.name
        .split(/,| og /i)
        .map((n) => n.trim())
        .filter(Boolean);
      const allowedGuests = names.length;

      setGuest(guestData);
      setIsAttending(guestData.isAttending);
      setNumberOfGuests(guestData.numberOfGuests || allowedGuests);
      setMaxAllowedGuests(allowedGuests);
    } catch (err) {
      console.error("Fejl i fetchGuest:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchGuest();
  }, [token]);

  useEffect(() => {
    const fetchLatestInvitation = async () => {
      if (guest?.invitationId) {
        const updatedInvitation = await fetchInvitationById(guest.invitationId);
        setInvitation(updatedInvitation);
        console.log("🎯 Invitation hentet fra API:", updatedInvitation);
      }
    };

    fetchLatestInvitation();
  }, [guest?.invitationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/invitation/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          isAttending,
          numberOfGuests: isAttending ? numberOfGuests : 0,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      setHasSubmitted(true);
    } catch (err) {
      setError("Kunne ikke sende svar: " + err.message);
    }
  };

  if (error)
    return (
      <Wrapper>
        <ErrorMessage>{error}</ErrorMessage>
      </Wrapper>
    );
  if (!guest)
    return (
      <Wrapper>
        <p>Henter invitation...</p>
      </Wrapper>
    );

  if (hasSubmitted) {
    return (
      <Wrapper
        key={invitation?._id || guest?.invitationId || token}
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}>
        <Heading>
          Tak for{" "}
          {maxAllowedGuests > 1 ? <span>jeres </span> : <span>dit </span>} svar,{" "}
          {guest.name} 🙏
        </Heading>
        <p>
          Du kan lukke siden – eller <strong>ændre dit svar</strong> nedenfor.
        </p>
        <SubmitButton onClick={() => setHasSubmitted(false)}>
          Ændr svar
        </SubmitButton>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      key={invitation?._id || guest?.invitationId || token}
      as={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <Heading>🎉 Kære {guest.name} 🎉</Heading>
      <Subheading>
        <p>
          {maxAllowedGuests > 1 ? <span>I </span> : <span>Du </span>} er
          inviteret til:
        </p>
        <h3>{invitation?.title || "Vores arrangement"}</h3>
      </Subheading>

      {invitation?.image && (
        <img src={invitation?.image} alt={invitation.title} />
      )}

      {imageArray.length > 0 && (
        <div
          style={{
            position: "relative",
            width: "100%",
            maxHeight: "400px",
            overflow: "hidden",
            borderRadius: "1rem",
            marginBottom: "1.5rem",
          }}>
          <AnimatePresence mode='wait'>
            <motion.img
              key={imageArray[currentImage]}
              src={imageArray[currentImage]}
              alt={`Slide ${currentImage + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </AnimatePresence>
        </div>
      )}

      {invitation && (
        <InvitationCard>
          <div>
            <strong>Beskrivelse</strong>{" "}
            <Description>
              {invitation.description
                ? invitation.description.split("\n").map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))
                : "Ingen beskrivelse angivet."}
            </Description>
          </div>
          <div>
            <strong>Dato</strong>{" "}
            <p>{formatDateWithDay(invitation.date?.substring(0, 10))}</p>
          </div>
          <div>
            <strong>Tidspunkt</strong>{" "}
            <p>{invitation.time || "Intet tidspunkt angivet."}</p>
          </div>

          {invitation.location && (
            <div>
              <strong>Sted</strong>
              <p>{invitation.location}</p>
            </div>
          )}
          {invitation.created && (
            <p style={{ fontSize: "0.9rem", color: "#999" }}>
              Invitation oprettet:{" "}
              {new Date(invitation.created).toLocaleDateString("da-DK")}
            </p>
          )}
        </InvitationCard>
      )}

      {guest.hasResponded && (
        <p style={{ fontStyle: "italic", color: "#666", marginBottom: "1rem" }}>
          {maxAllowedGuests > 1 ? <span>I </span> : <span>Du </span>} har
          allerede svaret – du kan ændre dit svar herunder.
        </p>
      )}

      <StyledForm onSubmit={handleSubmit} as={motion.form} layout>
        <Label>
          <strong>
            Vil/kan {maxAllowedGuests > 1 ? <span>I </span> : <span>du </span>}{" "}
            deltage?
          </strong>
          <Select
            value={isAttending ?? ""}
            onChange={(e) => setIsAttending(e.target.value === "true")}>
            <option value=''>Vælg et svar</option>
            <option value='true'>Ja</option>
            <option value='false'>Nej</option>
          </Select>
        </Label>

        {isAttending && maxAllowedGuests > 1 && (
          <Label>
            <strong>Antal personer inkl. dig:</strong>
            <Input
              type='number'
              min={1}
              max={maxAllowedGuests}
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(Number(e.target.value))}
            />
          </Label>
        )}

        <SubmitButton type='submit' disabled={isAttending === null}>
          Send svar
        </SubmitButton>
      </StyledForm>
    </Wrapper>
  );
};

export default Invitation;

//
// --- STYLED COMPONENTS ---
//

const Description = styled.p`
  white-space: pre-line;
  line-height: 1.6;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  color: #444;
`;

const InvitationCard = styled.div`
  background-color: #3d783916;
  text-align: left;
  padding: 1rem 1.5rem;
  margin: 1rem 0 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  h2 {
    margin-top: 0;
    font-size: 1.5rem;
  }

  p {
    margin: 0.5rem 0;
  }

  strong {
    display: block;
    border-bottom: 1px solid;
  }
`;

const Wrapper = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", sans-serif;
  text-align: center;
  img {
    width: 300px;
  }
`;

const Heading = styled.h1`
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
`;

const Subheading = styled.header`
  margin: 0;
  color: #666;
  p {
    font-size: 1.2rem;
    color: #999;
    margin: 10px 0;
  }

  h3 {
    font-size: 1.4rem;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Label = styled.label`
  text-align: left;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  padding: 0.8rem;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 20px;

  &:hover {
    background-color: #43a047;
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
`;
