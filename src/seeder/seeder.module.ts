import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { Vote } from '../votes/entities/vote.entity';
import { Song } from '../songs/entities/song.entity';
import { News } from '../news/entities/news.entity';
import { User } from '../users/entities/user.entity';
import { Program } from '../programs/entities/program.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Vote, Song, News, User, Program]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
