import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../constans";
import { PATHS } from "../../navigator/Routes";
import { FormInput } from "./Components/FormInput";
import { registerSchema } from "./schemas";

interface RegisterFormData {
  nickname: string;
  email: string;
  password: string;
  passwordagain: string;
}

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: { email: "", nickname: "", password: "", passwordagain: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        ENDPOINTS.REGISTER,
        {
          Nickname: data.nickname,
          Email: data.email,
          Password: data.password,
          PasswordConfirm: data.passwordagain,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success("Sikeres regisztráció! Jelentkezz be.");
        navigate("/auth/login");
      } else {
        toast.error(response.data.message || "Regisztrációs hiba történt");
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Regisztrációs hiba történt";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-logo">SH</div>
        <h1 className="auth-title">Csatlakozz a StudyHubhoz!</h1>
        <p className="auth-subtitle">Hozd létre a fiókod és kezdj el tanulni</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput<RegisterFormData>
          name="nickname"
          control={control}
          label="Felhasználónév"
          placeholder="Lássuk ki ez a hős"
          error={errors.nickname?.message}
        />

        <FormInput<RegisterFormData>
          name="email"
          control={control}
          label="Email cím"
          placeholder="email@egyetem.hu"
          error={errors.email?.message}
        />

        <FormInput<RegisterFormData>
          name="password"
          control={control}
          label="Jelszó"
          placeholder="Jelszó"
          error={errors.password?.message}
          showPasswordToggle={true}
          showPassword={showPassword}
          onPasswordToggle={() => setShowPassword(!showPassword)}
        />

        <FormInput<RegisterFormData>
          name="passwordagain"
          control={control}
          label="Jelszó megerősítése"
          placeholder="Jelszó megerősítése"
          showPasswordToggle={true}
          showPassword={showConfirmPassword}
          onPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          error={errors.passwordagain?.message}
        />

        <button type="submit" className={`auth-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
          {isLoading ? "Regisztráció..." : "Regisztráció"}
        </button>

        <div className="auth-links">
          <div className="auth-link">
            <a href={PATHS.LOGIN}>Van már fiókod? Jelentkezz be</a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
