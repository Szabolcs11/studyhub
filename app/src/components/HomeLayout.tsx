import { Outlet } from "react-router-dom";

function HomeLayout() {
  return (
    <section>
      <Outlet />
    </section>
  );
}

export default HomeLayout;
