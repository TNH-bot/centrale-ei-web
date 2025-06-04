import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTmdbAverageToMovie1749028651914 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("movie", new TableColumn({
            name: "tmdb_average",
            type: "float",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("movie", "tmdb_average");
    }

}
