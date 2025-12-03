import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { News } from '../news/entities/news.entity';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProgramDto: CreateProgramDto) {
    const user = await this.userRepository.findOneBy({
      id: createProgramDto.userId,
    });
    if (!user) {
      const errors: string[] = [];
      errors.push('El Usuario no existe');
      throw new NotFoundException(errors);
    }
    return this.programRepository.save({
      ...createProgramDto,
      user,
    });
  }

  findAll() {
    return this.programRepository.find({
      relations: {
        user: true,
        //news: true,
      },
      order: {
        id: 'ASC',
      },
    });
  }

  findAllFront() {
    return this.programRepository.find({
      relations: {
        user: true,
        //news: true,
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const program = await this.programRepository.findOneBy({ id });
    if (!program) {
      const errors: string[] = [];
      errors.push('El Programa no existe');
      throw new NotFoundException(errors);
    }
    return program;
  }

  async findOneFront(id: number) {
    const program = await this.programRepository.findOneBy({ id });
    if (!program) {
      const errors: string[] = [];
      errors.push('El Programa no existe');
      throw new NotFoundException(errors);
    }
    return program;
  }

  async update(id: number, updateProgramDto: UpdateProgramDto) {
    const program = await this.findOne(id);
    Object.assign(program, updateProgramDto);
    return await this.programRepository.save(program);
  }

  async remove(id: number) {
    return this.programRepository.manager.transaction(async (manager) => {
      // Buscar el programa con sus relaciones
      const program = await manager.findOne(Program, {
        where: { id },
        relations: ['user', 'news'],
      });

      if (!program) {
        throw new NotFoundException('Programa no encontrado');
      }

      // Buscar usuario admin para reasignar noticias
      const adminUser = await manager.findOne(User, {
        where: { role: 'admin' },
        relations: ['programs'],
      });

      if (!adminUser) {
        throw new NotFoundException('No se encontró un usuario administrador');
      }

      // Obtener un programa del admin para reasignar las noticias
      const adminProgram = adminUser.programs?.[0];
      if (!adminProgram) {
        throw new BadRequestException(
          'El administrador no tiene programas creados',
        );
      }

      // 1. Reasignar noticias del programa a eliminar
      if (program.news && program.news.length > 0) {
        await manager.update(
          News,
          { program: { id: program.id } }, // Buscar noticias por email
          {
            userEmail: adminUser.email, // Actualizar email
            user: adminUser, // Actualizar relación usuario
            program: adminProgram, // Reasignar a programa del admin
          },
        );
      }

      // 2. Eliminar el programa
      await manager.remove(Program, program);

      return {
        message:
          'Programa eliminado. Las noticias fueron reasignadas al administrador.',
      };
    });
  }
}
