import { useState } from "react";
import { useAuthContext } from "../../context/useAuthContext";
import { apiUrl } from "../../apiUrl";
import ActionButton from "../button/ActionButton";
import styles from "../forms/form.module.css";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../context/Alert";
import { Article } from "../../styles/containerStyles";

const ChangePassword = () => {
  const { token } = useAuthContext();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { showError, showSuccess } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showError("De nye adgangskoder stemmer ikke overens");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();

      if (response.ok) {
        showSuccess("Adgangskode ændret succesfuldt!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showError(data.message || "Fejl ved ændring af adgangskode");
      }
    } catch (error) {
      showError("Noget gik galt", error);
    } finally {
      navigate(-1);
    }
  };

  return (
    <Article>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Skift Adgangskode</h2>
        <label>
          Nuværende Adgangskode:
          <input
            type='password'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Ny Adgangskode:
          <input
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Bekræft Ny Adgangskode:
          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        <ActionButton type='submit' buttonText='Skift Adgangskode' />
      </form>
    </Article>
  );
};

export default ChangePassword;
