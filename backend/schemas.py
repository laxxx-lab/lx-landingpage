from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, HttpUrl, Field

# Project schemas
class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1)
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    image_urls: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    publish_date: Optional[date] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    image_urls: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    publish_date: Optional[date] = None

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# API Key schemas
class ApiKeyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)

class ApiKeyResponse(BaseModel):
    id: int
    name: str
    key: str  # Only returned once upon creation
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ApiKeyListResponse(BaseModel):
    id: int
    name: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ApiKeyToggle(BaseModel):
    is_active: bool

# Auth schemas
class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Upload schemas
class UploadResponse(BaseModel):
    url: str

# About Member schemas
class AboutMemberBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    role: str = Field(..., min_length=1, max_length=100)
    description: List[str] = Field(default_factory=list)
    bio: Optional[str] = None
    quote: Optional[str] = None
    comment: Optional[str] = None
    command: Optional[str] = None
    avatar_url: Optional[str] = None
    skills: List[str] = Field(default_factory=list)

class AboutMemberCreate(AboutMemberBase):
    key: str = Field(..., min_length=1, max_length=50)

class AboutMemberUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    role: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[List[str]] = None
    bio: Optional[str] = None
    quote: Optional[str] = None
    comment: Optional[str] = None
    command: Optional[str] = None
    avatar_url: Optional[str] = None
    skills: Optional[List[str]] = None

class AboutMemberResponse(AboutMemberBase):
    id: int
    key: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


