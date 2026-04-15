import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../../constans";

const GoogleLoginButton = () => {
  const handleSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;

    try {
      const res = await axios.post(
        ENDPOINTS.GOOGLE_LOGIN,
        {
          token,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        toast.error("Error", res.data.message);
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <>
      <GoogleLogin shape="square" onSuccess={handleSuccess} onError={() => console.log("Login Failed")} />
    </>
  );
};

export default GoogleLoginButton;
