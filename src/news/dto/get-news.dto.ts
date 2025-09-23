import { IsNumberString, IsOptional } from 'class-validator';

export class GetNewsQueryDto {
  @IsOptional()
  @IsNumberString({}, { message: 'El id del programa debe ser un numero' })
  program_id: number;

  @IsOptional()
  @IsNumberString({}, { message: 'La cantidad debe ser un numero' })
  take: number;

  @IsOptional()
  @IsNumberString({}, { message: 'La cantidad debe ser un numero' })
  skip: number;
}
