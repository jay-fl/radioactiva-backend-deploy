import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

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
    const program = await this.findOne(id);
    await this.programRepository.remove(program);
    return { message: 'Programa Eliminado' };
  }
}
