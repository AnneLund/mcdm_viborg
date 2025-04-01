import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import styled from "styled-components";
import { motion } from "framer-motion";
import ActionButton from "../../../components/button/ActionButton";
import { useAlert } from "../../../context/Alert";
import useFetchInvitations from "../hooks/useFetchInvitations";

const InvitationForm = ({
  isEditMode = false,
  invitation = null,
  onClose,
  onSave,
  defaultValues = {},
}) => {
  const { showSuccess, showError } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const { createInvitation, updateInvitation, refetch } = useFetchInvitations();
  const invitationId = invitation?._id;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: invitation?.title || "",
      description: invitation?.description || "",
      date: invitation?.date?.substring(0, 10) || "",
      time: invitation?.time || "",
      location: invitation?.location || "",
      type: invitation?.type || "",
      image: invitation?.image || "",
      images: [""],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  useEffect(() => {
    if (invitation) {
      setValue("title", invitation.title);
      setValue("description", invitation.description);
      setValue("date", invitation.date?.substring(0, 10));
      setValue("time", invitation.time);
      setValue("location", invitation.location);
      setValue("type", invitation.type);
      setValue("images", invitation.images?.length ? invitation.images : [""]);
      setValue("file", invitation.image);
    }
  }, [invitation, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Tilføj tekstfelter
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("date", data.date);
      formData.append("time", data.time);
      formData.append("location", data.location);
      formData.append("type", data.type);
      data.images.forEach((imageUrl) => {
        formData.append("images", imageUrl);
      });

      const fileInput = data.image?.[0];
      if (fileInput) {
        formData.append("image", fileInput);
      }

      let response;
      if (isEditMode) {
        response = await updateInvitation(invitationId, formData, true);
      } else {
        response = await createInvitation(formData, true);
      }

      if (response.status === "ok") {
        await refetch();
        showSuccess(
          isEditMode ? "Invitation opdateret!" : "Invitation oprettet!"
        );
        onSave();
        onClose();
      } else {
        showError("Fejl ved oprettelse/opdatering:");
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("Fejl:", error);
      showError("Noget gik galt.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper
      as={motion.form}
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}>
      <Title>{isEditMode ? "Rediger Invitation" : "Opret Invitation"}</Title>

      <Label>
        Titel *
        <input
          type='text'
          {...register("title", { required: "Titel er påkrævet" })}
        />
        {errors.title && <p>{errors.title.message}</p>}
      </Label>

      <Label>
        Beskrivelse
        <textarea {...register("description")} rows={3} />
      </Label>

      <Label>
        Dato
        <input type='date' {...register("date")} />
      </Label>

      <Label>
        Tidspunkt
        <input type='time' {...register("time")} />
      </Label>

      <Label>
        Lokation
        <input type='text' {...register("location")} />
      </Label>

      <Label>
        Type af arrangement
        <select {...register("type")}>
          <option value=''>Vælg type</option>
          <option value='Fødselsdag'>Fødselsdag</option>
          <option value='Reception'>Reception</option>
          <option value='Middag'>Middag</option>
          <option value='Andet'>Andet</option>
        </select>
      </Label>

      <Label>
        Billede (upload)
        <input type='file' accept='image/*' {...register("image")} />
      </Label>

      <Label>Billede-URL&lsquo;er</Label>
      {fields.map((field, index) => (
        <div
          key={field.id}
          style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <input
            {...register(`images.${index}`)}
            placeholder='https://...'
            style={{ flex: 1 }}
          />
          <button type='button' onClick={() => remove(index)}>
            ❌
          </button>
        </div>
      ))}

      <button type='button' onClick={() => append("")}>
        ➕ Tilføj billede
      </button>

      <ButtonGroup>
        <ActionButton buttonText='Annuller' onClick={onClose} cancel={true} />
        <ActionButton
          buttonText={isEditMode ? "Opdater" : "Opret"}
          type='submit'
          background='green'
          disabled={isLoading}
        />
      </ButtonGroup>
    </FormWrapper>
  );
};

export default InvitationForm;

// --- Styled Components ---
const FormWrapper = styled.form`
  background-color: #ffffff;
  padding: 2rem;
  margin-top: 2rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #333;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 1rem;

  input,
  select,
  textarea {
    width: 100%;
    padding: 0.7rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    margin-top: 0.4rem;
    background-color: #fafafa;
  }

  select {
    background-color: #fff;
  }

  textarea {
    resize: vertical;
  }

  h3 {
    margin-bottom: 0.3rem;
    font-weight: 500;
  }

  p {
    color: #d32f2f;
    font-size: 0.85rem;
    margin-top: 0.3rem;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 0.8rem;
`;
