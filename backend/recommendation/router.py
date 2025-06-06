from fastapi import APIRouter, Query
from .recommender import recommend_movies, get_movie, search_movies, get_movies_by_genre, get_user_profile
from pydantic import BaseModel
from entities.database import SessionLocal
from entities.grade import Grade

router = APIRouter()

class Vote(BaseModel):
    user_id: int
    movie_id: int
    grade: float



@router.get("/recommendations/{user_id}")
def get_recommendations(user_id: int, sort_by: str = Query("tmdb_avg", enum=["tmdb_avg", "title", "release_date"])):
    return {"result": recommend_movies(user_id, sort_by=sort_by)}

@router.get("/debug/movie/{movie_id}")
def debug_movie(movie_id: int):
    return get_movie(movie_id)

@router.get("/search")
def search(
    title: str = "",
    genre: str = "",
    actor: str = "",
    sort_by: str = Query("tmdb_avg", enum=["tmdb_avg", "title", "release_date"])
):
    return search_movies(title=title, genre=genre, actor=actor, sort_by=sort_by)

@router.get("/by_genre")
def by_genre(genre: str):
    return get_movies_by_genre(genre)


@router.get("/profile/{user_id}")
def user_profile(user_id: int):
    return get_user_profile(user_id)

@router.post("/vote")
def vote(data: Vote):
    with SessionLocal() as db:
        existing = db.query(Grade)\
            .filter(Grade.userId == data.user_id, Grade.movieId == data.movie_id)\
            .first()

        if existing:
            existing.grade = data.grade
        else:
            new_vote = Grade(userId=data.user_id, movieId=data.movie_id, grade=data.grade)
            db.add(new_vote)

        db.commit()
        return {
            "message": "Vote enregistré",
            "user_id": data.user_id,
            "movie_id": data.movie_id,
            "grade": data.grade
        }

@router.delete("/vote")
def delete_vote(user_id: int, movie_id: int):
    with SessionLocal() as db:
        vote = db.query(Grade)\
            .filter(Grade.userId == user_id, Grade.movieId == movie_id)\
            .first()

        if vote:
            db.delete(vote)
            db.commit()
            return {"message": "Vote supprimé"}
        else:
            return {"message": "Aucun vote trouvé"}
