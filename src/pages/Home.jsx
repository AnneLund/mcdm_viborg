import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";

const Home = () => {
  return (
    <article>
      <Navigation />
      <Outlet />
    </article>
  );
};

export default Home;
