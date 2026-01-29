import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../constans";
import { PATHS } from "../../navigator/Routes";
import { FormInput } from "./Components/FormInput";
import { loginSchema } from "./schemas";

interface LoginFormData {
  email: string;
  password: string;
}

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        ENDPOINTS.LOGIN,
        {
          Email: data.email,
          Password: data.password,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message || "Bejelentkezési hiba történt");
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Bejelentkezési hiba történt";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-logo">SH</div>
        <h1 className="auth-title">Üdv újra!</h1>
        <p className="auth-subtitle">Jelentkezz be a StudyHub fiókodba</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput<LoginFormData>
          name="email"
          control={control}
          label="Email cím"
          placeholder="Lássuk ki ez a hős"
          error={errors.email?.message}
        />

        <FormInput<LoginFormData>
          name="password"
          control={control}
          label="Jelszó"
          placeholder="Jelszó"
          error={errors.password?.message}
          showPasswordToggle={true}
          showPassword={showPassword}
          onPasswordToggle={() => setShowPassword(!showPassword)}
        />

        <button type="submit" className={`auth-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
          {isLoading ? "Bejelentkezés..." : "Bejelentkezés"}
        </button>

        <div className="auth-links">
          <div className="auth-link">
            <a href={PATHS.REGISTER}>Még nincs fiókod? Regisztrálj itt</a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
