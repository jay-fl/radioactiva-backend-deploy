import { Vote } from '../../votes/entities/vote.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  artist: string;

  @Column({ type: 'varchar', length: 255 })
  track: string;

  @Column({ type: 'varchar', length: 255 })
  video: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: true,
    default: 'default.svg',
  })
  image: string;

  @OneToMany(() => Vote, (vote) => vote.song, { cascade: true })
  votes: Vote[];
}
