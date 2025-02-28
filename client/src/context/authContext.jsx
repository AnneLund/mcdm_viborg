import { useLocalStorage } from "@uidotdev/usehooks";
import { createContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl } from "../apiUrl";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [auth, saveAuth] = useLocalStorage("auth", {});
  const [user, setUser] = useLocalStorage("user", {});

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      if (
        location.pathname.includes("backoffice") &&
        !location.pathname.includes("login")
      ) {
        if (auth.token) {
          try {
            let response = await fetch(`${apiUrl}/auth/token`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${auth.token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: auth.token }),
            });

            let result = await response.json();

            if (response.status === 401) {
              console.warn("Token er udløbet eller ugyldig.");
              saveAuth({});
              setUser({});
              navigate("/login");
            } else if (response.ok) {
              setUser(result.data);
            } else {
              console.error("Fejl ved verificering af token:", result.message);
            }
          } catch (error) {
            console.error("Netværksfejl ved token-check:", error);
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      }
    };

    checkUser();
  }, [location.pathname, auth.token, navigate, saveAuth]);

  const token = auth.token ? auth.token : "";

  const signedIn = Boolean(auth.token);

  const signIn = async (email, password) => {
    try {
      let response = await fetch(`${apiUrl}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      let result = await response.json();

      if (!response.ok) {
        console.error("Login fejl:", result.message);
        return { status: "error", message: result.message };
      }

      const user = jwtDecode(result.data.token);
      saveAuth({ token: result.data.token });
      setUser(user);
      navigate("/");

      return { status: "ok", user };
    } catch (error) {
      console.error("Fejl ved login:", error);
      return { status: "error", message: "Netværksfejl ved login" };
    }
  };

  const getUser = () => {
    return token ? jwtDecode(token) : {};
  };

  const signOut = () => {
    saveAuth({});
    setUser({});
    navigate("/login");
  };

  const value = { token, user, getUser, signIn, signOut, signedIn };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
