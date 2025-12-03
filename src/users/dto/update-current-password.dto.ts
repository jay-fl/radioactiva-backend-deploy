import { Transform } from 'class-transformer';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UpdateCurrentPasswordDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'La contraseña actual es requerida.' })
  current_password: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'La nueva contraseña es requerida.' })
  @MinLength(8, {
    message: 'La nueva contraseña debe tener al menos 8 caracteres.',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).*$/,
    {
      message:
        'La nueva contraseña debe contener al menos una minúscula, una mayúscula, un número y un carácter especial.',
    },
  )
  password: string;

  // Para confirmación de contraseña (opcional pero recomendado)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'La confirmación de contraseña es requerida.' })
  password_confirmation: string;
}
