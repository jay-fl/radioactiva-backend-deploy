import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Program } from '../programs/entities/program.entity';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly newsRepository: Repository<News>,
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
  ) {}

  async create(createNewsDto: CreateNewsDto, user: UserActiveInterface) {
    const program = await this.validateProgram(createNewsDto.programId);
    if (program.user.email !== user.email) {
      const errors: string[] = [];
      errors.push('No tienes permiso para crear noticias en este programa');
      throw new UnauthorizedException(errors);
    }
    return this.newsRepository.save({
      ...createNewsDto,
      program,
      userEmail: user.email,
    });
  }

  async findAll(
    programId: number,
    take: number,
    skip: number,
    user: UserActiveInterface,
  ) {
    const options: FindManyOptions<News> = {
      relations: {
        program: true,
      },
      where: {
        userEmail: user.email,
      },
      order: {
        id: 'DESC',
      },
      take,
      skip,
    };
    if (programId) {
      options.where = {
        program: {
          id: programId,
        },
      };
    }

    const [news, total] = await this.newsRepository.findAndCount(options);

    return {
      news,
      total,
    };
  }

  async findAllFront(programId: number, take: number, skip: number) {
    const options: FindManyOptions<News> = {
      relations: {
        program: true,
      },
      order: {
        id: 'DESC',
      },
      take,
      skip,
    };
    if (programId) {
      options.where = {
        program: {
          id: programId,
        },
      };
    }

    const [news, total] = await this.newsRepository.findAndCount(options);

    return {
      news,
      total,
    };
  }

  async findOne(id: number, user: UserActiveInterface) {
    const options: FindManyOptions<News> = {
      where: {
        id,
      },
      relations: {
        program: true,
      },
    };
    const news = await this.newsRepository.findOne(options);
    if (!news) {
      const errors: string[] = [];
      errors.push('La Noticia no existe');
      throw new NotFoundException(errors);
    }
    if (news.program.user.email !== user.email) {
      const errors: string[] = [];
      errors.push('No tienes permiso para acceder a esta noticia');
      throw new UnauthorizedException(errors);
    }
    return news;
  }

  async findOneFront(id: number) {
    const options: FindManyOptions<News> = {
      where: {
        id,
      },
      relations: {
        program: true,
      },
    };
    const news = await this.newsRepository.findOne(options);
    if (!news) {
      const errors: string[] = [];
      errors.push('La Noticia no existe');
      throw new NotFoundException(errors);
    }

    return news;
  }

  async update(
    id: number,
    updateNewsDto: UpdateNewsDto,
    user: UserActiveInterface,
  ) {
    const news = await this.findOne(id, user);
    Object.assign(news, updateNewsDto);

    // if (updateNewsDto.programId) {
    //   news.program = await this.validateProgram(updateNewsDto.programId);
    // }

    if (updateNewsDto.programId !== news.program.id) {
      const errors: string[] = [];
      errors.push(
        'No tienes autorizacion para editar noticias en este programa',
      );
      throw new UnauthorizedException(errors);
    }
    await this.newsRepository.save(news);
    return { message: 'Noticia actualizada correctamente' };
  }

  async remove(id: number, user: UserActiveInterface) {
    const news = await this.findOne(id, user);
    await this.newsRepository.remove(news);
    return { message: 'Noticia Eliminada' };
  }

  private async validateProgram(programId: number) {
    const programEntity = await this.programRepository.findOneBy({
      id: programId,
    });
    if (!programEntity) {
      const errors: string[] = [];
      errors.push('El Programa no existe');
      throw new NotFoundException(errors);
    }
    return programEntity;
  }
}
