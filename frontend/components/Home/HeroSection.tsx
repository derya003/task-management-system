import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero-root">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Görev Yönetimi Platformu
        </div>

        <h1 className="hero-title">
          Görevlerinizi{" "}
          <span className="hero-title-accent">Kolayca Yönetin</span>
        </h1>

        <p className="hero-desc">
          Task Manager ile görevlerinizi planlayın, takibini yapın ve
          hedeflerinize ulaşın. Modern, güvenli ve kullanıcı dostu bir
          deneyim sizi bekliyor.
        </p>

        <div className="hero-features">
          {[
            "Gerçek zamanlı görev takibi",
            "Rol tabanlı yetki sistemi",
            "Dosya ekleme & yönetimi",
          ].map((text) => (
            <div key={text} className="hero-feature">
              <span className="hero-feature-icon">✓</span>
              {text}
            </div>
          ))}
        </div>

        <div className="hero-actions">
          <Link href="/login" className="hero-btn hero-btn--primary">
            Hemen Giriş Yap
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link href="/register" className="hero-btn hero-btn--outline">
            Kayıt Ol
          </Link>
        </div>
      </div>

      <style>{`
        .hero-root {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem 6rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 620px;
          animation: fadeUp 0.5s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: #7c3aed;
          background: #faf5ff;
          border: 1px solid #e9d5ff;
          padding: 0.3rem 0.85rem;
          border-radius: 20px;
          margin-bottom: 1.5rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .hero-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #7c3aed;
          animation: pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        .hero-title {
          font-size: clamp(2.4rem, 5vw, 3.5rem);
          font-weight: 800;
          color: #1f2937;
          line-height: 1.15;
          margin: 0 0 1.25rem;
          letter-spacing: -0.03em;
        }

        .hero-title-accent {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-size: 1.05rem;
          color: #6b7280;
          line-height: 1.75;
          margin: 0 0 1.75rem;
          max-width: 500px;
        }

        .hero-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          justify-content: center;
          margin-bottom: 2.25rem;
        }

        .hero-feature {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.85rem;
          color: #4b5563;
          font-weight: 500;
          background: #fff;
          border: 1px solid #e9d5ff;
          border-radius: 20px;
          padding: 0.3rem 0.8rem;
        }

        .hero-feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #7c3aed;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .hero-actions {
          display: flex;
          gap: 0.85rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.8rem 1.6rem;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 11px;
          text-decoration: none;
          transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .hero-btn:hover  { transform: translateY(-2px); }
        .hero-btn:active { transform: scale(0.97); }

        .hero-btn--primary {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          box-shadow: 0 4px 18px rgba(109, 40, 217, 0.35);
        }
        .hero-btn--primary:hover {
          box-shadow: 0 8px 26px rgba(109, 40, 217, 0.45);
        }

        .hero-btn--outline {
          background: #fff;
          color: #7c3aed;
          border: 1.5px solid #c4b5fd;
          box-shadow: 0 2px 8px rgba(109, 40, 217, 0.08);
        }
        .hero-btn--outline:hover {
          background: #faf5ff;
          border-color: #7c3aed;
        }
      `}</style>
    </section>
  );
}