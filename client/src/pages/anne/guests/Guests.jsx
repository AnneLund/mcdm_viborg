import { useState } from "react";
import styled from "styled-components";
import useFetchGuests from "../hooks/useFetchGuests";
import GuestForm from "../forms/GuestForm";
import InviteLink from "../invitation/InviteLink";
import { Add, Edit, Remove } from "../../../components/icons/Icons";
import { formatDate } from "../../../helpers/formatDate";
import ModalDialog from "../components/ModalDialog";
import useFetchOverview from "../hooks/useFetchOverview";
import { useAlert } from "../../../context/Alert";

const Guests = ({ invitationId }) => {
  const { guests, deleteGuest, refetch } = useFetchGuests(invitationId);
  const { overview } = useFetchOverview(invitationId);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const { showConfirmation } = useAlert();

  const handleEdit = (guest) => {
    setEditGuest(guest);
    setShowGuestForm((prev) => !prev);
  };

  const handleDeleteClick = async (id) => {
    showConfirmation(
      "Slet gæst",
      `Er du sikker på, at du vil slette denne gæst?`,
      async () => {
        await deleteGuest(id);
        await refetch();
      }
    );
  };

  return (
    <Wrapper>
      <Header>
        <Add
          onClick={() => {
            setEditGuest(null);
            setShowGuestForm(true);
          }}
        />
        <p>Tilføj gæst</p>
      </Header>

      {guests?.length > 0 && (
        <>
          <InfoBox $status='attending'>
            <p>
              <strong>
                {overview?.totalComing} ud af {overview?.totalInvited}
              </strong>{" "}
              personer har meldt deres ankomst ✅
            </p>
          </InfoBox>

          <InfoBox $status='not_attending'>
            <p>
              <strong>{overview?.totalDeclined} kommer ikke ❌</strong>
            </p>
          </InfoBox>

          <InfoBox>
            <p>
              <strong>
                {overview?.totalPending} har endnu ikke svaret ⏳{" "}
              </strong>
            </p>
          </InfoBox>
        </>
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
                <header>
                  <div>
                    {" "}
                    <strong>{guest.name}</strong> –{" "}
                    {guest.isAttending === true
                      ? `${guest.numberOfGuests} deltager`
                      : guest.isAttending === false
                      ? "Deltager ikke"
                      : "Har ikke svaret endnu"}
                  </div>

                  <InviteLink guest={guest} />
                </header>

                {guest.description && (
                  <div className='comments'>
                    <strong>Kommentarer fra gæst</strong>
                    <p>{guest.description}</p>
                  </div>
                )}
                {guest.dateResponded && (
                  <p>
                    {" "}
                    <i>
                      {guest.name} har besvaret invitationen d.{" "}
                      {formatDate(guest.dateResponded)}
                    </i>
                  </p>
                )}
              </GuestInfo>

              <ButtonGroup>
                <Edit onClick={() => handleEdit(guest)} />
                <Remove onClick={() => handleDeleteClick(guest._id)} />
              </ButtonGroup>
            </GuestCard>
          ))
        )}
        <ModalDialog
          isOpen={showGuestForm}
          onClose={() => setShowGuestForm(false)}>
          <GuestForm
            isEditMode={!!editGuest}
            guest={editGuest}
            setShowGuestForm={setShowGuestForm}
            refetch={refetch}
            invitationId={invitationId}
          />
        </ModalDialog>
      </GuestList>
    </Wrapper>
  );
};

export default Guests;

// --- Styled Components ---

const Header = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  justify-content: space-between;
  p {
    margin-left: 10px;
  }
`;

const InfoBox = styled.div`
  margin: 1.5rem 0;
  padding: 0.8rem 1rem;
  background: #f9f9f9;
  border-left: 6px solid
    ${(props) =>
      props.$status === "attending"
        ? "#4caf50"
        : props.$status === "not_attending"
        ? "#f44336"
        : "#ff9800"};
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

  @media (max-width: 400px) {
    padding: 0;
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
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const GuestInfo = styled.div`
  header {
    display: flex;
    justify-content: space-between;
    margin: 0;

    @media (max-width: 400px) {
      display: flex;
      flex-direction: column;
    }
  }
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

  .comments {
    padding: 10px;
    margin: 10px 0;
    background-color: #47a05922;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;
