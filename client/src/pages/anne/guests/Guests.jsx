import { useState } from "react";
import styled from "styled-components";
import useFetchGuests from "../hooks/useFetchGuests";
import GuestForm from "../forms/GuestForm";
import InviteLink from "../invitation/InviteLink";
import { Add, Edit, Remove } from "../../../components/icons/Icons";

const Guests = ({ invitationId }) => {
  const { guests, deleteGuest, refetch } = useFetchGuests(invitationId);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [editGuest, setEditGuest] = useState(null);

  const handleEdit = (guest) => {
    setEditGuest(guest);
    setShowGuestForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Er du sikker på, at du vil slette denne gæst?")) {
      await deleteGuest(id);
      await refetch();
    }
  };

  const attendingTotal =
    guests
      ?.filter((g) => g.isAttending)
      .reduce((sum, g) => sum + (g.numberOfGuests || 1), 0) || 0;

  return (
    <Wrapper>
      <Header>
        <p>Tilføj gæst</p>
        <Add
          onClick={() => {
            setEditGuest(null);
            setShowGuestForm(true);
          }}
        />
      </Header>

      {guests?.length > 0 && (
        <InfoBox>
          <p>
            <strong>{attendingTotal}</strong> personer har meldt deres ankomst
            ✅
          </p>
        </InfoBox>
      )}

      {showGuestForm && (
        <GuestForm
          isEditMode={!!editGuest}
          guest={editGuest}
          setShowGuestForm={setShowGuestForm}
          refetch={refetch}
          invitationId={invitationId}
        />
      )}

      <GuestList>
        {guests?.length === 0 ? (
          <p>Ingen gæster tilføjet endnu.</p>
        ) : (
          guests.map((guest) => (
            <GuestCard
              key={guest._id}
              $status={
                guest.isAttending === true
                  ? "attending"
                  : guest.isAttending === false
                  ? "not_attending"
                  : "unknown"
              }>
              <GuestInfo>
                <strong>{guest.name}</strong> –{" "}
                {guest.isAttending === true
                  ? `${guest.numberOfGuests} deltager`
                  : guest.isAttending === false
                  ? "Deltager ikke"
                  : "Har ikke svaret endnu"}
              </GuestInfo>

              {guest.notes && (
                <Notes>
                  <em>Noter:</em> {guest.notes}
                </Notes>
              )}

              <InviteLink guest={guest} />

              <ButtonGroup>
                <Edit onClick={() => handleEdit(guest)} />
                <Remove onClick={() => handleDelete(guest._id)} />
              </ButtonGroup>
            </GuestCard>
          ))
        )}
      </GuestList>
    </Wrapper>
  );
};

export default Guests;

// --- Styled Components ---

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoBox = styled.div`
  margin: 1.5rem 0;
  padding: 0.8rem 1rem;
  background: #f9f9f9;
  border-left: 4px solid #4caf50;
  border-radius: 4px;
  color: #333;
  font-size: 0.95rem;
`;

const Wrapper = styled.section`
  padding: 3rem 2rem;
  max-width: 800px;
  margin: 0 auto;

  .add {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: space-between;
  }
`;

const GuestList = styled.div`
  margin-top: 2rem;
`;

const GuestCard = styled.div`
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-left: 6px solid
    ${(props) =>
      props.$status === "attending"
        ? "#4caf50"
        : props.$status === "not_attending"
        ? "#f44336"
        : "#ff9800"};
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const GuestInfo = styled.div`
  margin: 0;
  font-size: 1rem;
  color: #333;

  strong {
    color: #000;
  }

  em {
    color: #666;
  }

  p {
    margin: 10px 0;
  }
`;

const Notes = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.4rem;
`;

const ButtonGroup = styled.div`
  margin-top: 0.7rem;
  display: flex;
  gap: 0.5rem;
`;
