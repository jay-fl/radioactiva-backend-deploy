import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { News } from '../news/entities/news.entity';
import { Program } from '../programs/entities/program.entity';
import { UpdateCurrentPasswordDto } from './dto/update-current-password.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(News) private readonly newsRepository: Repository<News>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findByEmailWithPassword(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'],
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async updateCurrentUser(
    userEmail: string,
    updateUserAdminDto: UpdateUserAdminDto,
  ) {
    const user = await this.findOneByEmail(userEmail);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el nuevo email ya existe
    if (updateUserAdminDto.email && updateUserAdminDto.email !== user.email) {
      const emailExists = await this.findOneByEmail(updateUserAdminDto.email);
      if (emailExists) {
        throw new BadRequestException('El email ya está en uso');
      }
    }

    const oldEmail = user.email;
    let newEmail = user.email;

    // Actualizar campos
    if (updateUserAdminDto.name) {
      user.name = updateUserAdminDto.name;
    }

    if (updateUserAdminDto.email) {
      user.email = updateUserAdminDto.email;
      newEmail = updateUserAdminDto.email;
    }

    await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        if (oldEmail !== newEmail) {
          // 1. Crear email temporal único
          const tempEmail = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}@temp.com`;

          // 2. Actualizar usuario con email temporal
          await transactionalEntityManager.update(
            User,
            { email: oldEmail },
            { email: tempEmail },
          );

          // 3. Actualizar noticias con el nuevo email real
          await transactionalEntityManager.update(
            News,
            { userEmail: oldEmail },
            { userEmail: newEmail },
          );

          // 4. Actualizar usuario con el email real final
          await transactionalEntityManager.update(
            User,
            { email: tempEmail },
            { email: newEmail },
          );
        } else {
          // Si no cambió el email, solo actualizar otros campos
          await transactionalEntityManager.save(User, user);
        }
      },
    );

    return {
      message: 'Usuario actualizado correctamente',
    };
  }

  async updateByAdmin(id: number, updateUserAdminDto: UpdateUserAdminDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el nuevo email ya existe
    if (updateUserAdminDto.email && updateUserAdminDto.email !== user.email) {
      const emailExists = await this.findOneByEmail(updateUserAdminDto.email);
      if (emailExists) {
        throw new BadRequestException('El email ya está en uso');
      }
    }

    const oldEmail = user.email;
    let newEmail = user.email;

    // Actualizar campos
    if (updateUserAdminDto.name) {
      user.name = updateUserAdminDto.name;
    }

    if (updateUserAdminDto.email) {
      user.email = updateUserAdminDto.email;
      newEmail = updateUserAdminDto.email;
    }

    await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        if (oldEmail !== newEmail) {
          // 1. Crear email temporal único
          const tempEmail = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}@temp.com`;

          // 2. Actualizar usuario con email temporal
          await transactionalEntityManager.update(
            User,
            { email: oldEmail },
            { email: tempEmail },
          );

          // 3. Actualizar noticias con el nuevo email real
          await transactionalEntityManager.update(
            News,
            { userEmail: oldEmail },
            { userEmail: newEmail },
          );

          // 4. Actualizar usuario con el email real final
          await transactionalEntityManager.update(
            User,
            { email: tempEmail },
            { email: newEmail },
          );
        } else {
          // Si no cambió el email, solo actualizar otros campos
          await transactionalEntityManager.save(User, user);
        }
      },
    );

    return {
      message: 'Usuario actualizado correctamente',
    };
  }

  async updateCurrentPassword(
    userEmail: string,
    updateCurrentPasswordDto: UpdateCurrentPasswordDto,
  ) {
    const user = await this.findByEmailWithPassword(userEmail);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 1. Verificar que la contraseña actual sea correcta
    const isPasswordValid = await bcryptjs.compare(
      updateCurrentPasswordDto.current_password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // 2. Verificar que la nueva contraseña no sea igual a la actual
    const isSamePassword = await bcryptjs.compare(
      updateCurrentPasswordDto.password,
      user.password,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'La nueva contraseña debe ser diferente a la actual',
      );
    }

    // Verificar que las nuevas contraseñas coincidan
    if (
      updateCurrentPasswordDto.password !==
      updateCurrentPasswordDto.password_confirmation
    ) {
      throw new BadRequestException('Las contraseñas nuevas no coinciden');
    }

    // 3. Hashear la NUEVA contraseña (no la actual)
    const hashedPassword = await bcryptjs.hash(
      updateCurrentPasswordDto.password, // ← Usar password, NO current_password
      10,
    );

    // 4. Actualizar el usuario con la nueva contraseña
    user.password = hashedPassword;

    // 5. Guardar los cambios en la base de datos
    await this.userRepository.save(user);

    return {
      message: 'Contraseña actualizada correctamente',
    };
  }

  async remove(id: number) {
    return this.userRepository.manager.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id },
        relations: ['programs', 'programs.news'],
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
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

      // 1. Reasignar noticias usando userEmail (columna directa)
      await manager.update(
        News,
        { userEmail: user.email }, // Buscar por email directo
        {
          userEmail: adminUser.email, // Actualizar email
          user: adminUser, // Actualizar relación
          program: adminProgram, // Reasignar a programa del admin
        },
      );

      // 2. Eliminar programas del usuario
      await manager.delete(Program, { user: { id: user.id } });

      // 3. Eliminar el usuario
      await manager.remove(User, user);

      return {
        message:
          'Usuario eliminado. Sus noticias fueron reasignadas al administrador.',
      };
    });
  }
}
