import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from sqlalchemy.pool import StaticPool
from database import Base, get_db
from main import app
import models
import auth

# Set up test database (in-memory SQLite with StaticPool)
SQLALCHEMY_DATABASE_URL = "sqlite://"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override database dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    # Setup: Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create test admin user
    db = TestingSessionLocal()
    hashed_pw = auth.get_password_hash("testpassword")
    admin = models.AdminUser(username="testadmin", hashed_password=hashed_pw)
    db.add(admin)
    db.commit()
    db.close()
    
    yield
    # Teardown: Drop tables
    Base.metadata.drop_all(bind=engine)

def test_read_projects_empty():
    response = client.get("/api/projects")
    assert response.status_code == 200
    assert response.json() == []

def test_login_success():
    response = client.post(
        "/api/auth/login",
        json={"username": "testadmin", "password": "testpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_failure():
    response = client.post(
        "/api/auth/login",
        json={"username": "testadmin", "password": "wrongpassword"}
    )
    assert response.status_code == 401

def test_create_project_unauthorized():
    project_data = {
        "title": "Test Project",
        "description": "Just a test",
        "technologies": ["React", "Python"]
    }
    response = client.post("/api/projects", json=project_data)
    assert response.status_code == 401

def test_create_project_authorized_with_jwt():
    # Login to get token
    login_resp = client.post(
        "/api/auth/login",
        json={"username": "testadmin", "password": "testpassword"}
    )
    token = login_resp.json()["access_token"]
    
    project_data = {
        "title": "JWT Project",
        "description": "Created via JWT token",
        "technologies": ["Svelte", "FastAPI"]
    }
    response = client.post(
        "/api/projects",
        json=project_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["title"] == "JWT Project"
    assert res_data["id"] is not None

def test_create_project_authorized_with_api_key():
    # Login to get token and create an API Key
    login_resp = client.post(
        "/api/auth/login",
        json={"username": "testadmin", "password": "testpassword"}
    )
    token = login_resp.json()["access_token"]
    
    key_resp = client.post(
        "/api/auth/keys",
        json={"name": "AI Assistant Key"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert key_resp.status_code == 200
    raw_key = key_resp.json()["key"]
    
    # Create project using X-API-KEY header
    project_data = {
        "title": "API Key Project",
        "description": "Created via API Key",
        "technologies": ["FastAPI", "Next.js"]
    }
    response = client.post(
        "/api/projects",
        json=project_data,
        headers={"X-API-KEY": raw_key}
    )
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["title"] == "API Key Project"

def test_upload_file_authorized_with_jwt():
    login_resp = client.post(
        "/api/auth/login",
        json={"username": "testadmin", "password": "testpassword"}
    )
    token = login_resp.json()["access_token"]
    
    file_payload = {
        "file": ("test.png", b"fake image bytes", "image/png")
    }
    response = client.post(
        "/api/upload",
        files=file_payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    res_data = response.json()
    assert "url" in res_data
    assert res_data["url"].startswith("/static/uploads/")

def test_read_about_members_empty():
    response = client.get("/api/about")
    assert response.status_code == 200
    assert response.json() == []

def test_update_about_member_authorized():
    # Setup member in DB
    db = TestingSessionLocal()
    member = models.AboutMember(
        key="patrik",
        name="Patrik Old",
        role="Dev",
        description=["Line 1"],
        skills=["Python"]
    )
    db.add(member)
    db.commit()
    db.close()

    # Login
    login_resp = client.post(
        "/api/auth/login",
        json={"username": "testadmin", "password": "testpassword"}
    )
    token = login_resp.json()["access_token"]

    # Update
    payload = {
        "name": "Patrik New",
        "role": "Lead Architect",
        "description": ["Line 1 New", "Line 2 New"],
        "skills": ["Python", "Rust"],
        "bio": "New bio",
        "quote": "New quote",
        "comment": "// comments",
        "command": "$ whoami",
        "avatar_url": "/static/uploads/avatar.png"
    }
    response = client.put(
        "/api/about/patrik",
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["name"] == "Patrik New"
    assert res_data["role"] == "Lead Architect"
    assert res_data["description"] == ["Line 1 New", "Line 2 New"]
    assert res_data["skills"] == ["Python", "Rust"]
    assert res_data["bio"] == "New bio"
    assert res_data["quote"] == "New quote"

def test_update_about_member_unauthorized():
    payload = {
        "name": "Unauthorized Change",
        "role": "Hacker",
        "description": [],
        "skills": []
    }
    response = client.put("/api/about/patrik", json=payload)
    assert response.status_code == 401


