import React, { useState, useEffect } from "react";
import axios from "axios";
import { ENDPOINTS } from "../../constans";
import { toast } from "react-toastify";
import "./Settings.css";
import type { User } from "../../types/courses";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

type SettingsProps = {
  user: User;
};

function Settings({ user }: SettingsProps) {
  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSuccess, setIsSuccess] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(ENDPOINTS.AUTHENTICATE, {}, { withCredentials: true });
        if (!response.data.success) {
          toast.error("A beállításokhoz bejelentkezés szükséges!");
          window.location.href = "/auth/login";
        }
      } catch {
        toast.error("A beállításokhoz bejelentkezés szükséges!");
        window.location.href = "/auth/login";
      }
    };

    checkAuth();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "A jelenlegi jelszó megadása kötelező";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Az új jelszó megadása kötelező";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Az új jelszónak legalább 8 karakter hosszúnak kell lennie";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "A jelszó megerősítése kötelező";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "A megadott jelszavak nem egyeznek";
    }

    if (formData.currentPassword === formData.newPassword && formData.newPassword) {
      newErrors.newPassword = "Az új jelszónak különböznie kell a jelenlegitől";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        ENDPOINTS.CHANGE_PASSWORD,
        {
          CurrentPassword: formData.currentPassword,
          NewPassword: formData.newPassword,
          NewPasswordConfirm: formData.confirmPassword,
        },
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success("Jelszó sikeresen megváltoztatva!");
        setIsSuccess(true);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        setErrors({ general: response.data.message || "Hiba történt a jelszó módosítása közben" });
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Hiba történt a jelszó módosítása közben";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Beállítások</h1>
        <p>Kezeld a fiókod beállításait és jelszavadat</p>
      </div>

      <div className="settings-content">
        <div className="settings-card">
          <div className="card-header">
            <h2>Fiók információk</h2>
            <p>Áttekintés a fiókod adatairól</p>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email cím:</span>
              <span className="info-value">{user.Email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fiók létrehozva:</span>
              <span className="info-value">
                {" "}
                {new Date(user.CreatedAt).toLocaleString("hu-HU", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Utolsó bejelentkezés:</span>
              <span className="info-value">
                {new Date(user.LastLogin).toLocaleString("hu-HU", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="settings-card">
          <div className="card-header">
            <h2>Jelszó módosítása</h2>
            <p>Változtasd meg a jelszavadat a fiókod biztonsága érdekében</p>
          </div>

          {isSuccess && (
            <div className="success-message">
              <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Jelszó sikeresen megváltoztatva!</span>
            </div>
          )}

          {errors.general && (
            <div className="error-message">
              <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="password-form">
            {/* Current Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">
                Jelenlegi jelszó *
              </label>
              <div className="password-input-container">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.currentPassword ? "error" : ""}`}
                  placeholder="Add meg a jelenlegi jelszavad"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility("current")}
                  disabled={isLoading}
                >
                  {showPasswords.current ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m22.82 22.82l-3.59-3.59"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.currentPassword && <span className="error-text">{errors.currentPassword}</span>}
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">
                Új jelszó *
              </label>
              <div className="password-input-container">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.newPassword ? "error" : ""}`}
                  placeholder="Add meg az új jelszavad"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility("new")}
                  disabled={isLoading}
                >
                  {showPasswords.new ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m22.82 22.82l-3.59-3.59"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Jelszó megerősítése *
              </label>
              <div className="password-input-container">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                  placeholder="Add meg újra az új jelszavad"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility("confirm")}
                  disabled={isLoading}
                >
                  {showPasswords.confirm ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m22.82 22.82l-3.59-3.59"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })}
                disabled={isLoading}
              >
                Visszaállítás
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Feldolgozás...
                  </>
                ) : (
                  "Jelszó módosítása"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
