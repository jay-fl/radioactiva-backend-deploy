import { PartialType } from '@nestjs/mapped-types';
import { CreateSongDto } from './create-song.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSongDto extends PartialType(CreateSongDto) {
  @IsNotEmpty({ message: 'El nombre del artista es obligatorio' })
  @IsString({ message: 'Tipo de dato no valido' })
  artist: string;

  @IsNotEmpty({ message: 'El nombre de la cancion es obligatorio' })
  @IsString({ message: 'Tipo de dato no valido' })
  track: string;

  @IsNotEmpty({ message: 'El link del video es obligatorio' })
  @IsString({ message: 'Tipo de dato no valido' })
  video: string;

  @IsNotEmpty({ message: 'La Imagen es Obligatoria' })
  image: string;
}
