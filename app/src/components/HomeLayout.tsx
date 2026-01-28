import { Outlet } from "react-router-dom";
import Layout from "./Layout";

function HomeLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default HomeLayout;
