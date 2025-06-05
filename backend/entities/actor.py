from sqlalchemy import Column, Integer, String
from entities.database import Base

class Actor(Base):
    __tablename__ = "actor"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
