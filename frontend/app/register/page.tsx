"use client";
import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import InputField from "@/components/InputField";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const res = await api.post("/api/auth/register", form);

      if (res.status === 201) {
        setIsSuccess(true);
        setMessage("Kayıt başarılı! Artık giriş yapabilirsiniz.");
        setForm({ name: "", email: "", password: "" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Hata:", error.message);
      }
      setIsSuccess(false);
      setMessage("Kayıt başarısız. Bu e-posta zaten kullanımda olabilir.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-root">
      <div className="register-card">
        {/* Logo */}
        <div className="register-logo-wrap">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="8"
              r="4"
              stroke="white"
              strokeWidth="1.5"
              fill="rgba(255,255,255,0.2)"
            />
            <path
              d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M19 11v6M16 14h6"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="register-title">Hesap Oluştur</h1>
        <p className="register-subtitle">Birkaç adımda kayıt olun</p>

        {isSuccess ? (
          /* Başarı ekranı */
          <div className="register-success" role="status" aria-live="polite">
            <div className="register-success-icon">
              <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="#7c3aed" strokeWidth="2" />
                <path
                  d="M10 16l4 4 8-8"
                  stroke="#7c3aed"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="register-success-title">Kayıt Başarılı!</h2>
            <p className="register-success-text">
              Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.
            </p>
            <Link href="/login" className="register-success-btn">
              Giriş Yap →
            </Link>
          </div>
        ) : (
          /* Form */
          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <InputField
              label="Ad Soyad"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Derya Durgun"
              required
            />

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

            <p className="register-password-hint">
              En az 8 karakter, bir büyük harf ve bir rakam içermeli.
            </p>

            <button
              type="submit"
              className="register-btn"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="register-spinner" />
                  Kayıt yapılıyor...
                </>
              ) : (
                "Kayıt Ol"
              )}
            </button>
          </form>
        )}

        {/* Hata mesajı */}
        {message && !isSuccess && (
          <div
            className="register-message register-message--error"
            role="alert"
            aria-live="assertive"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
              <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {message}
          </div>
        )}

        {!isSuccess && (
          <p className="register-footer">
            Zaten hesabın var mı?{" "}
            <Link href="/login" className="register-login-link">
              Giriş Yap
            </Link>
          </p>
        )}
      </div>

      <style>{`
        .register-root {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100svh;
          padding: 1.5rem;
          background: linear-gradient(135deg, #ede9fe 0%, #dbeafe 50%, #e0e7ff 100%);
          font-family: 'Inter', system-ui, sans-serif;
        }

        .register-card {
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

        .register-logo-wrap {
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

        .register-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #3b0764;
          margin: 0 0 0.3rem;
          letter-spacing: -0.02em;
        }

        .register-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 1.75rem;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
        }

        .register-password-hint {
          font-size: 0.75rem;
          color: #9ca3af;
          margin: -0.35rem 0 0;
        }

        .register-btn {
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
        .register-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(109, 40, 217, 0.4);
        }
        .register-btn:active:not(:disabled) { transform: scale(0.98); }
        .register-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .register-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Başarı */
        .register-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0 1rem;
          animation: fadeUp 0.3s ease;
        }
        .register-success-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #faf5ff;
          border: 2px solid #d8b4fe;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .register-success-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #3b0764;
          margin: 0;
        }
        .register-success-text {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
          max-width: 260px;
        }
        .register-success-btn {
          display: inline-flex;
          align-items: center;
          margin-top: 0.5rem;
          padding: 0.65rem 1.5rem;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 10px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(109, 40, 217, 0.3);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .register-success-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(109, 40, 217, 0.4);
        }

        /* Hata mesajı */
        .register-message {
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
        .register-message--error {
          background: #fef3f2;
          color: #7f1d1d;
          border: 1px solid #fca5a5;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .register-footer {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 1.5rem 0 0;
          text-align: center;
        }

        .register-login-link {
          color: #7c3aed;
          font-weight: 600;
          text-decoration: none;
        }
        .register-login-link:hover { text-decoration: underline; }
      `}</style>
    </main>
  );
}