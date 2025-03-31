import styled from "styled-components";
import { Edit, Remove, Team } from "../../../components/icons/Icons";
import Guests from "../guests/Guests";

const Card = ({
  invitation,
  deleteInvitation,
  setIsFormOpen,
  setEditInvitation,
  editInvitation,
}) => {
  return (
    <InvitationCard>
      {invitation.image && (
        <img src={invitation.image} alt={invitation.title} />
      )}
      <pre>{JSON.stringify(invitation, null, 2)}</pre>

      <h3>{invitation.title}</h3>
      <p>
        <strong>Dato:</strong> {invitation.date?.substring(0, 10)}
      </p>

      <p>
        <strong>Tidspunkt:</strong> Kl. {invitation.time}
      </p>

      {invitation.type && (
        <p>
          <strong>Type:</strong> {invitation.type}
        </p>
      )}
      {invitation.location && (
        <p>
          <strong>Sted:</strong> {invitation.location}
        </p>
      )}
      {invitation.description && <p>{invitation.description}</p>}

      <ButtonRow>
        <Edit
          onClick={() => {
            setEditInvitation(invitation);
            setIsFormOpen(true);
          }}
        />
        <Remove onClick={() => deleteInvitation(invitation._id)} />
        <Team
          onClick={() =>
            setEditInvitation(
              editInvitation?._id === invitation._id ? null : invitation
            )
          }
        />
      </ButtonRow>

      {editInvitation?._id === invitation._id && (
        <GuestSection>
          <h4>Gæsteliste for: {invitation.title}</h4>
          <Guests invitationId={invitation._id} />
        </GuestSection>
      )}
    </InvitationCard>
  );
};

export default Card;

const InvitationCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  h3 {
    margin: 0;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const GuestSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
`;
