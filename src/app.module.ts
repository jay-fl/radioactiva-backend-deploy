import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { typeOrmConfig } from './config/typeorm.config';
import { SongsModule } from './songs/songs.module';
import { VotesModule } from './votes/votes.module';
import { UsersModule } from './users/users.module';
import { ProgramsModule } from './programs/programs.module';
import { AuthModule } from './auth/auth.module';
import { UploadImageModule } from './upload-image/upload-image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    NewsModule,
    SongsModule,
    VotesModule,
    UsersModule,
    ProgramsModule,
    AuthModule,
    UploadImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
