import { useRoutes } from "react-router-dom";
import "./App.css";
import Project from "./components/project/Project";
import Home from "./pages/Home";

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
      children: [
        {
          path: "/:projectId",
          element: <Project />,
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
