"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ParticleBg } from "./components/ParticleBg";

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: "Paperclip AI",
    description: "An intelligent document management system (DMS) with integrated local LLM capabilities, real-time OCR parsing, and vector semantic search. Users can upload PDFs, auto-extract text via Tesseract OCR, index paragraphs in a local vector database, and chat with files securely using offline Ollama models.",
    live_url: "https://paperclip.laxxx-lab.de",
    github_url: "https://github.com/lxx-lab/paperclip-ai",
    technologies: ["Next.js", "FastAPI", "PostgreSQL", "Ollama", "ChromaDB", "Docker"],
    publish_date: "2026-03-15",
    image_urls: []
  },
  {
    id: 2,
    title: "LX Teams",
    description: "A high-performance workspace featuring canvas collaboration, real-time sprint boarding via WebSockets, and automatic story point velocity estimation. Designed with strict security policies and visual workflow controls for distributed engineering departments.",
    live_url: null,
    github_url: "https://github.com/lxx-lab/lx-teams",
    technologies: ["React", "Node.js", "Express", "Socket.io", "MongoDB", "TailwindCSS"],
    publish_date: "2026-01-10",
    image_urls: []
  },
  {
    id: 3,
    title: "AION Telemetry",
    description: "A lightweight system administration dashboard providing cluster resource telemetry, Docker container lifecycle controls, and automated backup orchestration. Exposes historical metrics in a visual graph display.",
    live_url: "http://localhost:8000/docs",
    github_url: "https://github.com/lxx-lab/aion-telemetry",
    technologies: ["Vue.js", "Go", "Docker API", "InfluxDB", "Chart.js"],
    publish_date: "2025-11-28",
    image_urls: []
  }
];

const THEMES = [
  { id: "vibe", name: "Vibe Coder", desc: "Tokyo Night & Neon" },
  { id: "professional", name: "Professional", desc: "Institutional Blueprint" },
  { id: "brutalist", name: "Brutalist", desc: "Raw & Minimal" },
  { id: "glassmorphism", name: "Glassmorphism", desc: "Frosted Glass" },
  { id: "geometric", name: "Geometric", desc: "Precision Grid" }
];

