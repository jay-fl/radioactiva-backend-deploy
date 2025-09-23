import { IsNumberString, IsOptional } from 'class-validator';

export class GetSongsQueryDto {
  @IsOptional()
  @IsNumberString({}, { message: 'La cantidad debe ser un numero' })
  take: number;

  @IsOptional()
  @IsNumberString({}, { message: 'La cantidad debe ser un numero' })
  skip: number;
}
