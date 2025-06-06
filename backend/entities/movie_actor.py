from sqlalchemy import Column, Integer, ForeignKey
from entities.database import Base

class MovieStarringActor(Base):
    __tablename__ = "movie_starring_actor"

    movieId = Column(Integer, ForeignKey("movie.id"), primary_key=True)
    actorId = Column(Integer, ForeignKey("actor.id"), primary_key=True)
