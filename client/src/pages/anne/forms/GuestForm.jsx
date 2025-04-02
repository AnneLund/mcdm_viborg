import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as generateToken } from "uuid";
import useFetchGuests from "../hooks/useFetchGuests";
import Loading from "../../../components/Loading/Loading";
import ActionButton from "../../../components/button/ActionButton";
import { useAlert } from "../../../context/Alert";
import styled from "styled-components";
import useFetchInvitations from "../hooks/useFetchInvitations";

const GuestForm = ({
  isEditMode,
  guest,
  setShowGuestForm,
  refetch,
  invitationId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { createGuest, updateGuest } = useFetchGuests();
  const { updateInvitation } = useFetchInvitations();

  const { showSuccess, showError } = useAlert();
  const guestId = guest?._id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: guest?.name || "",
      description: guest?.description || "",
      isAttending: guest?.isAttending ?? "",
      notes: guest?.notes || "",
    },
  });

  useEffect(() => {
    if (guest) {
      setValue("name", guest.name);
      setValue("description", guest.description);
      setValue("isAttending", guest.isAttending?.toString());
      setValue("notes", guest.notes);
    }
  }, [guest, setValue]);

  const onSubmit = async (formData) => {
    setIsLoading(true);

    const isAttending =
      formData.isAttending === "true"
        ? true
        : formData.isAttending === "false"
        ? false
        : undefined;

    const payload = {
      ...formData,
      isAttending,
      dateResponded: isAttending !== undefined ? new Date() : undefined,
      invitationId: invitationId || guest?.invitationId,
      token: isEditMode ? guest?.token : generateToken(),
    };

    try {
      const response = isEditMode
        ? await updateGuest(guestId, payload)
        : await createGuest(payload);

      if (response.status === "ok") {
        // Hvis gæsten deltager, opdater invitationens antal gæster
        if (!isEditMode && isAttending === true) {
          try {
            await updateInvitation(payload.invitationId, {
              $inc: { numberOfGuests: 1 },
            });
          } catch (err) {
            console.error("Fejl ved opdatering af invitation:", err);
          }
        }

        await refetch?.();
        showSuccess(isEditMode ? "Gæst opdateret!" : "Gæst tilføjet!");
      }
    } catch (error) {
      console.error("Fejl ved oprettelse/opdatering:", error);
      showError("Noget gik galt.");
    } finally {
      setShowGuestForm(false);
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)} id='form'>
      <Title>{isEditMode ? "Rediger Gæst" : "Tilføj Gæst"}</Title>

      <Label>
        <input
          type='text'
          placeholder='Navn'
          {...register("name", { required: "Navn er påkrævet" })}
        />
        {errors.name && <p>{errors.name.message}</p>}
      </Label>

      <Label>
        <h3>Deltager?</h3>
        <select {...register("isAttending")}>
          <option value=''>Vælg deltagelse</option>
          <option value='true'>Ja</option>
          <option value='false'>Nej</option>
        </select>
      </Label>

      <Label>
        <textarea
          placeholder='Noter (valgfrit)'
          {...register("notes")}
          rows={4}
        />
      </Label>

      <ButtonGroup>
        <ActionButton
          onClick={() => setShowGuestForm(false)}
          buttonText='Annuller'
          cancel={true}
        />
        <ActionButton
          type='submit'
          buttonText={isEditMode ? "Opdater Gæst" : "Tilføj Gæst"}
          background='green'
        />
      </ButtonGroup>
    </FormWrapper>
  );
};

export default GuestForm;

//
// --- STYLED COMPONENTS (eller importer fra dit designsystem) ---
//

const FormWrapper = styled.form`
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 1.25rem;

  input,
  select,
  textarea {
    width: 100%;
    padding: 0.6rem;
    margin-top: 0.5rem;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;
