import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { users } from './data/users';
import { Song } from '../songs/entities/song.entity';
import { News } from '../news/entities/news.entity';
import { Vote } from '../votes/entities/vote.entity';
import { news } from './data/news';
import { songs } from './data/songs';
import { votes } from './data/votes';
import { Program } from '../programs/entities/program.entity';
import { programs } from './data/programs';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Song) private readonly songRepository: Repository<Song>,
    @InjectRepository(News) private readonly newsRepository: Repository<News>,
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    const connection = this.dataSource;
    await connection.dropDatabase();
    await connection.synchronize();
  }

  async seed() {
    await this.userRepository.save(users);
    await this.newsRepository.save(news);
    await this.songRepository.save(songs);
    await this.programRepository.save(programs);
    for (const seedVote of votes) {
      const song = await this.songRepository.findOneBy({ id: seedVote.songId });
      const vote = new Vote();

      if (!song) {
        throw new Error('Cancion no encontrada');
      }

      vote.vote = seedVote.vote;
      vote.song = song;

      await this.voteRepository.save(vote);
    }
  }
}
