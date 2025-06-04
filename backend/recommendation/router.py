from fastapi import APIRouter, Query
from .recommender import recommend_movies

router = APIRouter()

@router.get("/recommendations/{user_id}")
def get_recommendations(user_id: int, sort_by: str = Query("tmdb_avg", enum=["tmdb_avg", "title", "release_date"])):
    return {"result": recommend_movies(user_id, sort_by=sort_by)}
