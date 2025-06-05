from entities.database import SessionLocal
from entities.movie import Movie
from entities.grade import Grade
from entities.movie_actor import MovieStarringActor
from entities.actor import Actor
from entities.genre import Genre
from entities.movie_genre import MovieGenreGenre
from sqlalchemy.orm import joinedload

def search_movies(title="", genre="", actor="", sort_by="tmdb_avg"):
    with SessionLocal() as db:
        query = db.query(Movie)

        if title:
            query = query.filter(Movie.title.ilike(f"%{title}%"))

        if genre:
            query = query.join(MovieGenreGenre, Movie.id == MovieGenreGenre.movieId)\
                         .join(Genre, Genre.id == MovieGenreGenre.genreId)\
                         .filter(Genre.name.ilike(f"%{genre}%"))

        if actor:
            query = query.join(MovieStarringActor, Movie.id == MovieStarringActor.movieId)\
                         .join(Actor, Actor.id == MovieStarringActor.actorId)\
                         .filter(Actor.name.ilike(f"%{actor}%"))

        order_col = Movie.tmdb_average if sort_by == "tmdb_avg" else \
                    Movie.title if sort_by == "title" else \
                    Movie.release_date
        results = query.order_by(order_col.desc() if sort_by != "title" else order_col.asc()).all()

        return [
            {
                "id": m.id,
                "title": m.title,
                "release_date": m.release_date,
                "poster_path": m.poster_path,
                "tmdb_avg": m.tmdb_average
            }
            for m in results
        ]



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

def get_movies_by_genre(genre_name: str):
    with SessionLocal() as db:
        results = db.query(Movie)\
            .join(MovieGenreGenre, Movie.id == MovieGenreGenre.movieId)\
            .join(Genre, Genre.id == MovieGenreGenre.genreId)\
            .filter(Genre.name.ilike(f"%{genre_name}%"))\
            .all()

        return [
            {
                "id": m.id,
                "title": m.title,
                "release_date": m.release_date,
                "tmdb_avg": m.tmdb_average,
                "poster_path": m.poster_path,
            }
            for m in results
        ]
    
def get_user_profile(user_id: int):
    with SessionLocal() as db:
        # Récupérer les notes
        grades = db.query(Grade).filter(Grade.userId == user_id).all()
        if not grades:
            return {"message": "Aucune note pour cet utilisateur."}

        movie_ids = [g.movieId for g in grades]
        avg_rating = round(sum(g.grade for g in grades) / len(grades), 2)
        #  Attention : note utilisateur sur 5 — ne pas comparer directement à tmdb_avg (sur 10)

        # Films notés
        movies = db.query(Movie).filter(Movie.id.in_(movie_ids)).all()
        rated_titles = [m.title for m in movies]

        # Genres préférés
        genre_counts = {}
        genre_data = db.query(Genre.name)\
            .join(MovieGenreGenre, Genre.id == MovieGenreGenre.genreId)\
            .filter(MovieGenreGenre.movieId.in_(movie_ids)).all()
        for (name,) in genre_data:
            genre_counts[name] = genre_counts.get(name, 0) + 1

        fav_genres = sorted(genre_counts.items(), key=lambda x: -x[1])

        # Acteurs préférés
        actor_counts = {}
        actor_data = db.query(Actor.name)\
            .join(MovieStarringActor, Actor.id == MovieStarringActor.actorId)\
            .filter(MovieStarringActor.movieId.in_(movie_ids)).all()
        for (name,) in actor_data:
            actor_counts[name] = actor_counts.get(name, 0) + 1

        fav_actors = sorted(actor_counts.items(), key=lambda x: -x[1])

        return {
            "average_rating": avg_rating,
            "rated_movies": rated_titles,
            "favorite_genres": fav_genres,
            "favorite_actors": fav_actors
        }
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