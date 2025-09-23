import { PartialType } from '@nestjs/mapped-types';
import { CreateProgramDto } from './create-program.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProgramDto extends PartialType(CreateProgramDto) {
  @IsNotEmpty({ message: 'El Nombre del Programa es Obligatorio' })
  @IsString({ message: 'El Nombre no es válido' })
  name: string;

  @IsNotEmpty({ message: 'El horario de Inicio es Obligatorio' })
  @IsString({ message: 'El Horario no es válido' })
  startTime: string;

  @IsNotEmpty({ message: 'El Horario de Finalización es Obligatorio' })
  @IsString({ message: 'El Horario no es válido' })
  endTime: string;

  @IsNotEmpty({ message: 'El Nombre del Conductor es Obligatorio' })
  @IsString({ message: 'El Nombre del Conductor no es válido' })
  announcer: string;

  @IsOptional()
  @IsString({ message: 'El Horario Alternativo de Inicio no es válido' })
  alternativeST: string;

  @IsOptional()
  @IsString({ message: 'El Horario Alternativo de Finalización no es válido' })
  alternativeET: string;
}
