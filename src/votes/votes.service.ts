import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
//import { UpdateVoteDto } from './dto/update-vote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Song } from '../songs/entities/song.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Song) private readonly songRepository: Repository<Song>,
  ) {}

  async create(createVoteDto: CreateVoteDto) {
    const song = await this.songRepository.findOneBy({
      id: createVoteDto.songId,
    });
    if (!song) {
      const errors: string[] = [];
      errors.push('La Cancion no existe');
      throw new NotFoundException(errors);
    }
    return this.voteRepository.save({
      ...createVoteDto,
      song,
    });
  }

  async findAll(songId: number) {
    const options: FindManyOptions<Vote> = {
      relations: {
        song: true,
      },
      order: {
        id: 'DESC',
      },
    };

    if (songId) {
      options.where = {
        song: {
          id: songId,
        },
      };
    }
    const [votes, total] = await this.voteRepository.findAndCount(options);
    return {
      votes,
      total,
    };
  }

  async findOne(id: number) {
    const options: FindManyOptions<Vote> = {
      where: {
        id,
      },
    };
    const vote = await this.voteRepository.findOne(options);
    if (!vote) {
      throw new NotFoundException('El voto no existe');
    }
    return vote;
  }

  // update(id: number, updateVoteDto: UpdateVoteDto) {
  //   return `This action updates a #${id} vote`;
  // }

  async remove(id: number) {
    const vote = await this.findOne(id);
    await this.voteRepository.remove(vote);
    return { message: 'Voto Eliminado' };
  }
}
