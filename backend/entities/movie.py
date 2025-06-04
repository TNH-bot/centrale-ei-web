from sqlalchemy import Column, Integer, String, Float
from entities.database import Base

class Movie(Base):
    __tablename__ = "movie"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True)
    release_date = Column(String)  # ou Date
    poster_path = Column(String)
    tmdb_average = Column(Float, nullable=True)
