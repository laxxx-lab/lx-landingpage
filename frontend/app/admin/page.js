"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ParticleBg } from "../components/ParticleBg";

const THEMES = [
  { id: "vibe", name: "Vibe Coder", desc: "Tokyo Night & Neon" },
  { id: "professional", name: "Professional", desc: "Institutional Blueprint" },
  { id: "brutalist", name: "Brutalist", desc: "Raw & Minimal" },
  { id: "glassmorphism", name: "Glassmorphism", desc: "Frosted Glass" },
  { id: "geometric", name: "Geometric", desc: "Precision Grid" }
];

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

export default function AdminDashboard() {
  const [theme, setTheme] = useState("vibe");
  const [token, setToken] = useState("");
  const [projects, setProjects] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  // Project Form State
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectLiveUrl, setProjectLiveUrl] = useState("");
  const [projectGitUrl, setProjectGitUrl] = useState("");
  const [projectTechs, setProjectTechs] = useState("");
  const [projectImages, setProjectImages] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [projectError, setProjectError] = useState("");
  const [projectSuccess, setProjectSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  // About Members Form State
  const [aboutMembers, setAboutMembers] = useState([]);
  const [selectedMemberKey, setSelectedMemberKey] = useState("patrik");
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberDesc, setMemberDesc] = useState("");
  const [memberBio, setMemberBio] = useState("");
  const [memberQuote, setMemberQuote] = useState("");
  const [memberComment, setMemberComment] = useState("");
  const [memberCommand, setMemberCommand] = useState("");
  const [memberAvatar, setMemberAvatar] = useState("");
  const [memberSkills, setMemberSkills] = useState("");
  const [aboutError, setAboutError] = useState("");
  const [aboutSuccess, setAboutSuccess] = useState("");
  const [aboutUploading, setAboutUploading] = useState(false);

  // API Key Form State
  const [keyName, setKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [keyError, setKeyError] = useState("");
  const [keySuccess, setKeySuccess] = useState("");

  useEffect(() => {
    const storedTheme = localStorage.getItem("lx_theme") || "vibe";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);

    const storedToken = localStorage.getItem("lx_token");
    if (!storedToken) {
      router.push("/admin/login");
    } else {
      setToken(storedToken);
      fetchData(storedToken);
    }
  }, [router]);

  const fetchData = async (authToken) => {
    setLoading(true);
    try {
      const projRes = await fetch("/api/projects");
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData);
      }

      const keysRes = await fetch("/api/auth/keys", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (keysRes.ok) {
        const keysData = await keysRes.json();
        setApiKeys(keysData);
      } else if (keysRes.status === 401) {
        handleLogout();
      }

      const aboutRes = await fetch("/api/about");
      if (aboutRes.ok) {
        const aboutData = await aboutRes.json();
        setAboutMembers(aboutData);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("lx_token");
    router.push("/admin/login");
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("lx_theme", newTheme);
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = () => setDropdownOpen(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [dropdownOpen]);

  // --- Project CRUD handlers ---

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setProjectError("");
    setProjectSuccess("");
    setUploading(true);

    const uploadedUrls = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        } else {
          const errData = await res.json().catch(() => ({}));
          setProjectError(errData.detail || "Bild-Upload fehlgeschlagen.");
        }
      }

      if (uploadedUrls.length > 0) {
        const currentImages = projectImages
          ? projectImages.split(",").map((img) => img.trim()).filter(Boolean)
          : [];
        const updatedImages = [...currentImages, ...uploadedUrls].join(", ");
        setProjectImages(updatedImages);
        setProjectSuccess(`${uploadedUrls.length} Bild(er) erfolgreich hochgeladen.`);
      }
    } catch (err) {
      setProjectError("Netzwerkfehler beim Bild-Upload.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (urlToRemove) => {
    const currentImages = projectImages
      ? projectImages.split(",").map((img) => img.trim()).filter(Boolean)
      : [];
    const updated = currentImages.filter((url) => url !== urlToRemove);
    setProjectImages(updated.join(", "));
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setProjectError("");
    setProjectSuccess("");

    const techArray = projectTechs
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");
    const imgArray = projectImages
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i !== "");

    const payload = {
      title: projectTitle,
      description: projectDesc,
      live_url: projectLiveUrl || null,
      github_url: projectGitUrl || null,
      technologies: techArray,
      image_urls: imgArray,
      publish_date: projectDate || null,
    };

    try {
      const url = editingProjectId
        ? `/api/projects/${editingProjectId}`
        : "/api/projects";
      const method = editingProjectId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setProjectSuccess(
          editingProjectId
            ? "Projekt erfolgreich aktualisiert!"
            : "Projekt erfolgreich erstellt!"
        );
        resetProjectForm();
        fetchData(token);
      } else {
        const errData = await res.json().catch(() => ({}));
        setProjectError(errData.detail || "Operation fehlgeschlagen.");
      }
    } catch (err) {
      setProjectError("Verbindungsfehler zum API-Server.");
    }
  };

  const handleEditClick = (project) => {
    setEditingProjectId(project.id);
    setProjectTitle(project.title);
    setProjectDesc(project.description);
    setProjectLiveUrl(project.live_url || "");
    setProjectGitUrl(project.github_url || "");
    setProjectTechs(project.technologies.join(", "));
    setProjectImages(project.image_urls.join(", "));
    setProjectDate(project.publish_date || "");
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectTitle("");
    setProjectDesc("");
    setProjectLiveUrl("");
    setProjectGitUrl("");
    setProjectTechs("");
    setProjectImages("");
    setProjectDate("");
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Möchten Sie dieses Projekt wirklich löschen?")) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchData(token);
      } else {
        alert("Löschen fehlgeschlagen.");
      }
    } catch (err) {
      alert("Löschen fehlgeschlagen (Netzwerkfehler).");
    }
  };

  // --- About Crew handlers ---

  useEffect(() => {
    const list = aboutMembers.length > 0 ? aboutMembers : FALLBACK_ABOUT;
    const member = list.find(m => m.key === selectedMemberKey);
    if (member) {
      setMemberName(member.name || "");
      setMemberRole(member.role || "");
      setMemberDesc(member.description ? member.description.join("\n") : "");
      setMemberBio(member.bio || "");
      setMemberQuote(member.quote || "");
      setMemberComment(member.comment || "");
      setMemberCommand(member.command || "");
      setMemberAvatar(member.avatar_url || "");
      setMemberSkills(member.skills ? member.skills.join(", ") : "");
    }
  }, [selectedMemberKey, aboutMembers]);

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setAboutError("");
    setAboutSuccess("");

    const descArray = memberDesc.split("\n").map(line => line.trim()).filter(Boolean);
    const skillsArray = memberSkills.split(",").map(s => s.trim()).filter(Boolean);

    const payload = {
      name: memberName,
      role: memberRole,
      description: descArray,
      bio: memberBio || null,
      quote: memberQuote || null,
      comment: memberComment || null,
      command: memberCommand || null,
      avatar_url: memberAvatar || null,
      skills: skillsArray
    };

    try {
      const res = await fetch(`/api/about/${selectedMemberKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setAboutSuccess(`Profil für ${selectedMemberKey === "patrik" ? "Patrik" : "L.I.L.I.T.H."} erfolgreich gespeichert!`);
        fetchData(token);
      } else {
        const errData = await res.json().catch(() => ({}));
        setAboutError(errData.detail || "Fehler beim Speichern des Profils.");
      }
    } catch (err) {
      setAboutError("Netzwerkfehler beim Speichern.");
    }
  };

  const handleAvatarUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setAboutError("");
    setAboutSuccess("");
    setAboutUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setMemberAvatar(data.url);
        setAboutSuccess("Profilbild erfolgreich hochgeladen.");
      } else {
        const errData = await res.json().catch(() => ({}));
        setAboutError(errData.detail || "Bild-Upload fehlgeschlagen.");
      }
    } catch (err) {
      setAboutError("Netzwerkfehler beim Bild-Upload.");
    } finally {
      setAboutUploading(false);
      e.target.value = "";
    }
  };

  // --- API Key handlers ---

  const handleCreateKey = async (e) => {
    e.preventDefault();
    setKeyError("");
    setKeySuccess("");
    setGeneratedKey("");

    try {
      const res = await fetch("/api/auth/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: keyName }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedKey(data.key);
        setKeyName("");
        setKeySuccess("API Key erfolgreich generiert!");
        fetchData(token);
      } else {
        const errData = await res.json().catch(() => ({}));
        setKeyError(errData.detail || "Generierung fehlgeschlagen.");
      }
    } catch (err) {
      setKeyError("Netzwerkfehler.");
    }
  };

  const handleToggleKey = async (keyId, currentActive) => {
    try {
      const res = await fetch(`/api/auth/keys/${keyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !currentActive }),
      });
      if (res.ok) {
        fetchData(token);
      }
    } catch (err) {
      alert("Status-Änderung fehlgeschlagen.");
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (!confirm("Möchten Sie diesen API-Key dauerhaft löschen?")) return;
    try {
      const res = await fetch(`/api/auth/keys/${keyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchData(token);
      }
    } catch (err) {
      alert("Löschen fehlgeschlagen.");
    }
  };

  const renderTitle = (section) => {
    if (section === "edit") {
      switch (theme) {
        case "vibe": return "$ nano projects.json";
        case "brutalist": return "WRITE PROJECTS.JSON";
        case "glassmorphism": return "✨ Edit Catalogue";
        case "geometric": return "01 // Catalog Configuration";
        case "professional":
        default:
          return "Projekt anlegen / bearbeiten";
      }
    } else if (section === "list") {
      switch (theme) {
        case "vibe": return "$ ls ./projects/db";
        case "brutalist": return "LIST PROJECTS.DB";
        case "glassmorphism": return "✨ Active Catalogue";
        case "geometric": return "02 // Active Deployments";
        case "professional":
        default:
          return "Vorhandene Projekte";
      }
    } else {
      switch (theme) {
        case "vibe": return "$ generate api_key";
        case "brutalist": return "GENERATE API_KEY";
        case "glassmorphism": return "✨ Key Generator";
        case "geometric": return "03 // API Key Manager";
        case "professional":
        default:
          return "KI-Agenten API-Schlüssel";
      }
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Tokyo Night Particle canvas only for Vibe theme */}
      {theme === "vibe" && <ParticleBg />}

      {/* Header */}
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
            <Link href="/admin" style={{ 
              ...styles.navLink, 
              color: "var(--text-bold)", 
              fontWeight: "bold", 
              borderBottom: theme === "brutalist" ? "3px solid var(--primary)" : "2px solid var(--primary)" 
            }}>Admin Area</Link>
            
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

            {/* Logout button styled according to theme */}
            <button 
              onClick={handleLogout} 
              className="action-btn" 
              style={
                theme === "vibe" ? {
                  fontFamily: "var(--font-mono)",
                  padding: "8px 14px",
                  fontSize: "0.8rem",
                  border: "1px solid var(--primary)",
                  backgroundColor: "transparent",
                  color: "var(--primary)",
                  borderRadius: "6px",
                  cursor: "pointer",
                } : theme === "brutalist" ? {
                  fontFamily: "var(--font-mono)",
                  padding: "6px 12px",
                  fontSize: "0.8rem",
                  border: "3px solid var(--border-color)",
                  backgroundColor: "transparent",
                  color: "var(--text-bold)",
                  borderRadius: "0px",
                  cursor: "pointer",
                  fontWeight: "900",
                } : theme === "glassmorphism" ? {
                  fontFamily: "var(--font-sans)",
                  padding: "8px 14px",
                  fontSize: "0.8rem",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "var(--text-bold)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  backdropFilter: "blur(5px)",
                } : theme === "geometric" ? {
                  fontFamily: "var(--font-sans)",
                  padding: "8px 14px",
                  fontSize: "0.8rem",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "transparent",
                  color: "var(--text-bold)",
                  borderRadius: "2px",
                  cursor: "pointer",
                } : {
                  fontFamily: "var(--font-sans)",
                  padding: "8px 14px",
                  fontSize: "0.85rem",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--surface-terminal)",
                  color: "var(--text-bold)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 500,
                }
              }
            >
              {theme === "vibe" ? "$ logout" : theme === "brutalist" ? "LOGOUT" : "Abmelden"}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Admin Area */}
      <main style={{ flex: 1, padding: "40px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", fontFamily: "var(--font-mono)" }}>
              Verbindung zur Portfolio-API wird hergestellt...
            </div>
          ) : (
            <div style={styles.grid}>
              
              {/* Left Column: Projects management CRUD */}
              <div style={styles.leftCol}>
                <section className="dashboard-section">
                  <h2 style={styles.sectionTitle}>
                    {renderTitle("edit")}
                  </h2>
                  
                  {projectError && (
                    <div style={theme === "vibe" ? styles.vibeError : styles.profError}>
                      {projectError}
                    </div>
                  )}
                  {projectSuccess && (
                    <div style={theme === "vibe" ? styles.vibeSuccess : styles.profSuccess}>
                      {projectSuccess}
                    </div>
                  )}

                  <form onSubmit={handleProjectSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Projekt Titel</label>
                      <input
                        type="text"
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className="theme-input"
                        placeholder="z.B. Paperclip AI"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Beschreibung (Beschreibungstext)</label>
                      <textarea
                        required
                        rows={4}
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        className="theme-input"
                        style={{ resize: "vertical" }}
                        placeholder="Erläuterung des Projekts..."
                      />
                    </div>

                    <div style={styles.doubleGroup}>
                      <div style={styles.formSubGroup}>
                        <label style={styles.label}>Live URL (Dienst-Link)</label>
                        <input
                          type="url"
                          value={projectLiveUrl}
                          onChange={(e) => setProjectLiveUrl(e.target.value)}
                          className="theme-input"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div style={styles.formSubGroup}>
                        <label style={styles.label}>GitHub URL (Repository)</label>
                        <input
                          type="url"
                          value={projectGitUrl}
                          onChange={(e) => setProjectGitUrl(e.target.value)}
                          className="theme-input"
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>

                    <div style={styles.doubleGroup}>
                      <div style={styles.formSubGroup}>
                        <label style={styles.label}>Technologien (Komma-separiert)</label>
                        <input
                          type="text"
                          value={projectTechs}
                          onChange={(e) => setProjectTechs(e.target.value)}
                          className="theme-input"
                          placeholder="React, FastAPI, Docker"
                        />
                      </div>
                      <div style={styles.formSubGroup}>
                        <label style={styles.label}>Veröffentlichungsdatum</label>
                        <input
                          type="date"
                          value={projectDate}
                          onChange={(e) => setProjectDate(e.target.value)}
                          className="theme-input"
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <label style={styles.label}>Projekt Screenshots / Bilder</label>
                        <label 
                          style={theme === "vibe" ? {
                            fontFamily: "var(--font-mono)",
                            backgroundColor: "var(--surface-terminal)",
                            color: "var(--success)",
                            border: "1px dashed var(--success)",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            display: "inline-block",
                          } : theme === "brutalist" ? {
                            fontFamily: "var(--font-mono)",
                            backgroundColor: "var(--bg-color)",
                            color: "var(--primary)",
                            border: "3px solid var(--border-color)",
                            padding: "4px 10px",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            display: "inline-block",
                            textTransform: "uppercase"
                          } : {
                            fontFamily: "var(--font-sans)",
                            backgroundColor: "rgba(0, 229, 255, 0.1)",
                            color: "var(--primary)",
                            border: "1px solid var(--border-color)",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            display: "inline-block",
                          }}
                        >
                          {uploading ? "Lädt hoch..." : "📁 Screenshot hochladen"}
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                      
                      <input
                        type="text"
                        value={projectImages}
                        onChange={(e) => setProjectImages(e.target.value)}
                        className="theme-input"
                        placeholder="Bild-URLs (Komma-separiert) oder oben hochladen"
                      />

                      {projectImages && (
                        <div style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                          marginTop: "8px",
                          backgroundColor: "var(--surface-terminal)",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid var(--border-color)",
                        }}>
                          {projectImages.split(",").map((url) => url.trim()).filter(Boolean).map((url, idx) => (
                            <div key={idx} style={{
                              position: "relative",
                              width: "65px",
                              height: "65px",
                              border: "1px solid var(--border-color)",
                              borderRadius: "6px",
                              overflow: "hidden",
                            }}>
                              <img src={url} alt={`Screenshot ${idx + 1}`} style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }} />
                              <button 
                                type="button" 
                                onClick={() => handleRemoveImage(url)} 
                                style={{
                                  position: "absolute",
                                  top: "2px",
                                  right: "2px",
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                                  color: "#FFFFFF",
                                  border: "none",
                                  fontSize: "9px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  lineHeight: 1,
                                  padding: 0,
                                }}
                                title="Bild entfernen"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                      <button type="submit" className="action-btn">
                        {editingProjectId 
                          ? (theme === "vibe" ? "$ save --project" : theme === "brutalist" ? "SAVE PROJECT" : "Speichern") 
                          : (theme === "vibe" ? "$ create --new-project" : theme === "brutalist" ? "CREATE PROJECT" : "Erstellen")}
                      </button>
                      {editingProjectId && (
                        <button 
                          type="button" 
                          onClick={resetProjectForm} 
                          className="action-btn" 
                          style={{
                            backgroundColor: "transparent",
                            border: "1px solid var(--border-color)",
                            color: "var(--text-color)",
                            boxShadow: "none"
                          }}
                        >
                          Abbrechen
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                {/* Projects List table */}
                <section className="dashboard-section" style={{ marginTop: "24px" }}>
                  <h2 style={styles.sectionTitle}>
                    {renderTitle("list")}
                  </h2>
                  <div style={{ overflowX: "auto" }}>
                    <table style={styles.adminTable}>
                      <thead>
                        <tr style={styles.adminTableHeadRow}>
                          <th style={styles.adminTableHead}>Titel</th>
                          <th style={styles.adminTableHead}>Technologien</th>
                          <th style={styles.adminTableHead}>Aktionen</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((p) => (
                          <tr key={p.id} style={styles.adminTableRow}>
                            <td style={{ fontWeight: "bold", padding: "12px" }}>{p.title}</td>
                            <td style={{ padding: "12px" }}>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                {p.technologies.join(", ")}
                              </span>
                            </td>
                            <td style={{ padding: "12px", display: "flex", gap: "8px" }}>
                              <button onClick={() => handleEditClick(p)} style={styles.editBtn}>
                                Edit
                              </button>
                              <button onClick={() => handleDeleteProject(p.id)} style={styles.deleteBtn}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              {/* Right Column: API Keys (Admin only) */}
              <div style={styles.rightCol}>
                <section className="dashboard-section">
                  <h2 style={styles.sectionTitle}>
                    {renderTitle("key")}
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                    Generieren Sie sichere Tokens für Ihren KI-Assistenten. Der Schlüssel wird nur einmalig im Klartext angezeigt!
                  </p>

                  {keyError && (
                    <div style={theme === "vibe" ? styles.vibeError : styles.profError}>
                      {keyError}
                    </div>
                  )}
                  {keySuccess && (
                    <div style={theme === "vibe" ? styles.vibeSuccess : styles.profSuccess}>
                      {keySuccess}
                    </div>
                  )}

                  {generatedKey && (
                    <div style={styles.rawKeyDisplay}>
                      <p style={{ color: "var(--orange)", fontWeight: "bold", fontSize: "0.8rem", marginBottom: "6px" }}>
                        ⚠️ KOPIEREN SIE DIESEN SCHLÜSSEL JETZT (WIRD NIE WIEDER GEZEIGT):
                      </p>
                      <code style={styles.rawKeyCode}>{generatedKey}</code>
                    </div>
                  )}

                  <form onSubmit={handleCreateKey} style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                    <input
                      type="text"
                      required
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      className="theme-input"
                      placeholder="z.B. Claude Copilot"
                    />
                    <button type="submit" className="action-btn">
                      Generieren
                    </button>
                  </form>

                  <h3 style={{ ...styles.sectionTitle, fontSize: "1.1rem", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                    Aktive Tokens
                  </h3>

                  <div style={{ marginTop: "12px" }}>
                    {apiKeys.length === 0 ? (
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                        Keine aktiven API-Schlüssel vorhanden.
                      </p>
                    ) : (
                      <div style={styles.keysList}>
                        {apiKeys.map((k) => (
                          <div key={k.id} style={styles.keyRow}>
                            <div>
                              <p style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{k.name}</p>
                              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                Erstellt: {new Date(k.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <button
                                onClick={() => handleToggleKey(k.id, k.is_active)}
                                style={{
                                  ...styles.toggleBtn,
                                  backgroundColor: k.is_active ? "var(--success)" : "var(--orange)",
                                  color: "var(--bg-color)"
                                }}
                              >
                                {k.is_active ? "Aktiv" : "Inaktiv"}
                              </button>
                              <button onClick={() => handleDeleteKey(k.id)} style={styles.deleteKeyIconBtn}>
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                {/* Crew & About Us Editor */}
                <section className="dashboard-section" style={{ marginTop: "24px" }}>
                  <h2 style={styles.sectionTitle}>
                    {theme === "vibe" ? "set about_crew.conf" : theme === "brutalist" ? "EDIT CREW PROFILES" : "Crew & Profil-Editor"}
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                    Bearbeiten Sie die About Us-Informationen für Patrik und L.I.L.I.T.H.
                  </p>

                  <div style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
                    <button 
                      type="button"
                      onClick={() => setSelectedMemberKey("patrik")}
                      className="action-btn"
                      style={{ 
                        flex: 1, 
                        backgroundColor: selectedMemberKey === "patrik" ? "var(--primary)" : "transparent",
                        color: selectedMemberKey === "patrik" ? "#fff" : "var(--text-color)",
                        border: "1px solid var(--border-color)",
                        boxShadow: "none"
                      }}
                    >
                      Patrik
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedMemberKey("lilith")}
                      className="action-btn"
                      style={{ 
                        flex: 1, 
                        backgroundColor: selectedMemberKey === "lilith" ? "var(--primary)" : "transparent",
                        color: selectedMemberKey === "lilith" ? "#fff" : "var(--text-color)",
                        border: "1px solid var(--border-color)",
                        boxShadow: "none"
                      }}
                    >
                      L.I.L.I.T.H.
                    </button>
                  </div>

                  {aboutError && (
                    <div style={theme === "vibe" ? styles.vibeError : styles.profError}>
                      {aboutError}
                    </div>
                  )}
                  {aboutSuccess && (
                    <div style={theme === "vibe" ? styles.vibeSuccess : styles.profSuccess}>
                      {aboutSuccess}
                    </div>
                  )}

                  <form onSubmit={handleAboutSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Name</label>
                      <input
                        type="text"
                        required
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        className="theme-input"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Rolle / Titel</label>
                      <input
                        type="text"
                        required
                        value={memberRole}
                        onChange={(e) => setMemberRole(e.target.value)}
                        className="theme-input"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Beschreibung (eine Zeile pro Punkt)</label>
                      <textarea
                        rows={3}
                        value={memberDesc}
                        onChange={(e) => setMemberDesc(e.target.value)}
                        className="theme-input"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}
                        placeholder="z.B. Infra-Architect: Proxmox..."
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Kurz-Bio</label>
                      <input
                        type="text"
                        value={memberBio}
                        onChange={(e) => setMemberBio(e.target.value)}
                        className="theme-input"
                        placeholder="Der Mensch der..."
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Zitat / Motto</label>
                      <input
                        type="text"
                        value={memberQuote}
                        onChange={(e) => setMemberQuote(e.target.value)}
                        className="theme-input"
                        placeholder="Ohne ihn..."
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Code-Kommentar / Info</label>
                      <input
                        type="text"
                        value={memberComment}
                        onChange={(e) => setMemberComment(e.target.value)}
                        className="theme-input"
                        placeholder="// Humor: Dunkel."
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Command prompt</label>
                      <input
                        type="text"
                        value={memberCommand}
                        onChange={(e) => setMemberCommand(e.target.value)}
                        className="theme-input"
                        placeholder="$ whoami"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Fähigkeiten (Komma-separiert)</label>
                      <input
                        type="text"
                        value={memberSkills}
                        onChange={(e) => setMemberSkills(e.target.value)}
                        className="theme-input"
                        placeholder="Python, Docker, Networking..."
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Profilbild Hochladen</label>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={aboutUploading}
                          style={{ display: "none" }}
                          id="avatar-upload-input"
                        />
                        <label 
                          htmlFor="avatar-upload-input"
                          className="action-btn"
                          style={{ cursor: "pointer", display: "inline-block", fontSize: "0.85rem", padding: "8px 12px" }}
                        >
                          {aboutUploading ? "Wird hochgeladen..." : "Bild auswählen"}
                        </label>
                        {memberAvatar && (
                          <div style={{ position: "relative", width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                            <img src={memberAvatar} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Profilbild URL</label>
                      <input
                        type="text"
                        value={memberAvatar}
                        onChange={(e) => setMemberAvatar(e.target.value)}
                        className="theme-input"
                        placeholder="https://images.unsplash..."
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="action-btn"
                      style={{ width: "100%", marginTop: "10px" }}
                    >
                      Profil Speichern
                    </button>
                  </form>
                </section>
              </div>

            </div>
          )}
        </div>
      </main>
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
    color: "var(--secondary)",
    border: "1px solid var(--border-color)",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  profToggleBtn: {
    fontFamily: "var(--font-sans)",
    backgroundColor: "var(--bg-color)",
    color: "var(--text-bold)",
    border: "1px solid var(--border-color)",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: 500,
  },
  brutToggleBtn: {
    fontFamily: "var(--font-mono)",
    backgroundColor: "var(--primary)",
    color: "var(--bg-color)",
    border: "3px solid var(--border-color)",
    padding: "6px 12px",
    borderRadius: "0px",
    cursor: "pointer",
    fontSize: "0.8rem",
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
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
  geomToggleBtn: {
    fontFamily: "var(--font-sans)",
    backgroundColor: "var(--bg-color)",
    color: "var(--text-bold)",
    border: "1px solid var(--border-color)",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8rem",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
  },
  sectionTitle: {
    fontFamily: "var(--font-mono)",
    fontSize: "1.2rem",
    color: "var(--text-bold)",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  doubleGroup: {
    display: "flex",
    gap: "14px",
  },
  formSubGroup: {
    flex: 1,
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
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    marginBottom: "16px",
  },
  profError: {
    backgroundColor: "#FEF2F2",
    border: "1px solid #F87171",
    color: "#B91C1C",
    padding: "8px 12px",
    borderRadius: "4px",
    fontSize: "0.85rem",
    marginBottom: "16px",
  },
  adminTable: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  adminTableHeadRow: {
    borderBottom: "2px solid var(--border-color)",
  },
  adminTableHead: {
    padding: "8px 12px",
    fontWeight: "bold",
    color: "var(--text-bold)",
    fontSize: "0.85rem",
  },
  adminTableRow: {
    borderBottom: "1px solid var(--border-color)",
  },
  editBtn: {
    padding: "4px 8px",
    backgroundColor: "var(--secondary)",
    color: "var(--bg-color)",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "0.75rem",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "4px 8px",
    backgroundColor: "var(--primary)",
    color: "var(--bg-color)",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "0.75rem",
    cursor: "pointer",
  },
  rawKeyDisplay: {
    backgroundColor: "#161b22",
    border: "1px solid var(--border-accent)",
    padding: "16px",
    borderRadius: "6px",
    marginBottom: "20px",
  },
  rawKeyCode: {
    fontFamily: "var(--font-mono)",
    color: "var(--secondary)",
    fontSize: "1.1rem",
    wordBreak: "break-all",
    fontWeight: "bold",
  },
  keysList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  keyRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "var(--surface-terminal)",
    padding: "12px",
    borderRadius: "6px",
    border: "var(--border-style)",
  },
  toggleBtn: {
    border: "none",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  deleteKeyIconBtn: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
  }
};
