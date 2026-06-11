from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, JSON
from database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    live_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    image_urls = Column(JSON, default=list)  # List of image URLs
    technologies = Column(JSON, default=list)  # List of technology tags
    publish_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    key_hash = Column(String, unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AboutMember(Base):
    __tablename__ = "about_members"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)  # 'patrik' or 'lilith'
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    description = Column(JSON, default=list)  # List of description strings
    bio = Column(Text, nullable=True)
    quote = Column(Text, nullable=True)
    comment = Column(Text, nullable=True)
    command = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    skills = Column(JSON, default=list)  # List of skills
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

