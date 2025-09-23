import { IsInt } from 'class-validator';

export class CreateVoteDto {
  @IsInt({ message: 'Cantidad no valida' })
  vote: number;

  @IsInt({ message: 'Cancion no valida' })
  songId: number;
}
