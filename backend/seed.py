import sys
import os
import json
from datetime import datetime, date
from sqlalchemy.orm import Session

# Add current directory to path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
import models
import auth

# Initialize DB tables
Base.metadata.create_all(bind=engine)

# Clean, professional fallback templates for new installations/clones
FALLBACK_PROJECTS = [
    {
        "title": "Project Nexus",
        "description": "A secure, modular project workspace integrating real-time telemetry pipelines, clean dashboard metrics, and customizable theme settings. Built as a showcase for high-performance service architecture.",
        "live_url": "https://example.com",
        "github_url": "https://github.com/example/project-nexus",
        "image_urls": [
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"
        ],
        "technologies": ["Next.js", "FastAPI", "SQLite", "Docker"],
        "publish_date": "2026-01-01"
    },
    {
        "title": "Aether Data Engine",
        "description": "An event-driven data aggregation framework designed to stream server telemetry and log metrics into structured tables. Provides a real-time web portal for system diagnostics.",
        "live_url": None,
        "github_url": "https://github.com/example/aether-data",
        "image_urls": [],
        "technologies": ["Python", "SQLAlchemy", "WebSockets"],
        "publish_date": "2025-11-15"
    }
]

FALLBACK_MEMBERS = [
    {
        "key": "jane",
        "name": "Jane Doe",
        "role": "Lead Systems Architect",
        "description": [
            "System Designer: backend architecture, microservices, secure APIs",
            "Developer: Python, Go, TypeScript, Docker"
        ],
        "bio": "Passionate developer focused on building scalable, clean, and highly secure web systems.",
        "quote": "Simple is better than complex. Complex is better than complicated.",
        "comment": "// Always write clean code first.",
        "command": "$ whoami -> jane",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80",
        "skills": ["Python", "FastAPI", "Docker", "Next.js", "Security", "Architecture"]
    },
    {
        "key": "alex",
        "name": "Alex Smith",
        "role": "Full-Stack Engineer",
        "description": [
            "Frontend Expert: React, Next.js, responsive design",
            "Automation: CI/CD, Git, shell scripting"
        ],
        "bio": "Detail-oriented engineer who loves creating smooth user interfaces and automated deployment systems.",
        "quote": "Automate everything that is done more than twice.",
        "comment": "// Frontend + Automation = Bliss.",
        "command": "$ whoami -> alex",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
        "skills": ["TypeScript", "Next.js", "React", "CSS", "CI/CD", "Git"]
    }
]

def load_seed_config():
    """
    Attempts to load seed data from seed_data.json.
    Returns: Tuple (projects, about_members)
    """
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(backend_dir, "seed_data.json")
    
    if os.path.exists(json_path):
        try:
            print(f"Loading custom seed configurations from: {json_path}")
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data.get("projects", []), data.get("about_members", [])
        except Exception as e:
            print(f"Warning: Failed to parse seed_data.json: {e}. Falling back to default template.")
            
    print("No custom seed_data.json found. Seeding generic template database.")
    return FALLBACK_PROJECTS, FALLBACK_MEMBERS

def parse_date(date_str):
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except Exception:
        return None

def seed_database():
    db = SessionLocal()
    try:
        projects_source, members_source = load_seed_config()

        # 1. Seed Projects
        if db.query(models.Project).count() == 0:
            projects = []
            for p in projects_source:
                projects.append(
                    models.Project(
                        title=p.get("title"),
                        description=p.get("description"),
                        live_url=p.get("live_url"),
                        github_url=p.get("github_url"),
                        image_urls=p.get("image_urls", []),
                        technologies=p.get("technologies", []),
                        publish_date=parse_date(p.get("publish_date"))
                    )
                )
            db.add_all(projects)
            print(f"Seeded {len(projects)} projects.")
        else:
            print("Projects already seeded. Skipping.")

        # 2. Seed About Members
        if db.query(models.AboutMember).count() == 0:
            about_members = []
            for m in members_source:
                about_members.append(
                    models.AboutMember(
                        key=m.get("key"),
                        name=m.get("name"),
                        role=m.get("role"),
                        description=m.get("description", []),
                        bio=m.get("bio"),
                        quote=m.get("quote"),
                        comment=m.get("comment"),
                        command=m.get("command"),
                        avatar_url=m.get("avatar_url"),
                        skills=m.get("skills", [])
                    )
                )
            db.add_all(about_members)
            print(f"Seeded {len(about_members)} about members.")
        else:
            print("About members already seeded. Skipping.")

        # 3. Seed Default Admin if none exists
        admin_user = db.query(models.AdminUser).first()
        if not admin_user:
            default_user = os.getenv("ADMIN_USERNAME", "admin")
            default_pass = os.getenv("ADMIN_PASSWORD", "adminpassword")
            hashed_pw = auth.get_password_hash(default_pass)
            
            db_admin = models.AdminUser(
                username=default_user,
                hashed_password=hashed_pw
            )
            db.add(db_admin)
            print(f"Seeded default admin user: '{default_user}'")

        db.commit()
        print("Database seeding completed successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
