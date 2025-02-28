import { useState } from "react";
import { useAuthContext } from "../../context/useAuthContext";
import styles from "./login.module.css";

const Login = () => {
  const { signIn } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await signIn(email, password);

      if (result.status === "error") {
        setErrorMessage(result.message);
      }
    } catch (err) {
      console.error("Login-fejl:", err);
      setErrorMessage("Noget gik galt. Prøv igen senere.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3>Login for at få adgang</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && (
          <p className='errorMessage' style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}
        <button className={styles.button} type='submit' disabled={isLoading}>
          {isLoading ? "Logger ind..." : "Log ind"}
        </button>
      </form>
    </div>
  );
};

export default Login;
