from entities.database import SessionLocal
from entities.movie import Movie
from entities.grade import Grade
from entities.movie_actor import MovieStarringActor
from entities.actor import Actor
from entities.genre import Genre
from entities.movie_genre import MovieGenreGenre



def get_user_ratings(user_id: int):
    with SessionLocal() as db:
        grades = db.query(Grade).filter(Grade.userId == user_id).all()
        return [(g.movieId, g.grade) for g in grades]
    
def get_movie(movie_id: int):
    with SessionLocal() as db:

        movie = db.query(Movie).filter(Movie.id == movie_id).first()
        if not movie:
            return None

        actor_names = db.query(Actor.name)\
            .join(MovieStarringActor, Actor.id == MovieStarringActor.actorId)\
            .filter(MovieStarringActor.movieId == movie_id).all()
        
        genre_names = db.query(Genre.name)\
            .join(MovieGenreGenre, Genre.id == MovieGenreGenre.genreId)\
            .filter(MovieGenreGenre.movieId == movie_id).all()


        return {
            "id": movie.id,
            "title": movie.title,
            "release_date": movie.release_date,
            "tmdb_avg": movie.tmdb_average,
            "poster_path": movie.poster_path,
            "genres": [name for (name,) in genre_names],
            "actors": [name for (name,) in actor_names]
        }
    
def get_all_movies():
    with SessionLocal() as db:
        movies = db.query(Movie).all()
        return [
            {
                "id": m.id,
                "title": m.title,
                "release_date": m.release_date,
                "tmdb_avg": m.tmdb_average,
                "poster_path": m.poster_path,
            }
            for m in movies
        ]

def get_actors_for_movie(movie_id: int):
    with SessionLocal() as db:
        joins = db.query(Actor.name).join(MovieStarringActor, Actor.id == MovieStarringActor.actorId)\
            .filter(MovieStarringActor.movieId == movie_id).all()
        return [name for (name,) in joins]

# ----------------------------------------

def recommend_movies(user_id: int, top_n: int = 10, sort_by: str = "tmdb_avg"):
    user_ratings = get_user_ratings(user_id)

    if not user_ratings:
        all_movies = get_all_movies()
        return sorted(all_movies, key=lambda m: -m["tmdb_avg"])[:top_n]

    liked_movies = [m_id for (m_id, r) in user_ratings if r >= 3.5]
    liked_genres = {}
    actor_scores = {}

    for movie_id in liked_movies:
        movie = get_movie(movie_id)
        for genre in movie.get("genres", []):
            liked_genres[genre] = liked_genres.get(genre, 0) + 1
        for actor in movie.get("actors", []):
            actor_scores[actor] = actor_scores.get(actor, 0) + 1

    all_movies = get_all_movies()
    already_seen = set(m_id for m_id, _ in user_ratings)

    recos = [
        m for m in all_movies
        if m["id"] not in already_seen
           and (any(g in liked_genres for g in m["genres"]) or any(a in actor_scores for a in m["actors"]))
    ]

    def score(m):
        genre_overlap = len([g for g in m["genres"] if g in liked_genres])
        actor_overlap = len([a for a in m["actors"] if a in actor_scores])
        pertinence = 2 * genre_overlap + actor_overlap
        secondary = m[sort_by].lower() if sort_by == "title" else m[sort_by]
        return (pertinence, secondary)

    reverse_secondary = sort_by != "title"
    return sorted(recos, key=score, reverse=True if reverse_secondary else False)[:top_n]