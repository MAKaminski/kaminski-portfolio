from sqlalchemy import Column, Integer, String, Date, create_engine
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class TimelineEntry(Base):
    __tablename__ = 'timeline'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    company = Column(String)
    start = Column(String)
    end = Column(String)
    summary = Column(String)

class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    stack = Column(String)
    description = Column(String)

class Metric(Base):
    __tablename__ = 'metrics'
    id = Column(Integer, primary_key=True)
    label = Column(String)
    value = Column(String)
