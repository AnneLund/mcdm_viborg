import { Link, useRoutes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Projects from "./pages/Projects";
import Register from "./pages/register/Register";
import TermForm from "./components/forms/TermForm";
import Login from "./components/login/Login";
import { useAuthContext } from "./context/useAuthContext";
import Faqs from "./pages/Faqs";
import FaqForm from "./components/forms/FaqForm";
import Exam from "./pages/Exam";
import ExamProject from "./pages/ExamProject";
import ProjectForm from "./components/forms/ProjectForm";
import Project from "./pages/project/Project";
import Exercises from "./pages/Exercises";
import ExerciseForm from "./components/forms/ExerciseForm";
import Backoffice from "./pages/Backoffice";
import UserForm from "./components/forms/UserForm";
import Users from "./components/users/Users";
import PresentationSchema from "./pages/PresentationSchema";
import Events from "./pages/Events";
import EventForm from "./components/forms/EventForm";
import Navigation from "./components/Navigation";
import ChangePassword from "./components/forms/ChangePassword";
function App() {
  const { signedIn, user } = useAuthContext();
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
          children: [
            {
              path: "add",
              element: <ProjectForm />,
            },
            {
              path: "edit/:id",
              element: <ProjectForm isEditMode={true} />,
            },
          ],
        },
        {
          path: "projects/:id",
          element: <Project />,
          children: [
            {
              path: "edit/:id",
              element: <ProjectForm isEditMode={true} />,
            },
          ],
        },
        {
          path: "exercises",
          element: <Exercises />,
          children: [
            { path: "add", element: <ExerciseForm /> },
            { path: "edit/:id", element: <ExerciseForm isEditMode={true} /> },
          ],
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
        {
          path: "events",
          element: <Events />,
          children: [
            { path: "add", element: <EventForm /> },
            { path: "edit/:id", element: <EventForm isEditMode={true} /> },
          ],
        },
        {
          path: "change-password",
          element: <ChangePassword />,
        },
      ],
    },
    {
      path: "/backoffice",
      element: (
        <ProtectedRoute isAllowed={user.role === "admin"}>
          <Backoffice />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "users",
          element: <Users />,
          children: [
            { path: "add", element: <UserForm /> },
            { path: "edit/:id", element: <UserForm isEditMode={true} /> },
          ],
        },
        {
          path: "schema",
          element: <PresentationSchema />,
        },
        {
          path: "events",
          element: <Events />,
          children: [
            { path: "add", element: <EventForm /> },
            { path: "edit/:id", element: <EventForm isEditMode={true} /> },
          ],
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
      <Link to='/'>
        <img src='/assets/mcdm_logo.png' alt='logo' className='logo' />
      </Link>
      {location.pathname.includes("backoffice") && <Navigation />}
      {routes}
    </article>
  );
}

export default App;
