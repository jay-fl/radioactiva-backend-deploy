import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { Song } from '../songs/entities/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Song])],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
