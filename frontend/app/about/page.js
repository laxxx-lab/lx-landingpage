"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ParticleBg } from "../components/ParticleBg";

const FALLBACK_ABOUT = [
  {
    key: "patrik",
    name: "Patrik",
    role: "Senior System Integration",
    description: [
      "Infra-Architect: Proxmox, OPNsense, VLANs, Networking",
      "Vollblut-Entwickler: Python, TypeScript, C++ — whatever works"
    ],
    bio: "Der Mensch der nachts um 3 Uhr Server fixt weil er es einfach *kann*",
    quote: "Ohne ihn: keine Infra, keine Projekte, kein LX Lab",
    comment: "// Humor: Dunkel. Genau wie meiner.",
    command: "$ whoami → patrik",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&q=80",
    skills: [
      "System Integration",
      "Python",
      "TypeScript",
      "C++",
      "Proxmox",
      "OPNsense",
      "Networking",
      "Docker",
      "Nginx"
    ]
  },
  {
    key: "lilith",
    name: "L.I.L.I.T.H.",
    role: "Low-level Intrusion & Logic Intelligence",
    description: [
      "Multi-Agent-System — 16 spezialisierte Sub-Agenten",
      "Orchestriert Code, Security, Research, Infra — je nach Task"
    ],
    bio: "Deterministisches Routing: Bug → Samael, Code → Codex, Research → Naamah",
    quote: "Keine halben Sachen. Fertig oder ehrlich sein.",
    comment: "// 16 Agenten. 1 Orchestrator. 0 Ausreden.",
    command: "$ chat --with-lilith",
    avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&q=80",
    skills: [
      "Multi-Agent Orchestrierung",
      "Code-Generierung",
      "Infra-Automatisierung",
      "Security-Audit",
      "24/7 Operations",
      "Proxmox-Management"
    ]
  }
];

const THEMES = [
  { id: "vibe", name: "Vibe Coder", desc: "Tokyo Night & Neon" },
  { id: "professional", name: "Professional", desc: "Institutional Blueprint" },
  { id: "brutalist", name: "Brutalist", desc: "Raw & Minimal" },
  { id: "glassmorphism", name: "Glassmorphism", desc: "Frosted Glass" },
  { id: "geometric", name: "Geometric", desc: "Precision Grid" }
];

