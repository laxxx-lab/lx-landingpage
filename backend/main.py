import os
import shutil
import uuid
from datetime import date
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models
import schemas
import auth

# Ensure database tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LX Lab API",
    description="The API-First portfolio backend, with built-in Swagger/OpenAPI documentation for smooth AI integrations.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files folder for uploaded screenshots
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- Upload Endpoints (Admin or API Key Protected) ---

@app.post("/api/upload", response_model=schemas.UploadResponse, tags=["Upload"])
def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    authorized: bool = Depends(auth.get_admin_or_api_key)
):
    # Validate file is an image
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG, GIF, and WEBP image uploads are allowed."
        )
    
    # Generate a unique secure filename
    ext = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    upload_dir = os.path.join("static", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/static/uploads/{unique_filename}"}

# Startup event to seed admin user if none exists
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    admin_user = db.query(models.AdminUser).first()
    if not admin_user:
        # Create default administrator
        default_user = os.getenv("ADMIN_USERNAME", "admin")
        default_pass = os.getenv("ADMIN_PASSWORD", "adminpassword")
        hashed_pw = auth.get_password_hash(default_pass)
        
        db_admin = models.AdminUser(
            username=default_user,
            hashed_password=hashed_pw
        )
        db.add(db_admin)
        db.commit()
        print(f"Default admin created. Username: {default_user}")

# --- Authentication Endpoints ---

@app.post("/api/auth/login", response_model=schemas.Token, tags=["Auth"])
def login(login_data: schemas.AdminLogin, db: Session = Depends(get_db)):
    user = db.query(models.AdminUser).filter(models.AdminUser.username == login_data.username).first()
    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# --- API Keys Management (Admin Only) ---

@app.post("/api/auth/keys", response_model=schemas.ApiKeyResponse, tags=["API Keys"])
def create_key(
    key_data: schemas.ApiKeyCreate,
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(auth.get_current_admin)
):
    raw_key, key_hash = auth.generate_api_key()
    db_key = models.ApiKey(
        name=key_data.name,
        key_hash=key_hash,
        is_active=True
    )
    db.add(db_key)
    db.commit()
    db.refresh(db_key)
    
    # Return raw key ONLY ONCE during creation
    return schemas.ApiKeyResponse(
        id=db_key.id,
        name=db_key.name,
        key=raw_key,
        is_active=db_key.is_active,
        created_at=db_key.created_at
    )

@app.get("/api/auth/keys", response_model=List[schemas.ApiKeyListResponse], tags=["API Keys"])
def list_keys(
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(auth.get_current_admin)
):
    return db.query(models.ApiKey).order_by(models.ApiKey.created_at.desc()).all()

@app.put("/api/auth/keys/{key_id}", response_model=schemas.ApiKeyListResponse, tags=["API Keys"])
def toggle_key(
    key_id: int,
    toggle_data: schemas.ApiKeyToggle,
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(auth.get_current_admin)
):
    db_key = db.query(models.ApiKey).filter(models.ApiKey.id == key_id).first()
    if not db_key:
        raise HTTPException(status_code=404, detail="API Key not found")
    
    db_key.is_active = toggle_data.is_active
    db.commit()
    db.refresh(db_key)
    return db_key

@app.delete("/api/auth/keys/{key_id}", status_code=204, tags=["API Keys"])
def delete_key(
    key_id: int,
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(auth.get_current_admin)
):
    db_key = db.query(models.ApiKey).filter(models.ApiKey.id == key_id).first()
    if not db_key:
        raise HTTPException(status_code=404, detail="API Key not found")
    
    db.delete(db_key)
    db.commit()
    return None

# --- Projects Endpoints (Public Reads, Protected Writes) ---

@app.get("/api/projects", response_model=List[schemas.ProjectResponse], tags=["Projects"])
def read_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).order_by(models.Project.publish_date.desc()).all()

@app.get("/api/projects/{project_id}", response_model=schemas.ProjectResponse, tags=["Projects"])
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.post("/api/projects", response_model=schemas.ProjectResponse, status_code=201, tags=["Projects"])
def create_project(
    project_data: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    authorized: bool = Depends(auth.get_admin_or_api_key)
):
    # fastapi 201 status for created resource
    db_project = models.Project(**project_data.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.put("/api/projects/{project_id}", response_model=schemas.ProjectResponse, tags=["Projects"])
def update_project(
    project_id: int,
    project_data: schemas.ProjectUpdate,
    db: Session = Depends(get_db),
    authorized: bool = Depends(auth.get_admin_or_api_key)
):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Update only provided fields
    update_data = project_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_project, key, value)
        
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/api/projects/{project_id}", status_code=204, tags=["Projects"])
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    authorized: bool = Depends(auth.get_admin_or_api_key)
):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return None

# --- About Members Endpoints ---

@app.get("/api/about", response_model=List[schemas.AboutMemberResponse], tags=["About"])
def read_about_members(db: Session = Depends(get_db)):
    return db.query(models.AboutMember).order_by(models.AboutMember.id).all()

@app.get("/api/about/{key}", response_model=schemas.AboutMemberResponse, tags=["About"])
def read_about_member(key: str, db: Session = Depends(get_db)):
    member = db.query(models.AboutMember).filter(models.AboutMember.key == key).first()
    if not member:
        raise HTTPException(status_code=404, detail=f"About member '{key}' not found")
    return member

@app.put("/api/about/{key}", response_model=schemas.AboutMemberResponse, tags=["About"])
def update_about_member(
    key: str,
    member_data: schemas.AboutMemberUpdate,
    db: Session = Depends(get_db),
    authorized: bool = Depends(auth.get_admin_or_api_key)
):
    member = db.query(models.AboutMember).filter(models.AboutMember.key == key).first()
    if not member:
        raise HTTPException(status_code=404, detail=f"About member '{key}' not found")
    
    update_data = member_data.dict(exclude_unset=True)
    for k, value in update_data.items():
        setattr(member, k, value)
        
    db.commit()
    db.refresh(member)
    return member

