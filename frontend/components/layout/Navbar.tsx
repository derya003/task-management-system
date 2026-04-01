"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar-root">
      {/* Logo */}
      <Link href="/" className="navbar-logo">
        <div className="navbar-logo-mark">TM</div>
        <span className="navbar-logo-text">
          Task<span className="navbar-logo-accent">Manager</span>
        </span>
      </Link>

      {/* Actions */}
      <div className="navbar-actions">
        {pathname !== "/login" && (
          <Link href="/login" className="navbar-btn navbar-btn--outline">
            Giriş Yap
          </Link>
        )}
        {pathname !== "/register" && (
          <Link href="/register" className="navbar-btn navbar-btn--primary">
            Kayıt Ol
          </Link>
        )}
      </div>

      <style>{`
        .navbar-root {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 2rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(109, 40, 217, 0.1);
          box-shadow: 0 2px 12px rgba(109, 40, 217, 0.06);
          position: sticky;
          top: 0;
          z-index: 50;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
        }

        .navbar-logo-mark {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(109, 40, 217, 0.3);
          letter-spacing: 0.02em;
          flex-shrink: 0;
        }

        .navbar-logo-text {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1f2937;
          letter-spacing: -0.02em;
        }

        .navbar-logo-accent {
          color: #7c3aed;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .navbar-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.55rem 1.1rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 9px;
          text-decoration: none;
          transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .navbar-btn:hover  { transform: translateY(-1px); }
        .navbar-btn:active { transform: scale(0.97); }

        .navbar-btn--outline {
          color: #7c3aed;
          border: 1.5px solid #c4b5fd;
          background: #fff;
        }
        .navbar-btn--outline:hover {
          background: #faf5ff;
          border-color: #7c3aed;
        }

        .navbar-btn--primary {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          box-shadow: 0 3px 12px rgba(109, 40, 217, 0.3);
        }
        .navbar-btn--primary:hover {
          box-shadow: 0 5px 18px rgba(109, 40, 217, 0.4);
        }
      `}</style>
    </nav>
  );
}