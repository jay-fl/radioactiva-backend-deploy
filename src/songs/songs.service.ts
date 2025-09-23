import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './entities/song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private readonly songRepository: Repository<Song>,
  ) {}

  create(createSongDto: CreateSongDto) {
    return this.songRepository.save(createSongDto);
  }

  async findAll(take: number, skip: number) {
    const options: FindManyOptions<Song> = {
      order: {
        id: 'DESC',
      },
      take,
      skip,
    };
    const [songs, total] = await this.songRepository.findAndCount(options);
    return {
      songs,
      total,
    };
  }

  async findOne(id: number) {
    const song = await this.songRepository.findOneBy({ id });
    if (!song) {
      throw new NotFoundException('La cancion no existe');
    }
    return song;
  }

  async update(id: number, updateSongDto: UpdateSongDto) {
    const song = await this.findOne(id);
    Object.assign(song, updateSongDto);
    await this.songRepository.save(song);
    return { message: 'Canción actualizada correctamente' };
  }

  async remove(id: number) {
    const song = await this.findOne(id);
    await this.songRepository.remove(song);
    return { message: 'Cación Eliminada' };
  }
}
