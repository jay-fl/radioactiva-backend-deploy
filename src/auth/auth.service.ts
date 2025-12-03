import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ name, email, password, role }: RegisterAuthDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('El email ya está registrado');
    }

    await this.usersService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 10),
      role: role || Role.USER, // Si no se especifica rol, usa USER por defecto
    });

    return {
      name,
      email,
      role: role || Role.USER,
    };
  }

  async login({ email, password }: LoginAuthDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('El email es incorrecto');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password incorrecto');
    }

    const payload = { email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email,
    };
  }

  async profile({ email, role }: { email: string; role: string }) {
    // if (role !== 'admin') {
    //   throw new UnauthorizedException(
    //     'No tienes permisos para acceder a este recurso',
    //   );
    // }
    return await this.usersService.findOneByEmail(email);
  }
}
