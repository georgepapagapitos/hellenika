from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_users: int
    active_users: int
    total_content: int
    user_growth: int
    content_growth: int


class RecentUser(BaseModel):
    id: int
    name: str
    email: str
    joined: str
    status: str


class RecentContent(BaseModel):
    id: int
    title: str
    type: str
    created: str
    status: str
