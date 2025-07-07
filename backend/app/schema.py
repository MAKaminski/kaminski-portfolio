import strawberry
from typing import List

@strawberry.type
class TimelineEntry:
    id: int
    title: str
    company: str
    start: str
    end: str
    summary: str

@strawberry.type
class Project:
    id: int
    name: str
    stack: str
    description: str

@strawberry.type
class Metric:
    id: int
    label: str
    value: str

@strawberry.type
class Portfolio:
    timeline: List[TimelineEntry]
    projects: List[Project]
    metrics: List[Metric]
