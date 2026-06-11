"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ParticleBg } from "../../components/ParticleBg";

export default function AdminLogin() {
  const [theme, setTheme] = useState("vibe");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedTheme = localStorage.getItem("lx_theme") || "vibe";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);

    // If already logged in, redirect to admin panel
    if (localStorage.getItem("lx_token")) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("lx_token", data.access_token);
        router.push("/admin");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Zugangsdaten ungültig oder Server offline.");
      }
    } catch (err) {
      setError("Verbindung zum Authentifizierungsserver fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  const renderLoginHeader = () => {
    switch (theme) {
      case "vibe":
        return (
          <div style={styles.vibeMacHeader}>
            <div style={styles.macDots}>
              <span style={{ ...styles.macDot, backgroundColor: "#FF5F56" }}></span>
              <span style={{ ...styles.macDot, backgroundColor: "#FFBD2E" }}></span>
              <span style={{ ...styles.macDot, backgroundColor: "#27C93F" }}></span>
            </div>
            <div style={styles.macTitle}>sudo login --admin</div>
          </div>
        );
      case "brutalist":
        return (
          <div style={{ borderBottom: "3px solid var(--border-color)", padding: "16px", backgroundColor: "var(--primary)" }}>
            <h1 style={{ fontFamily: "var(--font-mono)", fontSize: "1.3rem", fontWeight: "900", color: "var(--bg-color)", textTransform: "uppercase", margin: 0 }}>
              ADMIN_LOGIN.EXE
            </h1>
          </div>
        );
      case "glassmorphism":
        return (
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "20px 24px", textAlign: "center" }}>
            <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "1.4rem", fontWeight: "600", color: "var(--text-bold)", margin: 0 }}>
              ✨ Administrative Portal
            </h1>
          </div>
        );
      case "geometric":
        return (
          <div style={{ borderBottom: "1px solid var(--border-color)", padding: "16px 20px" }}>
            <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "1.2rem", fontWeight: "700", color: "var(--text-bold)", margin: 0 }}>
              00 // Auth Node
            </h1>
          </div>
        );
      case "professional":
      default:
        return (
          <div style={styles.profTitleContainer}>
            <h1 style={styles.profTitle}>LX Lab Systemsteuerung</h1>
            <p style={styles.profSubtitle}>Gesichertes Login für Systemadministratoren</p>
          </div>
        );
    }
  };

  const getBoxStyle = () => {
    switch (theme) {
      case "vibe":
        return {
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--surface-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
          overflow: "hidden",
        };
      case "brutalist":
        return {
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--surface-card)",
          border: "3px solid var(--border-color)",
          borderRadius: "0px",
          boxShadow: "8px 8px 0px var(--border-color)",
          overflow: "hidden",
        };
      case "glassmorphism":
        return {
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          backdropFilter: "blur(15px)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          overflow: "hidden",
        };
      case "geometric":
        return {
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--surface-card)",
          border: "1px solid var(--border-color)",
          borderLeft: "5px solid var(--primary)",
          borderRadius: "4px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
        };
      case "professional":
      default:
        return {
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--surface-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "4px",
          boxShadow: "var(--shadow)",
          padding: "24px",
        };
    }
  };

  const getPaddingStyle = () => {
    if (theme === "professional") return { padding: 0 };
    return { padding: "24px" };
  };

  return (
    <div style={styles.container}>
      {/* Tokyo Night Particle Background when Vibe theme is active */}
      {theme === "vibe" && <ParticleBg />}

      <div style={getBoxStyle()}>
        {renderLoginHeader()}

        <div style={{ ...styles.cardBody, ...getPaddingStyle() }}>
          {theme === "vibe" && (
            <div style={{ marginBottom: "20px", color: "var(--orange)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
              [SECURITY WARNING]: UNLAWFUL ACCESS WILL BE LOGGED.
            </div>
          )}

          {error && (
            <div style={theme === "vibe" ? styles.vibeError : styles.profError}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Benutzername</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="theme-input"
                placeholder={theme === "vibe" ? "admin_id..." : theme === "brutalist" ? "ENTER USERNAME..." : "z.B. admin"}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Passwort</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="theme-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="action-btn"
              style={{ width: "100%", padding: "12px", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              {loading ? (
                <span>{theme === "vibe" ? "$ decrypting..." : "Verifizierung..."}</span>
              ) : (
                <span>{theme === "vibe" ? "$ enter --console" : theme === "brutalist" ? "AUTHENTICATE" : "Anmelden"}</span>
              )}
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Link href="/" style={{ fontSize: "0.85rem", color: "var(--primary)", textDecoration: "underline", fontFamily: "var(--font-mono)" }}>
              {theme === "vibe" ? "<-- back_to_root" : theme === "brutalist" ? "RETURN TO ROOT" : "Zurück zur Hauptseite"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "24px",
    backgroundColor: "var(--bg-color)",
  },
  vibeMacHeader: {
    backgroundColor: "var(--surface-terminal)",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid var(--border-color)",
    position: "relative",
  },
  macDots: {
    display: "flex",
    gap: "6px",
  },
  macDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  macTitle: {
    fontFamily: "var(--font-mono)",
    color: "var(--text-muted)",
    fontSize: "0.75rem",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  },
  profTitleContainer: {
    borderBottom: "2px solid var(--border-accent)",
    paddingBottom: "12px",
    marginBottom: "20px",
  },
  profTitle: {
    fontFamily: "var(--font-sans)",
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "var(--text-bold)",
  },
  profSubtitle: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    marginTop: "2px",
  },
  cardBody: {
    padding: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--text-bold)",
  },
  vibeError: {
    fontFamily: "var(--font-mono)",
    backgroundColor: "rgba(247, 118, 142, 0.1)",
    border: "1px solid var(--primary)",
    color: "var(--primary)",
    padding: "10px 12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    marginBottom: "16px",
  },
  profError: {
    fontFamily: "var(--font-sans)",
    backgroundColor: "#FEF2F2",
    border: "1px solid #F87171",
    color: "#B91C1C",
    padding: "10px 12px",
    borderRadius: "4px",
    fontSize: "0.85rem",
    marginBottom: "16px",
  },
};