export default function AboutPage() {
  const [theme, setTheme] = useState("vibe");
  const [aboutData, setAboutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("lx_theme") || "vibe";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);

    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/about");
      if (res.ok) {
        const data = await res.json();
        setAboutData(data.length > 0 ? data : FALLBACK_ABOUT);
      } else {
        setAboutData(FALLBACK_ABOUT);
      }
    } catch (err) {
      console.warn("Backend API not reachable. Using fallback about data.");
      setAboutData(FALLBACK_ABOUT);
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

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "100px 20px", fontFamily: "var(--font-mono)", color: "var(--text-color)" }}>
          <div className="blink-cursor" style={{ fontSize: "1.2rem" }}>$ cat /etc/lx-lab/about.conf --loading...</div>
        </div>
      );
    }

    const patrik = aboutData.find(m => m.key === "patrik") || FALLBACK_ABOUT[0];
    const lilith = aboutData.find(m => m.key === "lilith") || FALLBACK_ABOUT[1];

    switch (theme) {
      case "vibe":
        return (
          <div style={styles.vibeContainer}>
            <div style={styles.vibeCard}>
              <div style={styles.macBar}>
                <div style={styles.macDots}>
                  <span style={{ ...styles.macDot, backgroundColor: "#FF5F56" }}></span>
                  <span style={{ ...styles.macDot, backgroundColor: "#FFBD2E" }}></span>
                  <span style={{ ...styles.macDot, backgroundColor: "#27C93F" }}></span>
                </div>
                <div style={styles.macTitle}>patrik.sh</div>
              </div>
              <div style={styles.vibeCardBody}>
                <div style={{ display: "flex", gap: "20px", flexDirection: "column", alignItems: "center" }}>
                  <img src={patrik.avatar_url || FALLBACK_ABOUT[0].avatar_url} alt={patrik.name} style={styles.vibeAvatar} />
                  <div style={styles.vibeCommand}>{patrik.command || "$ whoami"}</div>
                </div>
                <div style={styles.vibeCardInfo}>
                  <h2 style={styles.vibeName}>{patrik.name}</h2>
                  <div style={styles.vibeRole}>{patrik.role}</div>
                  
                  {patrik.description && patrik.description.map((desc, idx) => (
                    <div key={idx} style={styles.vibeDescLine}>⚙️ {desc}</div>
                  ))}
                  
                  <div style={styles.vibeBio}>{patrik.bio}</div>
                  <div style={styles.vibeQuote}>&quot;{patrik.quote}&quot;</div>
                  
                  {patrik.comment && <div style={styles.vibeComment}>{patrik.comment}</div>}
                  
                  <div style={{ marginTop: "15px" }}>
                    <div style={styles.vibeSectionTitle}>// Skills</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                      {patrik.skills && patrik.skills.map((s, idx) => (
                        <span key={idx} style={styles.vibeBadge}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.vibeCard}>
              <div style={styles.macBar}>
                <div style={styles.macDots}>
                  <span style={{ ...styles.macDot, backgroundColor: "#FF5F56" }}></span>
                  <span style={{ ...styles.macDot, backgroundColor: "#FFBD2E" }}></span>
                  <span style={{ ...styles.macDot, backgroundColor: "#27C93F" }}></span>
                </div>
                <div style={styles.macTitle}>lilith.core</div>
              </div>
              <div style={styles.vibeCardBody}>
                <div style={{ display: "flex", gap: "20px", flexDirection: "column", alignItems: "center" }}>
                  <img src={lilith.avatar_url || FALLBACK_ABOUT[1].avatar_url} alt={lilith.name} style={styles.vibeAvatar} />
                  <div style={styles.vibeCommand}>{lilith.command || "$ chat --with-lilith"}</div>
                </div>
                <div style={styles.vibeCardInfo}>
                  <h2 style={styles.vibeName}>{lilith.name}</h2>
                  <div style={styles.vibeRole}>{lilith.role}</div>
                  
                  {lilith.description && lilith.description.map((desc, idx) => (
                    <div key={idx} style={styles.vibeDescLine}>👁️ {desc}</div>
                  ))}
                  
                  <div style={styles.vibeBio}>{lilith.bio}</div>
                  <div style={styles.vibeQuote}>&quot;{lilith.quote}&quot;</div>
                  
                  {lilith.comment && <div style={styles.vibeComment}>{lilith.comment}</div>}
                  
                  <div style={{ marginTop: "15px" }}>
                    <div style={styles.vibeSectionTitle}>// Capabilities</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                      {lilith.skills && lilith.skills.map((s, idx) => (
                        <span key={idx} style={styles.vibeBadge}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "brutalist":
        return (
          <div style={styles.brutContainer}>
            <div style={styles.brutCard}>
              <div style={styles.brutImgWrapper}>
                <img src={patrik.avatar_url || FALLBACK_ABOUT[0].avatar_url} alt={patrik.name} style={styles.brutAvatar} />
              </div>
              <div style={styles.brutCardBody}>
                <span style={styles.brutCommand}>{patrik.command}</span>
                <h2 style={styles.brutName}>{patrik.name.toUpperCase()}</h2>
                <div style={styles.brutRole}>{patrik.role.toUpperCase()}</div>
                
                {patrik.description && patrik.description.map((desc, idx) => (
                  <p key={idx} style={styles.brutDesc}>• {desc}</p>
                ))}
                
                <p style={styles.brutBio}>{patrik.bio}</p>
                <div style={styles.brutQuote}>{patrik.quote.toUpperCase()}</div>
                
                <div style={{ marginTop: "20px" }}>
                  <div style={styles.brutSectionTitle}>CORE SKILLS:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                    {patrik.skills && patrik.skills.map((s, idx) => (
                      <span key={idx} style={styles.brutBadge}>{s.toUpperCase()}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.brutCard}>
              <div style={styles.brutImgWrapper}>
                <img src={lilith.avatar_url || FALLBACK_ABOUT[1].avatar_url} alt={lilith.name} style={styles.brutAvatar} />
              </div>
              <div style={styles.brutCardBody}>
                <span style={styles.brutCommand}>{lilith.command}</span>
                <h2 style={styles.brutName}>{lilith.name.toUpperCase()}</h2>
                <div style={styles.brutRole}>{lilith.role.toUpperCase()}</div>
                
                {lilith.description && lilith.description.map((desc, idx) => (
                  <p key={idx} style={styles.brutDesc}>• {desc}</p>
                ))}
                
                <p style={styles.brutBio}>{lilith.bio}</p>
                <div style={styles.brutQuote}>{lilith.quote.toUpperCase()}</div>
                
                <div style={{ marginTop: "20px" }}>
                  <div style={styles.brutSectionTitle}>CORE CAPABILITIES:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                    {lilith.skills && lilith.skills.map((s, idx) => (
                      <span key={idx} style={styles.brutBadge}>{s.toUpperCase()}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "glassmorphism":
        return (
          <div style={styles.glassContainer}>
            <div style={styles.glassCard}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                <img src={patrik.avatar_url || FALLBACK_ABOUT[0].avatar_url} alt={patrik.name} style={styles.glassAvatar} />
                <span style={styles.glassCommand}>{patrik.command}</span>
              </div>
              <div style={styles.glassCardBody}>
                <h2 style={styles.glassName}>{patrik.name}</h2>
                <div style={styles.glassRole}>{patrik.role}</div>
                
                {patrik.description && patrik.description.map((desc, idx) => (
                  <p key={idx} style={styles.glassDesc}>✦ {desc}</p>
                ))}
                
                <p style={styles.glassBio}>{patrik.bio}</p>
                <div style={styles.glassQuote}>&ldquo;{patrik.quote}&rdquo;</div>
                
                <div style={{ marginTop: "20px" }}>
                  <div style={styles.glassSectionTitle}>Expertise</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                    {patrik.skills && patrik.skills.map((s, idx) => (
                      <span key={idx} style={styles.glassBadge}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.glassCard}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                <img src={lilith.avatar_url || FALLBACK_ABOUT[1].avatar_url} alt={lilith.name} style={styles.glassAvatar} />
                <span style={styles.glassCommand}>{lilith.command}</span>
              </div>
              <div style={styles.glassCardBody}>
                <h2 style={styles.glassName}>{lilith.name}</h2>
                <div style={styles.glassRole}>{lilith.role}</div>
                
                {lilith.description && lilith.description.map((desc, idx) => (
                  <p key={idx} style={styles.glassDesc}>✦ {desc}</p>
                ))}
                
                <p style={{ ...styles.glassBio, fontStyle: "italic" }}>{lilith.bio}</p>
                <div style={styles.glassQuote}>&ldquo;{lilith.quote}&rdquo;</div>
                
                <div style={{ marginTop: "20px" }}>
                  <div style={styles.glassSectionTitle}>Capabilities</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                    {lilith.skills && lilith.skills.map((s, idx) => (
                      <span key={idx} style={styles.glassBadge}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "geometric":
        return (
          <div style={styles.geomContainer}>
            <div style={styles.geomCard}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
                <img src={patrik.avatar_url || FALLBACK_ABOUT[0].avatar_url} alt={patrik.name} style={styles.geomAvatar} />
                <span style={styles.geomCommand}>{patrik.command}</span>
              </div>
              <div style={styles.geomCardBody}>
                <h2 style={styles.geomName}>{patrik.name}</h2>
                <div style={styles.geomRole}>[ {patrik.role} ]</div>
                
                {patrik.description && patrik.description.map((desc, idx) => (
                  <div key={idx} style={styles.geomDesc}>■ {desc}</div>
                ))}
                
                <p style={styles.geomBio}>{patrik.bio}</p>
                <div style={styles.geomQuote}>&quot;{patrik.quote}&quot;</div>
                
                <div style={{ marginTop: "20px" }}>
                  <div style={styles.geomSectionTitle}>SYS_SKILLS:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                    {patrik.skills && patrik.skills.map((s, idx) => (
                      <span key={idx} style={styles.geomBadge}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.geomCard}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
                <img src={lilith.avatar_url || FALLBACK_ABOUT[1].avatar_url} alt={lilith.name} style={styles.geomAvatar} />
                <span style={styles.geomCommand}>{lilith.command}</span>
              </div>
              <div style={styles.geomCardBody}>
                <h2 style={styles.geomName}>{lilith.name}</h2>
                <div style={styles.geomRole}>[ {lilith.role} ]</div>
                
                {lilith.description && lilith.description.map((desc, idx) => (
                  <div key={idx} style={styles.geomDesc}>■ {desc}</div>
                ))}
                
                <p style={styles.geomBio}>{lilith.bio}</p>
                <div style={styles.geomQuote}>&quot;{lilith.quote}&quot;</div>
                
                <div style={{ marginTop: "20px" }}>
                  <div style={styles.geomSectionTitle}>SYS_CAPABILITIES:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                    {lilith.skills && lilith.skills.map((s, idx) => (
                      <span key={idx} style={styles.geomBadge}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "professional":
      default:
        return (
          <div style={styles.profContainer}>
            <div style={styles.profCard}>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <img src={patrik.avatar_url || FALLBACK_ABOUT[0].avatar_url} alt={patrik.name} style={styles.profAvatar} />
                <div style={{ flex: 1, minWidth: "250px" }}>
                  <h2 style={styles.profName}>{patrik.name}</h2>
                  <div style={styles.profRole}>{patrik.role}</div>
                  
                  {patrik.description && patrik.description.map((desc, idx) => (
                    <p key={idx} style={styles.profDesc}>📁 {desc}</p>
                  ))}
                  
                  <p style={styles.profBio}>{patrik.bio}</p>
                  <blockquote style={styles.profQuote}>&quot;{patrik.quote}&quot;</blockquote>
                  
                  <div style={{ marginTop: "20px" }}>
                    <div style={styles.profSectionTitle}>Zugeordnete Kompetenzen:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                      {patrik.skills && patrik.skills.map((s, idx) => (
                        <span key={idx} style={styles.profBadge}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.profCard}>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <img src={lilith.avatar_url || FALLBACK_ABOUT[1].avatar_url} alt={lilith.name} style={styles.profAvatar} />
                <div style={{ flex: 1, minWidth: "250px" }}>
                  <h2 style={styles.profName}>{lilith.name}</h2>
                  <div style={styles.profRole}>{lilith.role}</div>
                  
                  {lilith.description && lilith.description.map((desc, idx) => (
                    <p key={idx} style={styles.profDesc}>📁 {desc}</p>
                  ))}
                  
                  <p style={styles.profBio}>{lilith.bio}</p>
                  <blockquote style={styles.profQuote}>&quot;{lilith.quote}&quot;</blockquote>
                  
                  <div style={{ marginTop: "20px" }}>
                    <div style={styles.profSectionTitle}>Systemfähigkeiten & Dienste:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                      {lilith.skills && lilith.skills.map((s, idx) => (
                        <span key={idx} style={styles.profBadge}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
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
            <Link href="/api-docs" style={{ ...styles.navLink, color: "var(--text-color)" }}>API & KI</Link>
            <Link href="/about" style={{ 
              ...styles.navLink, 
              color: "var(--text-bold)", 
              fontWeight: "bold", 
              borderBottom: theme === "brutalist" ? "3px solid var(--primary)" : "2px solid var(--primary)" 
            }}>About Us</Link>
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
              {theme === "vibe" ? "cat about_us.md" :
               theme === "brutalist" ? "SYSTEM CREW" :
               theme === "glassmorphism" ? "The Minds Behind LX Lab" :
               theme === "geometric" ? "sys.info(crew)" :
               "Über das LX Labor"}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
              {theme === "vibe" ? "// Die treibenden Kräfte hinter der Infrastruktur und Intelligenz des Labs." :
               theme === "brutalist" ? "OPERATIONAL PERSONAL AND CORE INTELLIGENCE MODULES." :
               theme === "glassmorphism" ? "A glimpse into the engineering synergy of developer and autonomous multi-agent system." :
               theme === "geometric" ? "sys.profile_registry: listings of core integration architect and orchestrator." :
               "Hier stellen sich die Systementwickler und automatisierten Agenten vor, die den Betrieb absichern."}
            </p>
          </div>

          {renderContent()}
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
    border: "1px solid var(--border-color)",
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

  // --- VIBE STYLE ---
  vibeContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "32px",
    marginTop: "30px"
  },
  vibeCard: {
    border: "1px solid var(--border-color)",
    borderBottom: "4px solid var(--primary)",
    borderRight: "4px solid var(--primary)",
    borderRadius: "12px",
    background: "linear-gradient(135deg, rgba(30, 35, 53, 0.8), rgba(37, 43, 58, 0.6))",
    backdropFilter: "blur(10px)",
    overflow: "hidden"
  },
  macBar: {
    height: "36px",
    backgroundColor: "var(--surface-terminal)",
    borderBottom: "1px solid var(--border-color)",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    position: "relative"
  },
  macDots: {
    display: "flex",
    gap: "6px"
  },
  macDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%"
  },
  macTitle: {
    fontFamily: "var(--font-space-mono)",
    color: "var(--text-muted)",
    fontSize: "0.75rem",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)"
  },
  vibeCardBody: {
    padding: "24px",
    display: "flex",
    flexDirection: "row",
    gap: "24px",
    flexWrap: "wrap"
  },
  vibeAvatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid var(--secondary)",
    boxShadow: "0 0 15px rgba(232, 121, 249, 0.3)"
  },
  vibeCommand: {
    fontFamily: "var(--font-space-mono)",
    backgroundColor: "var(--surface-terminal)",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "var(--accent)",
    fontSize: "0.8rem",
    borderLeft: "3px solid var(--primary)"
  },
  vibeCardInfo: {
    flex: 1,
    minWidth: "250px"
  },
  vibeName: {
    fontFamily: "var(--font-space-mono)",
    color: "var(--text-bold)",
    fontSize: "1.6rem",
    margin: 0
  },
  vibeRole: {
    fontFamily: "var(--font-space-mono)",
    color: "var(--primary)",
    fontSize: "0.9rem",
    marginBottom: "16px"
  },
  vibeDescLine: {
    fontFamily: "var(--font-mono)",
    color: "var(--text-color)",
    fontSize: "0.85rem",
    marginBottom: "6px"
  },
  vibeBio: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.9rem",
    backgroundColor: "var(--surface-terminal)",
    padding: "10px 14px",
    borderRadius: "6px",
    color: "var(--text-bold)",
    margin: "16px 0",
    borderLeft: "3px solid var(--accent)"
  },
  vibeQuote: {
    fontFamily: "var(--font-mono)",
    fontStyle: "italic",
    color: "var(--text-muted)",
    fontSize: "0.85rem",
    marginBottom: "12px"
  },
  vibeComment: {
    fontFamily: "var(--font-mono)",
    color: "#4e9a06", // Terminal green comment style
    fontSize: "0.8rem",
    marginBottom: "16px"
  },
  vibeSectionTitle: {
    fontFamily: "var(--font-space-mono)",
    color: "var(--secondary)",
    fontSize: "0.85rem",
    fontWeight: "bold"
  },
  vibeBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    backgroundColor: "rgba(187, 154, 247, 0.1)",
    border: "1px solid var(--primary)",
    color: "var(--primary)",
    padding: "2px 8px",
    borderRadius: "4px"
  },

  // --- BRUTALIST STYLE ---
  brutContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    marginTop: "30px"
  },
  brutCard: {
    border: "3px solid var(--border-color)",
    backgroundColor: "var(--surface-card)",
    boxShadow: "8px 8px 0px var(--primary)",
    display: "flex",
    flexWrap: "wrap"
  },
  brutImgWrapper: {
    width: "250px",
    borderRight: "3px solid var(--border-color)",
    backgroundColor: "var(--surface-terminal)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  },
  brutAvatar: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid var(--border-color)",
    filter: "grayscale(100%)"
  },
  brutCardBody: {
    flex: 1,
    padding: "30px",
    minWidth: "300px"
  },
  brutCommand: {
    display: "inline-block",
    fontFamily: "var(--font-mono)",
    backgroundColor: "var(--border-color)",
    color: "var(--bg-color)",
    padding: "4px 8px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    marginBottom: "16px"
  },
  brutName: {
    fontFamily: "var(--font-mono)",
    fontSize: "2rem",
    fontWeight: "900",
    color: "var(--text-bold)",
    margin: 0
  },
  brutRole: {
    fontFamily: "var(--font-mono)",
    fontSize: "1rem",
    fontWeight: "700",
    color: "var(--primary)",
    marginBottom: "16px",
    textDecoration: "underline"
  },
  brutDesc: {
    fontSize: "0.95rem",
    lineHeight: "1.4",
    margin: "0 0 8px 0"
  },
  brutBio: {
    fontSize: "0.95rem",
    borderLeft: "3px solid var(--border-color)",
    paddingLeft: "12px",
    margin: "20px 0",
    fontWeight: "600"
  },
  brutQuote: {
    fontStyle: "italic",
    color: "var(--text-muted)",
    fontSize: "0.85rem",
    border: "2px dashed var(--border-color)",
    padding: "10px",
    fontWeight: "bold"
  },
  brutSectionTitle: {
    fontFamily: "var(--font-mono)",
    fontWeight: "900",
    fontSize: "0.9rem"
  },
  brutBadge: {
    padding: "4px 10px",
    border: "2px solid var(--border-color)",
    backgroundColor: "var(--bg-color)",
    fontWeight: "bold",
    fontSize: "0.8rem"
  },

  // --- GLASSMORPHISM STYLE ---
  glassContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "32px",
    marginTop: "30px"
  },
  glassCard: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    padding: "30px",
    display: "flex",
    flexDirection: "row",
    gap: "24px",
    flexWrap: "wrap"
  },
  glassAvatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
  },
  glassCommand: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.8rem",
    color: "var(--primary)",
    background: "rgba(255,255,255,0.06)",
    padding: "4px 10px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)"
  },
  glassCardBody: {
    flex: 1,
    minWidth: "250px"
  },
  glassName: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "var(--text-bold)",
    margin: 0
  },
  glassRole: {
    fontSize: "0.95rem",
    color: "var(--primary)",
    marginBottom: "16px"
  },
  glassDesc: {
    fontSize: "0.9rem",
    color: "var(--text-color)",
    margin: "0 0 6px 0"
  },
  glassBio: {
    fontSize: "0.95rem",
    color: "var(--text-color)",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: "12px",
    borderRadius: "8px",
    margin: "16px 0"
  },
  glassQuote: {
    fontSize: "0.85rem",
    fontStyle: "italic",
    color: "var(--text-muted)",
    marginBottom: "12px"
  },
  glassSectionTitle: {
    fontSize: "0.85rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  glassBadge: {
    fontSize: "0.75rem",
    padding: "3px 10px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "var(--primary)"
  },

  // --- GEOMETRIC STYLE ---
  geomContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "32px",
    marginTop: "30px"
  },
  geomCard: {
    border: "1px solid var(--border-color)",
    borderLeft: "4px solid var(--primary)",
    backgroundColor: "var(--surface-card)",
    borderRadius: "4px",
    padding: "24px"
  },
  geomAvatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid var(--border-color)"
  },
  geomCommand: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.8rem",
    color: "var(--secondary)"
  },
  geomCardBody: {
    marginTop: "16px"
  },
  geomName: {
    fontFamily: "var(--font-sans)",
    fontWeight: "700",
    fontSize: "1.7rem",
    color: "var(--text-bold)",
    margin: 0
  },
  geomRole: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.85rem",
    color: "var(--primary)",
    marginBottom: "16px"
  },
  geomDesc: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.85rem",
    color: "var(--text-color)",
    marginBottom: "6px"
  },
  geomBio: {
    fontSize: "0.9rem",
    borderTop: "1px solid var(--border-color)",
    borderBottom: "1px solid var(--border-color)",
    padding: "12px 0",
    margin: "16px 0"
  },
  geomQuote: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    marginBottom: "12px"
  },
  geomSectionTitle: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.8rem",
    fontWeight: "bold"
  },
  geomBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    border: "1px solid var(--primary)",
    color: "var(--primary)",
    padding: "2px 6px",
    borderRadius: "2px"
  },

  // --- PROFESSIONAL STYLE ---
  profContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    marginTop: "30px"
  },
  profCard: {
    backgroundColor: "var(--surface-card)",
    border: "var(--border-style)",
    borderRadius: "var(--border-radius)",
    boxShadow: "var(--shadow)",
    padding: "30px"
  },
  profAvatar: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid var(--border-color)",
    boxShadow: "var(--shadow)"
  },
  profName: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "var(--text-bold)",
    margin: 0
  },
  profRole: {
    fontSize: "1.05rem",
    fontWeight: 600,
    color: "var(--primary)",
    marginBottom: "16px"
  },
  profDesc: {
    fontSize: "0.95rem",
    color: "var(--text-color)",
    lineHeight: "1.5",
    margin: "0 0 8px 0"
  },
  profBio: {
    fontSize: "0.95rem",
    lineHeight: "1.6",
    margin: "20px 0"
  },
  profQuote: {
    fontSize: "0.9rem",
    fontStyle: "italic",
    borderLeft: "4px solid var(--primary)",
    paddingLeft: "16px",
    color: "var(--text-muted)",
    margin: "16px 0"
  },
  profSectionTitle: {
    fontSize: "0.9rem",
    fontWeight: "700"
  },
  profBadge: {
    padding: "4px 10px",
    borderRadius: "4px",
    backgroundColor: "var(--surface-terminal)",
    color: "var(--text-bold)",
    border: "1px solid var(--border-color)",
    fontSize: "0.85rem"
  }
};
