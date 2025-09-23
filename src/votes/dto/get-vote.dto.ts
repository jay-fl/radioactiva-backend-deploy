import { IsNumberString, IsOptional } from 'class-validator';

export class GetSongsQueryDto {
  @IsOptional()
  @IsNumberString({}, { message: 'El id de cancion debe ser un número' })
  song_id?: number;
}
