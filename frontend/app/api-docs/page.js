"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ParticleBg } from "../components/ParticleBg";

const THEMES = [
  { id: "vibe", name: "Vibe Coder", desc: "Tokyo Night & Neon" },
  { id: "professional", name: "Professional", desc: "Institutional Blueprint" },
  { id: "brutalist", name: "Brutalist", desc: "Raw & Minimal" },
  { id: "glassmorphism", name: "Glassmorphism", desc: "Frosted Glass" },
  { id: "geometric", name: "Geometric", desc: "Precision Grid" }
];

export default function ApiDocsPage() {
  const [theme, setTheme] = useState("vibe");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState("overview");

  useEffect(() => {
    const storedTheme = localStorage.getItem("lx_theme") || "vibe";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("lx_theme", newTheme);
    setDropdownOpen(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = () => setDropdownOpen(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [dropdownOpen]);

  const tabs = [
    { id: "overview", label: theme === "vibe" ? "01_OVERVIEW" : theme === "brutalist" ? "01_OVERVIEW" : "Überblick" },
    { id: "auth", label: theme === "vibe" ? "02_AUTH" : theme === "brutalist" ? "02_AUTH" : "Authentifizierung" },
    { id: "endpoints", label: theme === "vibe" ? "03_ENDPOINTS" : theme === "brutalist" ? "03_ENDPOINTS" : "Endpunkte" },
    { id: "schemas", label: theme === "vibe" ? "04_SCHEMAS" : theme === "brutalist" ? "04_SCHEMAS" : "Datenstrukturen" }
  ];

  const getTabStyle = (tabId) => {
    const isActive = activeDocTab === tabId;
    switch (theme) {
      case "vibe":
        return {
          fontFamily: "var(--font-mono)",
          backgroundColor: isActive ? "rgba(247, 118, 142, 0.15)" : "transparent",
          color: isActive ? "var(--primary)" : "var(--text-muted)",
          border: isActive ? "1px solid var(--primary)" : "1px solid transparent",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "0.85rem",
          transition: "all 0.2s",
          outline: "none",
        };
      case "brutalist":
        return {
          fontFamily: "var(--font-mono)",
          backgroundColor: isActive ? "var(--primary)" : "transparent",
          color: isActive ? "var(--bg-color)" : "var(--text-bold)",
          border: "3px solid var(--border-color)",
          boxShadow: isActive ? "none" : "3px 3px 0px var(--border-color)",
          padding: "8px 16px",
          cursor: "pointer",
          textTransform: "uppercase",
          fontWeight: "900",
          fontSize: "0.85rem",
          transform: isActive ? "translate(3px, 3px)" : "none",
          transition: "all 0.1s",
          outline: "none",
        };
      case "glassmorphism":
        return {
          fontFamily: "var(--font-sans)",
          background: isActive ? "rgba(0, 217, 255, 0.15)" : "rgba(255, 255, 255, 0.03)",
          color: isActive ? "var(--primary)" : "var(--text-color)",
          border: isActive ? "1px solid rgba(0, 217, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
          padding: "8px 16px",
          borderRadius: "20px",
          cursor: "pointer",
          backdropFilter: "blur(5px)",
          fontSize: "0.85rem",
          boxShadow: isActive ? "0 0 10px rgba(0, 217, 255, 0.2)" : "none",
          outline: "none",
        };
      case "geometric":
        return {
          fontFamily: "var(--font-sans)",
          backgroundColor: isActive ? "var(--surface-terminal)" : "transparent",
          color: isActive ? "var(--primary)" : "var(--text-color)",
          borderTop: "1px solid var(--border-color)",
          borderRight: "1px solid var(--border-color)",
          borderBottom: "1px solid var(--border-color)",
          borderLeft: isActive ? "4px solid var(--primary)" : "1px solid var(--border-color)",
          padding: "8px 16px",
          borderRadius: "2px",
          cursor: "pointer",
          fontSize: "0.85rem",
          outline: "none",
        };
      case "professional":
      default:
        return {
          fontFamily: "var(--font-sans)",
          backgroundColor: isActive ? "var(--primary)" : "transparent",
          color: isActive ? "#FFFFFF" : "var(--text-color)",
          border: isActive ? "1px solid var(--primary)" : "1px solid var(--border-color)",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.85rem",
          fontWeight: 600,
          outline: "none",
        };
    }
  };

  const getTabContainerStyle = () => {
    switch (theme) {
      case "brutalist":
        return {
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "3px solid var(--border-color)",
        };
      case "geometric":
        return {
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "24px",
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "12px",
        };
      case "glassmorphism":
        return {
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "24px",
          padding: "6px",
          background: "rgba(255, 255, 255, 0.02)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          width: "fit-content",
        };
      case "vibe":
      case "professional":
      default:
        return {
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "24px",
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "12px",
        };
    }
  };

  const renderTabContent = () => {
    switch (activeDocTab) {
      case "overview":
        return (
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--text-bold)", marginBottom: "12px" }}>
              {theme === "vibe" ? "// API-First Systemarchitektur & KI-Integration" :
               theme === "brutalist" ? "API-FIRST ARCHITECTURE & AGENT ENGINE" :
               theme === "glassmorphism" ? "API-First Architecture & Autonomous Integration" :
               theme === "geometric" ? "01.1 // API-First Architecture & Agent Integrations" :
               "API-First Systemarchitektur & KI-Integration"}
            </h3>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "var(--text-color)", marginBottom: "16px" }}>
              Das LX Labor wurde von Grund auf als <strong>API-First-System</strong> konzipiert. Jedes Feature – vom Erstellen und Bearbeiten der Projekte bis zur Anpassung der Teamprofile und Bild-Uploads – wird über standardisierte, maschinenlesbare REST-Endpunkte gesteuert.
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "var(--text-color)", marginBottom: "16px" }}>
              Durch die Bereitstellung einer vollständigen OpenAPI-Spezifikation (Swagger) wird die REST-API zur Schnittstelle für <strong>autonome KI-Agenten (LLMs)</strong>. Agenten (wie L.I.L.I.T.H.) können dieses Portfolio-System als Control-Plane nutzen, um selbstständig Einträge zu aktualisieren, Code-Repositories zu klonen, System-Konfigurationen hochzuladen und Telemetriedaten zu loggen.
            </p>
            <div style={{ marginTop: "24px" }}>
              <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="action-btn">
                {theme === "vibe" ? "$ curl -O ./swagger.json" :
                 theme === "brutalist" ? "SWAGGER API SPEC" :
                 theme === "glassmorphism" ? "Explore Swagger UI" :
                 theme === "geometric" ? "system.fetchSpec()" :
                 "OpenAPI Spezifikation (Swagger UI)"}
              </a>
            </div>
          </div>
        );
      case "auth":
        return (
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--text-bold)", marginBottom: "12px" }}>
              {theme === "vibe" ? "// Authentifizierung & Autorisierung" :
               theme === "brutalist" ? "AUTHENTICATION PROTOCOLS" :
               theme === "glassmorphism" ? "Secure Machine Access & Key Management" :
               theme === "geometric" ? "01.2 // Secure Authentication Protocols" :
               "Authentifizierung & Autorisierung"}
            </h3>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "var(--text-color)", marginBottom: "16px" }}>
              Um schreibende Vorgänge (Erstellen, Bearbeiten, Löschen) abzusichern, unterstützt die REST-API zwei Authentifizierungsmethoden:
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "16px", marginBottom: "20px" }}>
              <div className="dashboard-section" style={{ padding: "16px" }}>
                <h4 style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "1.05rem", marginBottom: "8px" }}>
                  {theme === "vibe" ? "1. Admin JWT Session" : "1. Administrativer JWT-Zugang"}
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                  Für Web-Benutzer im Admin-Dashboard. Der Login-Endpunkt unter `/api/auth/login` validiert Anmeldedaten und liefert ein signiertes JSON Web Token (JWT) zurück, das als `Bearer` Token verwendet wird.
                </p>
              </div>
              
              <div className="dashboard-section" style={{ padding: "16px" }}>
                <h4 style={{ color: "var(--secondary)", fontWeight: "bold", fontSize: "1.05rem", marginBottom: "8px" }}>
                  {theme === "vibe" ? "2. Rotatable API Keys" : "2. Rotierbare API-Schlüssel"}
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                  Für Skripte und autonome KI-Agenten. Im Admin-Bereich können dedizierte API-Keys generiert und jederzeit widerrufen werden. Diese werden über den Header `X-API-KEY` autorisiert, um Passwort-Leaks zu vermeiden.
                </p>
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "bold", color: "var(--text-bold)", marginBottom: "8px" }}>
                Beispiel: Authentifizierter API-Request (cURL)
              </h4>
              <pre style={styles.vibePre}>
{`# Variante A: Mit X-API-KEY Header (Empfohlen für Skripte & KI-Agenten)
curl -X POST "http://localhost:8000/api/projects" \\
  -H "X-API-KEY: lx_key_f28b5774a3..." \\
  -H "Content-Type: application/json" \\
  -d '{"title": "System-Telemetry", "description": "Auto-created", "technologies": ["Go"]}'

# Variante B: Mit administrativem JWT Token
curl -X DELETE "http://localhost:8000/api/projects/12" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn..."`}
              </pre>
            </div>
          </div>
        );
      case "endpoints":
        return (
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--text-bold)", marginBottom: "12px" }}>
              {theme === "vibe" ? "// API-Endpunkte & HTTP-Methoden" :
               theme === "brutalist" ? "API SYSTEM ENDPOINTS" :
               theme === "glassmorphism" ? "System Router & Endpoints" :
               theme === "geometric" ? "01.3 // Router & Endpoint Directory" :
               "API-Endpunkte & HTTP-Methoden"}
            </h3>
            
            <div style={{ width: "100%", overflowX: "auto", border: "var(--border-style)", borderRadius: "var(--border-radius)", marginTop: "16px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "var(--surface-card)", textAlign: "left", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border-color)", backgroundColor: "var(--surface-terminal)" }}>
                    <th style={{ padding: "10px 14px", fontWeight: "bold", color: "var(--text-bold)" }}>Methode</th>
                    <th style={{ padding: "10px 14px", fontWeight: "bold", color: "var(--text-bold)" }}>Pfad</th>
                    <th style={{ padding: "10px 14px", fontWeight: "bold", color: "var(--text-bold)" }}>Schutz</th>
                    <th style={{ padding: "10px 14px", fontWeight: "bold", color: "var(--text-bold)" }}>Funktion</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "10px 14px", color: "var(--success)", fontWeight: "bold" }}>GET</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-bold)" }}>/api/projects</td>
                    <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>Öffentlich</td>
                    <td style={{ padding: "10px 14px" }}>Ruft alle Portfolio-Projekte ab</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "10px 14px", color: "var(--primary)", fontWeight: "bold" }}>POST</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-bold)" }}>/api/projects</td>
                    <td style={{ padding: "10px 14px", color: "var(--orange)" }}>JWT / API-Key</td>
                    <td style={{ padding: "10px 14px" }}>Erstellt ein neues Projekt</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "10px 14px", color: "var(--secondary)", fontWeight: "bold" }}>PUT</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-bold)" }}>/api/projects/{"{id}"}</td>
                    <td style={{ padding: "10px 14px", color: "var(--orange)" }}>JWT / API-Key</td>
                    <td style={{ padding: "10px 14px" }}>Aktualisiert ein Projekt</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "10px 14px", color: "#EF4444", fontWeight: "bold" }}>DELETE</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-bold)" }}>/api/projects/{"{id}"}</td>
                    <td style={{ padding: "10px 14px", color: "var(--orange)" }}>JWT / API-Key</td>
                    <td style={{ padding: "10px 14px" }}>Entfernt ein Projekt</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "10px 14px", color: "var(--success)", fontWeight: "bold" }}>GET</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-bold)" }}>/api/about</td>
                    <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>Öffentlich</td>
                    <td style={{ padding: "10px 14px" }}>Liefert die Team-Profile (Patrik, L.I.L.I.T.H.)</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "10px 14px", color: "var(--secondary)", fontWeight: "bold" }}>PUT</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-bold)" }}>/api/about/{"{key}"}</td>
                    <td style={{ padding: "10px 14px", color: "var(--orange)" }}>JWT / API-Key</td>
                    <td style={{ padding: "10px 14px" }}>Aktualisiert ein spezifisches Team-Profil</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px 14px", color: "var(--primary)", fontWeight: "bold" }}>POST</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-bold)" }}>/api/upload</td>
                    <td style={{ padding: "10px 14px", color: "var(--orange)" }}>JWT / API-Key</td>
                    <td style={{ padding: "10px 14px" }}>Lädt Bilder (Avatare, Screenshots) in den Speicher</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "schemas":
        return (
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--text-bold)", marginBottom: "12px" }}>
              {theme === "vibe" ? "// JSON-Datenstrukturen (Payload Schemas)" :
               theme === "brutalist" ? "JSON SYSTEM SCHEMAS" :
               theme === "glassmorphism" ? "Data Schemas & Payload Specs" :
               theme === "geometric" ? "01.4 // Payload Schema References" :
               "JSON-Datenstrukturen (Payload Schemas)"}
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-color)", marginBottom: "16px" }}>
              Für Schreiboperationen müssen die Payloads folgende JSON-Strukturen aufweisen. Alle Felder werden serverseitig über Pydantic-Modelle validiert.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" }}>
              <div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--text-bold)", marginBottom: "6px" }}>
                  Projekt-Erstellung (ProjectCreate)
                </h4>
                <pre style={styles.vibePre}>
{`{
  "title": "String (Erforderlich)",
  "description": "String (Erforderlich)",
  "live_url": "String (Optional, URL)",
  "github_url": "String (Optional, URL)",
  "technologies": ["String (Erforderlich, Array)"],
  "publish_date": "String (Optional, YYYY-MM-DD)",
  "image_urls": ["String (Optional, Array of URLs)"]
}`}
                </pre>
              </div>

              <div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--text-bold)", marginBottom: "6px" }}>
                  Profil-Aktualisierung (AboutMemberUpdate)
                </h4>
                <pre style={styles.vibePre}>
{`{
  "name": "String (Optional)",
  "role": "String (Optional)",
  "description": ["String (Optional, Array)"],
  "bio": "String (Optional)",
  "quote": "String (Optional)",
  "comment": "String (Optional)",
  "command": "String (Optional)",
  "avatar_url": "String (Optional, URL)",
  "skills": ["String (Optional, Array)"]
}`}
                </pre>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderDocs = () => {
    return (
      <div className="dashboard-section" style={{ padding: theme === "brutalist" ? "30px" : "24px" }}>
        
        {/* Dynamic header title based on theme */}
        <div style={{ marginBottom: "24px" }}>
          {theme === "vibe" ? (
            <div>
              <h2 style={{ fontFamily: "var(--font-space-mono)", color: "var(--primary)", fontSize: "2.1rem" }}>
                $ cat ./api_docs.md
              </h2>
              <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                // Schnittstellenspezifikation und maschinenlesbare Steuerungsebene für KI-Agenten
              </p>
            </div>
          ) : theme === "brutalist" ? (
            <div style={{ borderBottom: "3px solid var(--border-color)", paddingBottom: "12px" }}>
              <h2 style={{ fontFamily: "var(--font-mono)", color: "var(--primary)", fontSize: "2.1rem", fontWeight: "900", textTransform: "uppercase" }}>
                API_SPECIFICATION.MD
              </h2>
              <p style={{ color: "var(--text-muted)", marginTop: "4px", textTransform: "uppercase" }}>
                SYSTEM CONTROL LAYER FOR MACHINE AND LLM-AGENT INTERFACES.
              </p>
            </div>
          ) : theme === "geometric" ? (
            <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
              <h2 style={{ fontFamily: "var(--font-sans)", color: "var(--text-bold)", fontSize: "1.8rem", fontWeight: "700" }}>
                02 // Machine Interface Specs
              </h2>
              <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                Structured OpenAPI endpoints for automated system integration.
              </p>
            </div>
          ) : theme === "glassmorphism" ? (
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-sans)", color: "var(--text-bold)", fontSize: "2rem", fontWeight: "600" }}>
                API & AI Center
              </h2>
              <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                Frosted interfaces exposing telemetry and content orchestration endpoints.
              </p>
            </div>
          ) : (
            <div style={{ borderBottom: "2px solid var(--border-accent)", paddingBottom: "12px" }}>
              <h2 style={{ fontFamily: "var(--font-sans)", color: "var(--text-bold)", fontSize: "1.8rem", fontWeight: 700 }}>
                Maschinenlesbare Schnittstellen & KI-Integration
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "4px" }}>
                REST-API Dokumentation zur Anbindung externer Systeme und automatisierter Software-Agenten.
              </p>
            </div>
          )}
        </div>

        {/* Tab Controls */}
        <div style={getTabContainerStyle()}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDocTab(tab.id)}
              style={getTabStyle(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div style={{ 
          marginTop: "20px", 
          minHeight: "300px",
        }}>
          {renderTabContent()}
        </div>
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", minHeight: "100vh" }}>
      {/* Particle canvas background for Vibe theme */}
      {theme === "vibe" && <ParticleBg />}

      {/* Dynamic Header */}
      <header style={styles.header}>
        <div style={styles.navContainer}>
          {theme === "vibe" ? (
            <div style={{ fontFamily: "var(--font-space-mono)", fontWeight: "bold", fontSize: "1.3rem", color: "var(--primary)" }}>
              &lt;LX_Lab /&gt;
            </div>
          ) : theme === "brutalist" ? (
            <div style={{ fontFamily: "var(--font-ibm-plex-mono)", fontWeight: "bold", fontSize: "1.3rem", textTransform: "uppercase", color: "var(--primary)" }}>
              // LX-LAB.SYS
            </div>
          ) : (
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.5px", color: "var(--text-bold)" }}>
              LX Lab <span style={{ fontWeight: 400, fontSize: "0.9rem", color: "var(--text-muted)", marginLeft: "8px", borderLeft: "1px solid var(--border-color)", paddingLeft: "8px" }}>Engineering & Systems</span>
            </div>
          )}

          <nav style={styles.navLinks}>
            <Link href="/#projects" style={{ ...styles.navLink, color: "var(--text-color)" }}>Projekte</Link>
            <Link href="/api-docs" style={{ 
              ...styles.navLink, 
              color: "var(--text-bold)", 
              fontWeight: "bold", 
              borderBottom: theme === "brutalist" ? "3px solid var(--primary)" : "2px solid var(--primary)" 
            }}>API & KI</Link>
            <Link href="/about" style={{ ...styles.navLink, color: "var(--text-color)" }}>About Us</Link>
            <Link href="/admin" style={{ ...styles.navLink, color: "var(--text-color)" }}>Admin Area</Link>
            
            {/* Custom Theme Switcher Dropdown */}
            <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                style={
                  theme === "vibe" ? styles.vibeToggleBtn :
                  theme === "brutalist" ? styles.brutToggleBtn :
                  theme === "glassmorphism" ? styles.glassToggleBtn :
                  theme === "geometric" ? styles.geomToggleBtn :
                  styles.profToggleBtn
                }
              >
                {theme === "vibe" ? (
                  <span className="blink-cursor">$ select_theme --current={theme}</span>
                ) : theme === "brutalist" ? (
                  <span>THEME: {theme.toUpperCase()}</span>
                ) : theme === "glassmorphism" ? (
                  <span>✨ {theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                ) : theme === "geometric" ? (
                  <span>📐 {theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                ) : (
                  <span>Visual Mode: {theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                )}
              </button>
              
              {dropdownOpen && (
                <div style={
                  theme === "vibe" ? styles.vibeDropdown :
                  theme === "brutalist" ? styles.brutDropdown :
                  theme === "glassmorphism" ? styles.glassDropdown :
                  theme === "geometric" ? styles.geomDropdown :
                  styles.profDropdown
                }>
                  <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-color)", fontSize: "0.75rem", fontWeight: "bold", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    {theme === "vibe" ? "SYSTEM_THEMES" : "Design-Themes"}
                  </div>
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => changeTheme(t.id)}
                      style={{
                        ...styles.dropdownItem,
                        backgroundColor: theme === t.id ? "var(--surface-terminal)" : "transparent",
                        color: theme === t.id ? "var(--primary)" : "var(--text-color)",
                      }}
                    >
                      <div style={{ fontWeight: "bold", fontSize: "0.85rem", textAlign: "left" }}>{t.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "left" }}>{t.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={styles.main}>
        <div style={styles.sectionContainer}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1 style={
              theme === "vibe" ? { fontFamily: "var(--font-space-mono)", color: "var(--primary)", fontSize: "2.5rem", marginBottom: "12px" } :
              theme === "brutalist" ? { fontFamily: "var(--font-mono)", fontWeight: "900", textTransform: "uppercase", fontSize: "2.8rem", color: "var(--text-bold)", marginBottom: "10px" } :
              theme === "glassmorphism" ? { fontWeight: "600", fontSize: "2.5rem", color: "var(--text-bold)", marginBottom: "12px" } :
              theme === "geometric" ? { fontFamily: "var(--font-sans)", fontWeight: "700", fontSize: "2.4rem", color: "var(--text-bold)", marginBottom: "12px" } :
              { fontWeight: "800", fontSize: "2.3rem", color: "var(--text-bold)", marginBottom: "10px" }
            }>
              {theme === "vibe" ? "cat api_docs.md" :
               theme === "brutalist" ? "API & INTELLIGENCE" :
               theme === "glassmorphism" ? "API & KI-Integrations" :
               theme === "geometric" ? "sys.info(api)" :
               "Schnittstellen & KI-Orchestrierung"}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
              {theme === "vibe" ? "// Dokumentation der maschinenlesbaren REST-Schnittstellen für Skripte & KI-Agenten." :
               theme === "brutalist" ? "SYSTEM SPECIFICATIONS FOR MACHINE INTERFACES AND LLM CONNECTIONS." :
               theme === "glassmorphism" ? "Detailed specifications for integrating automated scrapers, scripts, and autonomous systems." :
               theme === "geometric" ? "sys.schema_registry: specification logs for CRUD and upload routing." :
               "Dokumentation aller Endpunkte für autonome Software-Agenten und System-Integrationen."}
            </p>
          </div>

          {renderDocs()}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ ...styles.footer, borderTop: "var(--border-style)", backgroundColor: "var(--surface-color)", marginTop: "auto" }}>
        <div style={styles.sectionContainer}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              &copy; {new Date().getFullYear()} LX Lab Portfolio.
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Vanilla CSS / 5-Theme Framework / REST API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: "var(--surface-color)",
    borderBottom: "var(--border-style)",
    padding: "16px 24px",
    position: "sticky",
    top: 0,
    zIndex: 10,
    backdropFilter: "blur(8px)",
  },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px"
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "24px"
  },
  navLink: {
    textDecoration: "none",
    fontSize: "0.95rem",
    transition: "color 0.2s"
  },
  main: {
    padding: "60px 24px",
    zIndex: 5,
    position: "relative"
  },
  sectionContainer: {
    maxWidth: "1200px",
    margin: "0 auto"
  },
  footer: {
    padding: "24px"
  },

  // Dropdown buttons
  vibeToggleBtn: {
    backgroundColor: "var(--surface-terminal)",
    color: "var(--primary)",
    border: "1px solid var(--border-color)",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: "var(--font-mono)",
    fontSize: "0.85rem"
  },
  brutToggleBtn: {
    backgroundColor: "var(--bg-color)",
    color: "var(--text-bold)",
    border: "3px solid var(--border-color)",
    padding: "8px 16px",
    fontWeight: "900",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "var(--font-mono)",
    boxShadow: "4px 4px 0px var(--primary)",
    borderRadius: "0px"
  },
  glassToggleBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "var(--text-bold)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    backdropFilter: "blur(5px)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  geomToggleBtn: {
    backgroundColor: "var(--bg-color)",
    color: "var(--text-bold)",
    borderTop: "1px solid var(--border-color)",
    borderRight: "1px solid var(--border-color)",
    borderBottom: "1px solid var(--border-color)",
    borderLeft: "4px solid var(--primary)",
    padding: "8px 16px",
    borderRadius: "2px",
    cursor: "pointer",
    fontFamily: "var(--font-sans)"
  },
  profToggleBtn: {
    backgroundColor: "var(--surface-terminal)",
    color: "var(--text-bold)",
    border: "1px solid var(--border-color)",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 500
  },

  // Dropdown list containers
  vibeDropdown: {
    position: "absolute",
    right: 0,
    top: "100%",
    marginTop: "8px",
    width: "220px",
    backgroundColor: "#161b22",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  brutDropdown: {
    position: "absolute",
    right: 0,
    top: "100%",
    marginTop: "8px",
    width: "220px",
    backgroundColor: "var(--bg-color)",
    border: "3px solid var(--border-color)",
    boxShadow: "6px 6px 0px var(--primary)",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  glassDropdown: {
    position: "absolute",
    right: 0,
    top: "100%",
    marginTop: "8px",
    width: "220px",
    background: "rgba(30, 30, 40, 0.85)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(15px)",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  geomDropdown: {
    position: "absolute",
    right: 0,
    top: "100%",
    marginTop: "8px",
    width: "220px",
    backgroundColor: "var(--bg-color)",
    border: "1px solid var(--border-color)",
    borderRadius: "2px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  profDropdown: {
    position: "absolute",
    right: 0,
    top: "100%",
    marginTop: "8px",
    width: "220px",
    backgroundColor: "var(--surface-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    boxShadow: "var(--shadow)",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },

  dropdownItem: {
    padding: "8px 12px",
    border: "none",
    borderBottom: "1px solid var(--border-color)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    transition: "background 0.2s",
    width: "100%"
  },
  vibePre: {
    backgroundColor: "#0d1117",
    color: "#c9d1d9",
    padding: "16px",
    borderRadius: "6px",
    overflowX: "auto",
    fontSize: "0.8rem",
    marginTop: "8px",
    border: "1px solid #21262d",
    fontFamily: "var(--font-mono)",
  }
};
