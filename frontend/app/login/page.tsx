"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import InputField from "@/components/InputField";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: number;
  email: string;
  role: "user" | "admin";
  exp: number;
}

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await api.post("/api/auth/login", form);

      if (res.status === 201 || res.status === 200) {
        const token = res.data.access_token;
        const decoded = jwtDecode<DecodedToken>(token);
        const role = decoded.role;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        setIsSuccess(true);
        setMessage("Giriş başarılı! Yönlendiriliyorsunuz...");

        setTimeout(() => {
          router.push("/tasks");
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setMessage("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-root">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-wrap">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
              fill="rgba(255,255,255,0.25)"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="login-title">Tekrar Hoşgeldiniz</h1>
        <p className="login-subtitle">Hesabınıza giriş yapın</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <InputField
            label="E-posta"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ornek@mail.com"
            required
          />

          <InputField
            label="Şifre"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <div className="login-forgot-row">
            <Link href="/forgot-password" className="login-forgot-link">
              Şifremi unuttum?
            </Link>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className="login-spinner" />
                Giriş yapılıyor...
              </>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>

        {message && (
          <div
            className={`login-message ${
              isSuccess ? "login-message--success" : "login-message--error"
            }`}
            role={isSuccess ? "status" : "alert"}
            aria-live="polite"
          >
            <span className="login-message-icon">
              {isSuccess ? (
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
                  <path
                    d="M5 8l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
                  <path
                    d="M8 5v3.5M8 11h.01"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
            {message}
          </div>
        )}

        <p className="login-footer">
          Hesabın yok mu?{" "}
          <Link href="/register" className="login-register-link">
            Kayıt Ol
          </Link>
        </p>
      </div>

      <style>{`
        .login-root {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100svh;
          padding: 1.5rem;
          background: linear-gradient(135deg, #ede9fe 0%, #dbeafe 50%, #e0e7ff 100%);
          font-family: 'Inter', system-ui, sans-serif;
        }

        .login-card {
          background: #fff;
          border-radius: 20px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 420px;
          box-shadow:
            0 0 0 1px rgba(109, 40, 217, 0.1),
            0 10px 40px rgba(109, 40, 217, 0.12),
            0 2px 8px rgba(0, 0, 0, 0.04);
          text-align: center;
        }

        .login-logo-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          margin-bottom: 1.1rem;
          box-shadow: 0 4px 14px rgba(109, 40, 217, 0.35);
        }

        .login-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #3b0764;
          margin: 0 0 0.3rem;
          letter-spacing: -0.02em;
        }

        .login-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 1.75rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
        }

        .login-forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -0.35rem;
        }

        .login-forgot-link {
          font-size: 0.8rem;
          color: #7c3aed;
          font-weight: 500;
          text-decoration: none;
        }
        .login-forgot-link:hover { text-decoration: underline; }

        .login-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          margin-top: 0.25rem;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          font-size: 0.95rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 14px rgba(109, 40, 217, 0.3);
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(109, 40, 217, 0.4);
        }
        .login-btn:active:not(:disabled) { transform: scale(0.98); }
        .login-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .login-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          margin-top: 1rem;
          padding: 0.65rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          animation: fadeUp 0.2s ease;
        }
        .login-message--success {
          background: #f0fdf4;
          color: #065f46;
          border: 1px solid #6ee7b7;
        }
        .login-message--error {
          background: #fef3f2;
          color: #7f1d1d;
          border: 1px solid #fca5a5;
        }
        .login-message-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-footer {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 1.5rem 0 0;
          text-align: center;
        }

        .login-register-link {
          color: #7c3aed;
          font-weight: 600;
          text-decoration: none;
        }
        .login-register-link:hover { text-decoration: underline; }
      `}</style>
    </main>
  );
}