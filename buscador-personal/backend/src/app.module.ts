import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Cambia si tu PostgreSQL está en otro host
      port: 5432, // Puerto de PostgreSQL
      username: 'postgres', // Cambia por tu usuario de PostgreSQL
      password: 'postgres', // Cambia por tu contraseña de PostgreSQL
      database: 'dbpostgrado3',
      entities: [], // Añadiremos las entidades más adelante
      synchronize: true, // Solo para desarrollo, no usar en producción
    }),
  ],
})
export class AppModule {}