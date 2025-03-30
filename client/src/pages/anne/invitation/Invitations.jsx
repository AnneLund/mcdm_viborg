import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import ActionButton from "../../../components/button/ActionButton";
import { useAlert } from "../../../context/Alert";
import InvitationForm from "../forms/InvitationForm";
import useFetchInvitations from "../hooks/useFetchInvitations";
import InvitationCard from "./InvitationCard";

const Invitations = () => {
  const { showError, showSuccess, showConfirmation } = useAlert();
  const { invitations, refetch, deleteInvitation, isLoading } =
    useFetchInvitations();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editInvitation, setEditInvitation] = useState(null);

  const handleDelete = (invitationId) => {
    showConfirmation(
      "Slet invitation?",
      "Er du sikker på, at du vil slette denne invitation? Det kan ikke fortrydes.",
      async () => {
        try {
          const res = await deleteInvitation(invitationId);

          if (!res.status || res.status !== "ok") {
            const errorText = await res.text?.(); // fallback hvis det er et response-objekt
            throw new Error(errorText || "Ukendt fejl");
          }

          showSuccess("Invitation slettet");
          refetch();
        } catch (err) {
          showError("Fejl ved sletning: " + err.message);
        }
      }
    );
  };

  return (
    <Container>
      <Header>
        <h1>Invitationer</h1>
        <ActionButton
          buttonText='Opret ny invitation'
          background='green'
          onClick={() => {
            setEditInvitation(null);
            setIsFormOpen(true);
          }}
        />
      </Header>

      {isFormOpen && (
        <InvitationForm
          isEditMode={!!editInvitation}
          editInvitation={editInvitation}
          setEditInvitation={setEditInvitation}
          onClose={() => setIsFormOpen(false)}
          onSave={refetch}
        />
      )}

      {isLoading ? (
        <p>Henter invitationer...</p>
      ) : invitations.length === 0 ? (
        <p>Ingen invitationer endnu.</p>
      ) : (
        <InvitationGrid
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}>
          {invitations.map((inv) => (
            <InvitationCard
              key={inv._id}
              invitation={inv}
              deleteInvitation={handleDelete}
              setEditInvitation={setEditInvitation}
              editInvitation={editInvitation}
              setIsFormOpen={setIsFormOpen}
            />
          ))}
        </InvitationGrid>
      )}
    </Container>
  );
};

export default Invitations;

//
// --- STYLED COMPONENTS ---
//

const Container = styled.div`
  max-width: 1000px;
  margin: 3rem auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const InvitationGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;
