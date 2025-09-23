import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsDto {
  @IsNotEmpty({ message: 'El Titulo de la Cancion es Obligatorio' })
  @IsString({ message: 'El Título no válido' })
  headline: string;

  @IsNotEmpty({ message: 'La Historia es Obligatoria' })
  @IsString({ message: 'Valor no válido' })
  story: string;

  @IsNotEmpty({ message: 'La Imagen es Obligatoria' })
  image: string;

  date: Date;

  @IsNotEmpty({ message: 'El ID del Programa es Obligatorio' })
  @IsInt({ message: 'El programa no es valido' })
  programId: number;
}