export default function Home() {
  const [theme, setTheme] = useState("vibe");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [enlargedImage, setEnlargedImage] = useState(null);
  const hoverTimerRef = useRef(null);
  const activeProjectIdRef = useRef(null);

  const handleCardMouseEnter = (project) => {
    if (project.image_urls && project.image_urls.length > 0) {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      activeProjectIdRef.current = project.id;
      hoverTimerRef.current = setTimeout(() => {
        if (activeProjectIdRef.current === project.id) {
          setEnlargedImage(project.image_urls[0]);
        }
      }, 2000);
    }
  };

  const handleCardMouseLeave = (project) => {
    if (activeProjectIdRef.current === project.id) {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      activeProjectIdRef.current = null;
    }
  };

  const handleCardClick = (project, e) => {
    if (e.target.tagName === 'A' || e.target.closest('a') || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    const url = project.live_url || project.github_url;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Load theme from localStorage on client mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("lx_theme") || "vibe";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);

    // Fetch projects from backend
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.length > 0 ? data : FALLBACK_PROJECTS);
      } else {
        setProjects(FALLBACK_PROJECTS);
      }
    } catch (err) {
      console.warn("Backend API not reachable. Using fallback projects data.");
      setProjects(FALLBACK_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

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

  const renderHero = () => {
    switch (theme) {
      case "vibe":
        return (
          <div className="bouncy-text" style={styles.vibeHero}>
            <div style={styles.vibeQuote}>
              💡 &quot;Geordnetes Chaos. Pure Joy. Elite Code.&quot; — Tokyo Night Vibes
            </div>
            <h1 style={styles.vibeTitle}>
              Web-Entwickler & <br />
              <span style={{ color: "var(--secondary)" }}>API Architect</span>
            </h1>
            <p style={styles.vibeSubtitle}>
              Willkommen im LX Lab. Hier entstehen reaktive Webanwendungen mit automatisierter OpenAPI-Dokumentation für nahtlose KI-Agenten-Integration.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <Link href="/#projects" style={styles.vibeHeroBtnPrimary}>$ cat ./projects.md</Link>
              <Link href="/api-docs" style={styles.vibeHeroBtnSecondary}>$ curl -X GET /api-docs</Link>
            </div>
          </div>
        );
      case "brutalist":
        return (
          <div style={styles.brutHero}>
            <div style={styles.brutBadge}>NO FLUFF. JUST CODE.</div>
            <h1 style={styles.brutTitle}>
              API ARCHITECTURE &<br />
              SYSTEM DEVELOPMENT
            </h1>
            <p style={styles.brutSubtitle}>
              RAW CODE FOCUSED WEB APPLICATIONS. FULL OPENAPI DOCUMENTATION LAYER FOR AUTONOMOUS AI AGENT ORCHESTRATION. ZERO DECORATION. MAX SPEED.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <Link href="/#projects" className="action-btn">LIST PROJECTS</Link>
              <Link href="/api-docs" className="action-btn" style={{ backgroundColor: "transparent", color: "var(--text-bold)", border: "3px solid var(--border-color)" }}>CURL API SCHEMA</Link>
            </div>
          </div>
        );
      case "glassmorphism":
        return (
          <div style={styles.glassHero}>
            <div style={styles.glassBadge}>✨ Sophisticated Depth & Translucency</div>
            <h1 style={styles.glassTitle}>
              Elegance Meets <span style={{ color: "var(--primary)" }}>Engineering</span>
            </h1>
            <p style={styles.glassSubtitle}>
              Developing modern digital systems with frosted layers, smooth transitions, and machine-readable REST interfaces.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <Link href="/#projects" className="action-btn">Discover Work</Link>
              <Link href="/api-docs" className="action-btn" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "var(--text-bold)" }}>API Spec</Link>
            </div>
          </div>
        );
      case "geometric":
        return (
          <div style={styles.geomHero}>
            <div style={styles.geomBadge}>📐 Mathematical Precision Grid</div>
            <h1 style={styles.geomTitle}>
              Structured Code & <span style={{ color: "var(--secondary)" }}>Modular Systems</span>
            </h1>
            <p style={styles.geomSubtitle}>
              Designing web platforms with clean proportions, consistent grids, and fully structured OpenAPI schemas.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <Link href="/#projects" className="action-btn">Catalog.open()</Link>
              <Link href="/api-docs" className="action-btn" style={{ background: "transparent", border: "1px solid var(--border-color)", color: "var(--text-bold)" }}>docs.fetchSchema()</Link>
            </div>
          </div>
        );
      case "professional":
      default:
        return (
          <div style={styles.profHero}>
            <div style={styles.profAlert}>
              🛡️ Sicherheit, Stabilität und absolute Klarheit im Dienste der Allgemeinheit. (WCAG AAA)
            </div>
            <h1 style={styles.profTitle}>
              Systemarchitektur & Portfoliomanagement
            </h1>
            <p style={styles.profSubtitle}>
              Offizielle digitale Übersicht über die Web-Dienste und Systemkomponenten des LX Labors. Diese Plattform entspricht den Richtlinien barrierefreier Webangebote und stellt standardisierte OpenAPI-Schnittstellen für administrative Datenprozesse bereit.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <Link href="/#projects" style={styles.profHeroBtnPrimary}>Datenkatalog öffnen</Link>
              <Link href="/api-docs" style={styles.profHeroBtnSecondary}>Schnittstellendokumentation</Link>
            </div>
          </div>
        );
    }
  };

  const renderProjects = () => {
    if (projects.length === 0) {
      return (
        <div style={{ padding: "40px", textAlign: "center", fontFamily: "var(--font-mono)" }}>
          Keine Projekte in der Datenbank vorhanden.
        </div>
      );
    }

    switch (theme) {
      case "vibe":
        return (
          <div style={styles.vibeGrid}>
            {projects.map((p) => (
              <div 
                key={p.id} 
                className="project-card"
                onClick={(e) => handleCardClick(p, e)}
                onMouseEnter={() => handleCardMouseEnter(p)}
                onMouseLeave={() => handleCardMouseLeave(p)}
                style={{ cursor: (p.live_url || p.github_url) ? "pointer" : "default" }}
              >
                {/* MacOS Terminal top bar */}
                <div style={styles.macBar}>
                  <div style={styles.macDots}>
                    <span style={{ ...styles.macDot, backgroundColor: "#FF5F56" }}></span>
                    <span style={{ ...styles.macDot, backgroundColor: "#FFBD2E" }}></span>
                    <span style={{ ...styles.macDot, backgroundColor: "#27C93F" }}></span>
                  </div>
                  <div style={styles.macTitle}>
                    {p.title.toLowerCase().replace(/\s+/g, "_")}.config
                  </div>
                </div>
                {/* Card Image */}
                {p.image_urls && p.image_urls.length > 0 && (
                  <div style={{ width: "100%", height: "180px", overflow: "hidden", borderBottom: "1px solid var(--border-color)" }}>
                    <img src={p.image_urls[0]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                {/* Card Content */}
                <div style={styles.vibeCardContent}>
                  <h3 style={{ fontFamily: "var(--font-space-mono)", color: "var(--secondary)", fontSize: "1.2rem", marginBottom: "12px" }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "20px", color: "var(--text-color)" }}>
                    {p.description}
                  </p>
                  
                  {/* Simulated Code block */}
                  <div style={styles.vibeCodeBlock}>
                    <span style={{ color: "var(--primary)" }}>const</span> techStack = [<br />
                    &nbsp;&nbsp;{p.technologies.map(t => `"${t}"`).join(", ")}<br />
                    ];
                  </div>

                  <div style={styles.vibeCardFooter}>
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noopener noreferrer" style={styles.vibeCardLink}>
                        $ git clone {p.title.toLowerCase().replace(/\s+/g, "-")}
                      </a>
                    )}
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noopener noreferrer" style={{ ...styles.vibeCardLink, color: "var(--success)" }}>
                        $ npm run deploy --lx-lab
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "brutalist":
        return (
          <div style={styles.brutalistGrid}>
            {projects.map((p) => (
              <div 
                key={p.id} 
                className="project-card"
                onClick={(e) => handleCardClick(p, e)}
                onMouseEnter={() => handleCardMouseEnter(p)}
                onMouseLeave={() => handleCardMouseLeave(p)}
                style={{ cursor: (p.live_url || p.github_url) ? "pointer" : "default" }}
              >
                {p.image_urls && p.image_urls.length > 0 && (
                  <div style={{ width: "100%", height: "200px", overflow: "hidden", borderBottom: "3px solid var(--border-color)" }}>
                    <img src={p.image_urls[0]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }} />
                  </div>
                )}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ textTransform: "uppercase", fontFamily: "var(--font-mono)", fontSize: "1.3rem", fontWeight: "900", color: "var(--text-bold)", marginBottom: "10px" }}>
                    {p.title}
                  </h3>
                  <p style={{ color: "var(--text-color)", fontSize: "0.9rem", lineHeight: "1.4", flex: 1, marginBottom: "16px" }}>
                    {p.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                    {p.technologies.map((t, idx) => (
                      <span key={idx} className="badge" style={{ textTransform: "uppercase", border: "2px solid var(--border-color)", borderRadius: 0 }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "10px", marginTop: "auto", borderTop: "3px solid var(--border-color)", paddingTop: "14px" }}>
                    {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="action-btn">VISIT SITE</a>}
                    {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="action-btn" style={{ backgroundColor: "transparent", border: "3px solid var(--border-color)", color: "var(--text-bold)", boxShadow: "none" }}>SOURCE</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "glassmorphism":
        return (
          <div style={styles.glassGrid}>
            {projects.map((p) => (
              <div 
                key={p.id} 
                className="project-card"
                onClick={(e) => handleCardClick(p, e)}
                onMouseEnter={() => handleCardMouseEnter(p)}
                onMouseLeave={() => handleCardMouseLeave(p)}
                style={{ cursor: (p.live_url || p.github_url) ? "pointer" : "default" }}
              >
                {p.image_urls && p.image_urls.length > 0 && (
                  <div style={{ width: "100%", height: "180px", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <img src={p.image_urls[0]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ color: "var(--text-bold)", fontSize: "1.25rem", fontWeight: "600", marginBottom: "8px" }}>
                    {p.title}
                  </h3>
                  <p style={{ color: "var(--text-color)", fontSize: "0.9rem", lineHeight: "1.5", flex: 1, marginBottom: "20px" }}>
                    {p.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                    {p.technologies.map((t, idx) => (
                      <span key={idx} style={{ padding: "4px 10px", fontSize: "0.75rem", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--primary)" }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "12px", marginTop: "auto" }}>
                    {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="action-btn">Live View</a>}
                    {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="action-btn" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "var(--text-bold)" }}>GitHub</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "geometric":
        return (
          <div style={styles.geomGrid}>
            {projects.map((p) => (
              <div 
                key={p.id} 
                className="project-card"
                onClick={(e) => handleCardClick(p, e)}
                onMouseEnter={() => handleCardMouseEnter(p)}
                onMouseLeave={() => handleCardMouseLeave(p)}
                style={{ cursor: (p.live_url || p.github_url) ? "pointer" : "default" }}
              >
                {p.image_urls && p.image_urls.length > 0 && (
                  <div style={{ width: "100%", height: "180px", overflow: "hidden", borderBottom: "1px solid var(--border-color)" }}>
                    <img src={p.image_urls[0]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontFamily: "var(--font-sans)", color: "var(--text-bold)", fontSize: "1.2rem", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", marginBottom: "12px" }}>
                    {p.title}
                  </h3>
                  <p style={{ color: "var(--text-color)", fontSize: "0.9rem", lineHeight: "1.5", flex: 1, marginBottom: "20px" }}>
                    {p.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                    {p.technologies.map((t, idx) => (
                      <span key={idx} className="badge" style={{ borderColor: "var(--primary)", color: "var(--primary)", borderRadius: "2px" }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
                    {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="action-btn">Run Project</a>}
                    {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="action-btn" style={{ background: "transparent", color: "var(--text-bold)", border: "1px solid var(--border-color)" }}>Source Repo</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "professional":
      default:
        return (
          <div style={styles.profTableContainer}>
            <table style={styles.profTable}>
              <thead>
                <tr style={styles.profTableHeaderRow}>
                  <th style={styles.profTableHeader}>Verfahren / System</th>
                  <th style={styles.profTableHeader}>Systembeschreibung & Verwendungszweck</th>
                  <th style={styles.profTableHeader}>Technologischer Stack</th>
                  <th style={styles.profTableHeader}>Bereitstellung</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr 
                    key={p.id} 
                    style={{ ...styles.profTableRow, cursor: (p.live_url || p.github_url) ? "pointer" : "default" }}
                    onClick={(e) => handleCardClick(p, e)}
                    onMouseEnter={() => handleCardMouseEnter(p)}
                    onMouseLeave={() => handleCardMouseLeave(p)}
                  >
                    <td style={styles.profTableCellName}>{p.title}</td>
                    <td style={styles.profTableCellDesc}>{p.description}</td>
                    <td style={styles.profTableCellTech}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {p.technologies.map((t, idx) => (
                          <span key={idx} className="badge" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-bold)" }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={styles.profTableCellActions}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {p.live_url && (
                          <a href={p.live_url} target="_blank" rel="noopener noreferrer" style={styles.profTableBtn}>
                            Dienst aufrufen
                          </a>
                        )}
                        {p.github_url && (
                          <a href={p.github_url} target="_blank" rel="noopener noreferrer" style={styles.profTableBtnSecondary}>
                            Quellcode (Repository)
                          </a>
                        )}
                        {!p.live_url && !p.github_url && (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Interner Betrieb</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Tokyo Night Particle canvas only for Vibe theme */}
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
            <Link href="/api-docs" style={{ ...styles.navLink, color: "var(--text-color)" }}>API & KI</Link>
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

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          {renderHero()}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" style={styles.contentSection}>
        <div style={styles.sectionContainer}>
          {theme === "vibe" ? (
            <div style={{ marginBottom: "40px" }}>
              <h2 style={{ fontFamily: "var(--font-space-mono)", color: "var(--primary)", fontSize: "2rem" }}>
                $ ls ./projects/
              </h2>
              <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                Realisierte Anwendungen und Tools im Tokyo-Night-Grid
              </p>
            </div>
          ) : theme === "brutalist" ? (
            <div style={{ marginBottom: "32px", borderBottom: "3px solid var(--border-color)", paddingBottom: "12px" }}>
              <h2 style={{ fontFamily: "var(--font-mono)", color: "var(--primary)", fontSize: "2rem", fontWeight: "900", textTransform: "uppercase" }}>
                PROJECTS.LOG
              </h2>
              <p style={{ color: "var(--text-muted)", marginTop: "4px", textTransform: "uppercase" }}>
                CATALOGUE OF BUILT APPLICATIONS & MICROSERVICES.
              </p>
            </div>
          ) : theme === "geometric" ? (
            <div style={{ marginBottom: "32px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
              <h2 style={{ fontFamily: "var(--font-sans)", color: "var(--text-bold)", fontSize: "1.8rem", fontWeight: "700" }}>
                01 // System Catalogue
              </h2>
              <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                Grid precision display of verified deployment operations.
              </p>
            </div>
          ) : (
            <div style={{ marginBottom: "32px", borderBottom: "2px solid var(--border-accent)", paddingBottom: "12px" }}>
              <h2 style={{ fontFamily: "var(--font-sans)", color: "var(--text-bold)", fontSize: "1.8rem", fontWeight: 700 }}>
                Katalog der IT-Verfahren und Projekte
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "4px" }}>
                Übersicht aller aktiven Systeme und deren technologischer Grundlagen.
              </p>
            </div>
          )}

          {/* Conditional Projects Render */}
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", fontFamily: "var(--font-mono)" }}>
              Loading projects database...
            </div>
          ) : (
            renderProjects()
          )}
        </div>
      </section>



      {/* Footer */}
      <footer style={{ ...styles.footer, borderTop: "var(--border-style)", backgroundColor: "var(--surface-color)" }}>
        <div style={styles.sectionContainer}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              &copy; {new Date().getFullYear()} LX Lab Portfolio monorepo.
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              API-First / Vanilla CSS / React / Python FastAPI
            </p>
          </div>
        </div>
      </footer>

      {/* Screenshot Lightbox Overlay */}
      {enlargedImage && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.25s ease-out",
            padding: "20px"
          }}
          onClick={(e) => {
            e.stopPropagation();
            setEnlargedImage(null);
          }}
        >
          <div 
            style={{
              position: "relative",
              maxWidth: "85%",
              maxHeight: "85%",
              border: "3px solid var(--primary)",
              borderRadius: "16px",
              boxShadow: "0px 0px 40px var(--primary)",
              backgroundColor: "var(--surface-color)",
              padding: "10px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={enlargedImage} 
              alt="Enlarged project screenshot" 
              style={{ 
                maxWidth: "100%", 
                maxHeight: "75vh", 
                display: "block", 
                objectFit: "contain",
                borderRadius: "8px"
              }} 
            />
            <button 
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                backgroundColor: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontWeight: "900",
                fontSize: "1.4rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                transition: "all 0.2s"
              }}
              onClick={() => setEnlargedImage(null)}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1.0)"}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styling system using Javascript styles mapped to Vanilla CSS variables
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
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  navLink: {
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  vibeToggleBtn: {
    fontFamily: "var(--font-space-mono)",
    backgroundColor: "var(--surface-terminal)",
    color: "var(--primary)",
    border: "1px solid var(--primary)",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s ease",
  },
  profToggleBtn: {
    fontFamily: "var(--font-sans)",
    backgroundColor: "var(--primary)",
    color: "#FFFFFF",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "bold",
  },
  brutToggleBtn: {
    fontFamily: "var(--font-mono)",
    backgroundColor: "var(--primary)",
    color: "var(--bg-color)",
    border: "3px solid var(--border-color)",
    padding: "6px 14px",
    borderRadius: "0px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "900",
    textTransform: "uppercase",
    boxShadow: "3px 3px 0px var(--border-color)",
  },
  glassToggleBtn: {
    fontFamily: "var(--font-sans)",
    backgroundColor: "rgba(0, 217, 255, 0.15)",
    color: "var(--primary)",
    border: "1px solid rgba(0, 217, 255, 0.3)",
    backdropFilter: "blur(5px)",
    padding: "8px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  geomToggleBtn: {
    fontFamily: "var(--font-sans)",
    backgroundColor: "var(--bg-color)",
    color: "var(--text-bold)",
    border: "1px solid var(--border-color)",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  vibeDropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    backgroundColor: "#1e2335",
    border: "1px solid #383e5a",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    width: "220px",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
    overflow: "hidden",
  },
  profDropdown: {
    position: "absolute",
    top: "calc(100% + 4px)",
    right: 0,
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "4px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    width: "220px",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
    overflow: "hidden",
  },
  brutDropdown: {
    position: "absolute",
    top: "calc(100% + 6px)",
    right: 0,
    backgroundColor: "#0A0E27",
    border: "3px solid var(--border-color)",
    borderRadius: "0px",
    boxShadow: "4px 4px 0px var(--border-color)",
    width: "220px",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
    overflow: "hidden",
  },
  glassDropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    backgroundColor: "rgba(15, 20, 25, 0.85)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "12px",
    backdropFilter: "blur(15px)",
    boxShadow: "0 10px 30px rgba(0, 217, 255, 0.15)",
    width: "220px",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
    overflow: "hidden",
  },
  geomDropdown: {
    position: "absolute",
    top: "calc(100% + 6px)",
    right: 0,
    backgroundColor: "#1C2242",
    border: "1px solid var(--border-color)",
    borderRadius: "2px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    width: "220px",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: "8px 12px",
    border: "none",
    backgroundColor: "transparent",
    color: "var(--text-color)",
    cursor: "pointer",
    fontSize: "0.8rem",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    transition: "background-color 0.2s ease",
    borderBottom: "1px solid rgba(128,128,128,0.1)",
  },
  heroSection: {
    padding: "80px 24px",
    borderBottom: "var(--border-style)",
  },
  heroContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  vibeHero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  vibeQuote: {
    fontFamily: "var(--font-space-mono)",
    backgroundColor: "var(--surface-terminal)",
    color: "var(--orange)",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.85rem",
    border: "1px solid var(--border-color)",
    marginBottom: "20px",
  },
  vibeTitle: {
    fontFamily: "var(--font-poppins)",
    fontWeight: 700,
    fontSize: "3rem",
    lineHeight: "1.1",
    color: "var(--text-bold)",
    marginBottom: "20px",
  },
  vibeSubtitle: {
    fontSize: "1.1rem",
    color: "var(--text-color)",
    maxWidth: "600px",
    lineHeight: "1.6",
    marginBottom: "30px",
  },
  vibeHeroBtnPrimary: {
    fontFamily: "var(--font-space-mono)",
    backgroundColor: "var(--primary)",
    color: "var(--bg-color)",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  vibeHeroBtnSecondary: {
    fontFamily: "var(--font-space-mono)",
    backgroundColor: "var(--surface-terminal)",
    color: "var(--secondary)",
    border: "1px solid var(--border-color)",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "0.9rem",
  },
  profHero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  profAlert: {
    fontFamily: "var(--font-sans)",
    backgroundColor: "#EFF6FF",
    color: "#1E40AF",
    padding: "8px 16px",
    borderRadius: "4px",
    fontSize: "0.85rem",
    fontWeight: 600,
    border: "1px solid #BFDBFE",
    marginBottom: "24px",
  },
  profTitle: {
    fontFamily: "var(--font-sans)",
    fontWeight: 800,
    fontSize: "2.6rem",
    color: "var(--text-bold)",
    letterSpacing: "-1px",
    marginBottom: "16px",
  },
  profSubtitle: {
    fontSize: "1.05rem",
    color: "var(--text-color)",
    maxWidth: "800px",
    lineHeight: "1.7",
    marginBottom: "24px",
  },
  profHeroBtnPrimary: {
    fontFamily: "var(--font-sans)",
    backgroundColor: "var(--primary)",
    color: "#FFFFFF",
    padding: "10px 20px",
    borderRadius: "4px",
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  profHeroBtnSecondary: {
    fontFamily: "var(--font-sans)",
    backgroundColor: "var(--surface-color)",
    color: "var(--text-bold)",
    border: "1px solid var(--border-color)",
    padding: "10px 20px",
    borderRadius: "4px",
    fontSize: "0.95rem",
    fontWeight: 500,
  },
  brutHero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  brutBadge: {
    fontFamily: "var(--font-mono)",
    backgroundColor: "var(--primary)",
    color: "var(--bg-color)",
    padding: "6px 14px",
    fontSize: "0.85rem",
    fontWeight: "900",
    border: "3px solid var(--border-color)",
    marginBottom: "20px",
  },
  brutTitle: {
    fontFamily: "var(--font-mono)",
    fontWeight: "900",
    fontSize: "2.8rem",
    lineHeight: "1.05",
    color: "var(--text-bold)",
    marginBottom: "20px",
    textTransform: "uppercase",
  },
  brutSubtitle: {
    fontFamily: "var(--font-sans)",
    fontSize: "1rem",
    color: "var(--text-color)",
    maxWidth: "700px",
    lineHeight: "1.6",
    marginBottom: "30px",
  },
  glassHero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  glassBadge: {
    fontFamily: "var(--font-sans)",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "var(--primary)",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    marginBottom: "20px",
  },
  glassTitle: {
    fontFamily: "var(--font-sans)",
    fontWeight: "800",
    fontSize: "3.2rem",
    lineHeight: "1.1",
    color: "var(--text-bold)",
    marginBottom: "20px",
  },
  glassSubtitle: {
    fontSize: "1.1rem",
    color: "var(--text-color)",
    maxWidth: "600px",
    lineHeight: "1.6",
    marginBottom: "30px",
  },
  geomHero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  geomBadge: {
    fontFamily: "var(--font-mono)",
    border: "1px solid var(--primary)",
    color: "var(--primary)",
    padding: "4px 12px",
    borderRadius: "2px",
    fontSize: "0.85rem",
    marginBottom: "20px",
  },
  geomTitle: {
    fontFamily: "var(--font-sans)",
    fontWeight: "700",
    fontSize: "3rem",
    lineHeight: "1.1",
    color: "var(--text-bold)",
    marginBottom: "20px",
  },
  geomSubtitle: {
    fontSize: "1.05rem",
    color: "var(--text-color)",
    maxWidth: "650px",
    lineHeight: "1.65",
    marginBottom: "30px",
  },
  contentSection: {
    padding: "60px 24px",
  },
  sectionContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  vibeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "24px",
  },
  brutalistGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "30px",
  },
  glassGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "24px",
  },
  geomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px",
  },
  macBar: {
    backgroundColor: "var(--surface-terminal)",
    padding: "12px",
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
    fontFamily: "var(--font-space-mono)",
    color: "var(--text-muted)",
    fontSize: "0.75rem",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  },
  vibeCardContent: {
    padding: "20px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  vibeCodeBlock: {
    fontFamily: "var(--font-mono)",
    backgroundColor: "var(--surface-terminal)",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    lineHeight: "1.4",
    color: "var(--text-bold)",
    borderLeft: "3px solid var(--accent)",
    marginBottom: "20px",
  },
  vibeCardFooter: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    borderTop: "1px solid var(--border-color)",
    paddingTop: "16px",
  },
  vibeCardLink: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.8rem",
    color: "var(--primary)",
    cursor: "pointer",
  },
  profTableContainer: {
    width: "100%",
    overflowX: "auto",
    border: "var(--border-style)",
    borderRadius: "var(--border-radius)",
    boxShadow: "var(--shadow)",
  },
  profTable: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "var(--surface-card)",
    textAlign: "left",
  },
  profTableHeaderRow: {
    backgroundColor: "var(--surface-terminal)",
    borderBottom: "2px solid var(--border-color)",
  },
  profTableHeader: {
    padding: "14px 18px",
    fontWeight: "700",
    color: "var(--text-bold)",
    fontSize: "0.9rem",
  },
  profTableRow: {
    borderBottom: "1px solid var(--border-color)",
  },
  profTableCellName: {
    padding: "16px 18px",
    fontWeight: "700",
    color: "var(--text-bold)",
    fontSize: "0.95rem",
    verticalAlign: "top",
    width: "200px",
  },
  profTableCellDesc: {
    padding: "16px 18px",
    color: "var(--text-color)",
    fontSize: "0.9rem",
    lineHeight: "1.6",
    verticalAlign: "top",
  },
  profTableCellTech: {
    padding: "16px 18px",
    verticalAlign: "top",
    width: "220px",
  },
  profTableCellActions: {
    padding: "16px 18px",
    verticalAlign: "top",
    width: "200px",
  },
  profTableBtn: {
    display: "inline-block",
    fontFamily: "var(--font-sans)",
    backgroundColor: "var(--primary)",
    color: "#FFFFFF",
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "0.8rem",
    fontWeight: 600,
    textAlign: "center",
  },
  profTableBtnSecondary: {
    display: "inline-block",
    fontFamily: "var(--font-sans)",
    backgroundColor: "var(--surface-terminal)",
    color: "var(--text-bold)",
    border: "1px solid var(--border-color)",
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "0.8rem",
    fontWeight: 500,
    textAlign: "center",
  },
  vibeTerminalDocs: {
    fontFamily: "var(--font-mono)",
    backgroundColor: "var(--surface-terminal)",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    fontSize: "0.85rem",
    lineHeight: "1.5",
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
  },
  profDocsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  profDocCard: {
    backgroundColor: "var(--surface-card)",
    border: "var(--border-style)",
    borderRadius: "var(--border-radius)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  footer: {
    padding: "24px",
    marginTop: "auto",
  }
};
