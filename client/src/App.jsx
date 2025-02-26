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
import SmallProjects from "./pages/SmallProjects";
import Faqs from "./pages/Faqs";
import FaqForm from "./components/forms/FaqForm";
import Exam from "./pages/Exam";
import ExamProject from "./pages/ExamProject";

function App() {
  const { signedIn } = useAuthContext();
  const routes = useRoutes([
    {
      path: "/",
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
          path: "smallprojects",
          element: <SmallProjects />,
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
        {
          path: "faqs",
          element: <Faqs />,
          children: [
            {
              path: "add",
              element: <FaqForm />,
            },
            {
              path: "edit/:id",
              element: <FaqForm isEditMode={true} />,
            },
          ],
        },
        {
          path: "exam",
          element: <Exam />,
        },
        {
          path: "examproject",
          element: <ExamProject />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
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
