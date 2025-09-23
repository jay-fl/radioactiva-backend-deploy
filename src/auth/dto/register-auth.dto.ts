import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterAuthDto {
  @Transform(({ value }) => value.trim())
  @IsString({ message: 'El nombre debe ser un texto.' })
  @MinLength(1, { message: 'El nombre es requerido.' })
  name: string;

  @IsNotEmpty({ message: 'El Email es Obligatorio' })
  @IsEmail({}, { message: 'Email no válido' })
  email: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'La contraseña es requerida.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).*$/,
    {
      message:
        'La contraseña debe contener al menos una minúscula, una mayúscula, un número y un carácter especial.',
    },
  )
  password: string;
}
