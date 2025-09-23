import { Song } from '../../songs/entities/song.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  vote: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  votingDate: Date;

  @ManyToOne(() => Song)
  song: Song;
}
