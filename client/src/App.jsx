import { useRoutes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Projects from "./pages/Projects";
import Project from "./components/project/Project";
import Register from "./pages/register/Register";
import TermForm from "./components/forms/TermForm";
import Login from "./components/login/Login";
import { useAuthContext } from "./context/useAuthContext";

function App() {
  const { signedIn } = useAuthContext();
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      // Alle andre ruter beskyttes som children under en parent-route
      element: (
        <ProtectedRoute isAllowed={signedIn}>
          <Home />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "projects",
          element: <Projects />,
        },
        {
          path: "projects/:id",
          element: <Project />,
        },
        {
          path: "register",
          element: <Register />,
          children: [
            {
              path: "add",
              element: <TermForm />,
            },
            {
              path: "edit/:id",
              element: <TermForm isEditMode={true} />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <article className='app'>
      <img src='/assets/mcdm_logo.png' alt='logo' className='logo' />
      {routes}
    </article>
  );
}

export default App;
