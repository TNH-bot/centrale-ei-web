from sqlalchemy import Column, Integer, ForeignKey
from entities.database import Base

class MovieGenreGenre(Base):
    __tablename__ = "movie_genre_genre"

    movieId = Column(Integer, ForeignKey("movie.id"), primary_key=True)
    genreId = Column(Integer, ForeignKey("genre.id"), primary_key=True)
