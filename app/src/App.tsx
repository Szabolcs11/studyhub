import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigator from "./navigator";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Navigator />
      <ToastContainer />
    </GoogleOAuthProvider>
  );
}

export default App;
