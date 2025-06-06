from sqlalchemy import Column, Integer, String
from entities.database import Base

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    firstname = Column(String)
    lastname = Column(String)
