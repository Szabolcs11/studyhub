import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../../constans";

type GoogleLoginButtonProps = {
  type: "login" | "register";
};

const GoogleLoginButton = ({ type }: GoogleLoginButtonProps) => {
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
      <GoogleLogin
        shape="square"
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
        size="large"
        text={type === "login" ? "signin_with" : "signup_with"}
      />
    </>
  );
};

export default GoogleLoginButton;
