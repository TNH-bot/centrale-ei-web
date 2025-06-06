/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class Relations1749116251138 {
    name = 'Relations1749116251138'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "grade" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "grade" float NOT NULL,
                "movieId" integer NOT NULL,
                "userId" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "genre" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE ("name")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "actor" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                CONSTRAINT "UQ_d452a7040f3c08451dc9c2f3ba9" UNIQUE ("name")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "movie_genre_genre" (
                "movieId" integer NOT NULL,
                "genreId" integer NOT NULL,
                PRIMARY KEY ("movieId", "genreId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_3a4b81efbd4fdd362fd1187fac" ON "movie_genre_genre" ("movieId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ab0be65b579c5b4a70d9b676c5" ON "movie_genre_genre" ("genreId")
        `);
        await queryRunner.query(`
            CREATE TABLE "movie_starring_actor" (
                "movieId" integer NOT NULL,
                "actorId" integer NOT NULL,
                PRIMARY KEY ("movieId", "actorId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_cd209485117bd073274f779059" ON "movie_starring_actor" ("movieId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a1b5440b6576c2a2fab0fa189f" ON "movie_starring_actor" ("actorId")
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_grade" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "grade" float NOT NULL,
                "movieId" integer NOT NULL,
                "userId" integer NOT NULL,
                CONSTRAINT "FK_cee3bd040f28bd9fd8d77ba795f" FOREIGN KEY ("movieId") REFERENCES "movie" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_8bb7e985f57c47948850542f9d6" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_grade"("id", "grade", "movieId", "userId")
            SELECT "id",
                "grade",
                "movieId",
                "userId"
            FROM "grade"
        `);
        await queryRunner.query(`
            DROP TABLE "grade"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_grade"
                RENAME TO "grade"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_3a4b81efbd4fdd362fd1187fac"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_ab0be65b579c5b4a70d9b676c5"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_movie_genre_genre" (
                "movieId" integer NOT NULL,
                "genreId" integer NOT NULL,
                CONSTRAINT "FK_3a4b81efbd4fdd362fd1187facb" FOREIGN KEY ("movieId") REFERENCES "movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_ab0be65b579c5b4a70d9b676c54" FOREIGN KEY ("genreId") REFERENCES "genre" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                PRIMARY KEY ("movieId", "genreId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie_genre_genre"("movieId", "genreId")
            SELECT "movieId",
                "genreId"
            FROM "movie_genre_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "movie_genre_genre"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie_genre_genre"
                RENAME TO "movie_genre_genre"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_3a4b81efbd4fdd362fd1187fac" ON "movie_genre_genre" ("movieId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ab0be65b579c5b4a70d9b676c5" ON "movie_genre_genre" ("genreId")
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_cd209485117bd073274f779059"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_a1b5440b6576c2a2fab0fa189f"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_movie_starring_actor" (
                "movieId" integer NOT NULL,
                "actorId" integer NOT NULL,
                CONSTRAINT "FK_cd209485117bd073274f7790593" FOREIGN KEY ("movieId") REFERENCES "movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_a1b5440b6576c2a2fab0fa189f1" FOREIGN KEY ("actorId") REFERENCES "actor" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                PRIMARY KEY ("movieId", "actorId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie_starring_actor"("movieId", "actorId")
            SELECT "movieId",
                "actorId"
            FROM "movie_starring_actor"
        `);
        await queryRunner.query(`
            DROP TABLE "movie_starring_actor"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie_starring_actor"
                RENAME TO "movie_starring_actor"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_cd209485117bd073274f779059" ON "movie_starring_actor" ("movieId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a1b5440b6576c2a2fab0fa189f" ON "movie_starring_actor" ("actorId")
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP INDEX "IDX_a1b5440b6576c2a2fab0fa189f"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_cd209485117bd073274f779059"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie_starring_actor"
                RENAME TO "temporary_movie_starring_actor"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie_starring_actor" (
                "movieId" integer NOT NULL,
                "actorId" integer NOT NULL,
                PRIMARY KEY ("movieId", "actorId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie_starring_actor"("movieId", "actorId")
            SELECT "movieId",
                "actorId"
            FROM "temporary_movie_starring_actor"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie_starring_actor"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a1b5440b6576c2a2fab0fa189f" ON "movie_starring_actor" ("actorId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_cd209485117bd073274f779059" ON "movie_starring_actor" ("movieId")
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_ab0be65b579c5b4a70d9b676c5"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_3a4b81efbd4fdd362fd1187fac"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie_genre_genre"
                RENAME TO "temporary_movie_genre_genre"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie_genre_genre" (
                "movieId" integer NOT NULL,
                "genreId" integer NOT NULL,
                PRIMARY KEY ("movieId", "genreId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie_genre_genre"("movieId", "genreId")
            SELECT "movieId",
                "genreId"
            FROM "temporary_movie_genre_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie_genre_genre"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ab0be65b579c5b4a70d9b676c5" ON "movie_genre_genre" ("genreId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_3a4b81efbd4fdd362fd1187fac" ON "movie_genre_genre" ("movieId")
        `);
        await queryRunner.query(`
            ALTER TABLE "grade"
                RENAME TO "temporary_grade"
        `);
        await queryRunner.query(`
            CREATE TABLE "grade" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "grade" float NOT NULL,
                "movieId" integer NOT NULL,
                "userId" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "grade"("id", "grade", "movieId", "userId")
            SELECT "id",
                "grade",
                "movieId",
                "userId"
            FROM "temporary_grade"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_grade"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_a1b5440b6576c2a2fab0fa189f"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_cd209485117bd073274f779059"
        `);
        await queryRunner.query(`
            DROP TABLE "movie_starring_actor"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_ab0be65b579c5b4a70d9b676c5"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_3a4b81efbd4fdd362fd1187fac"
        `);
        await queryRunner.query(`
            DROP TABLE "movie_genre_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "actor"
        `);
        await queryRunner.query(`
            DROP TABLE "genre"
        `);
        await queryRunner.query(`
            DROP TABLE "grade"
        `);
    }
}
