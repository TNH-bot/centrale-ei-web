from sqlalchemy import Column, Integer, Float, ForeignKey
from entities.database import Base

class Grade(Base):
    __tablename__ = "grade"

    id = Column(Integer, primary_key=True, index=True)
    grade = Column(Float)
    movieId = Column(Integer, ForeignKey("movie.id"))
    userId = Column(Integer, ForeignKey("user.id"))
