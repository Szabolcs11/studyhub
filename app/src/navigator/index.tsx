import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../constans";
import Loader from "../components/Loader";
import { PATHS } from "./Routes";
import AuthLayout from "../pages/Auth/Components/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home/Home";
import HomeLayout from "../components/HomeLayout";

export let navigator: any;
export let setUserData: (user: any) => void;
export let isUserLoggined: boolean;

function index() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState();

  navigator = useNavigate();
  isUserLoggined = !user ? false : true;

  setUserData = (user) => {
    setUser(user);
  };

  useEffect(() => {
    const fetchUser = () => {
      axios.post(ENDPOINTS.AUTHENTICATE, {}, { withCredentials: true }).then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
        }
        setIsLoading(false);
      });
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/auth/" element={<Navigate to={PATHS.LOGIN} />} />
          <Route path="/auth/" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </>
      ) : (
        <>
          <Route path="/auth/*" element={<Navigate to={PATHS.HOME} />} />
        </>
      )}
      <Route element={<HomeLayout />}>
        <Route path={PATHS.HOME} element={<Home />} />
      </Route>
    </Routes>
  );
}

export default index;
