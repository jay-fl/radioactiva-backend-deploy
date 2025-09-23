import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class LoginAuthDto {
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
