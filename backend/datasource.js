import { DataSource } from 'typeorm';

const appDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: false,
  entities: ['entities/*.js'],
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
});

export default appDataSource;
