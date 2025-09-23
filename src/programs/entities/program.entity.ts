import { News } from '../../news/entities/news.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  startTime: string;

  @Column({ type: 'varchar', length: 255 })
  endTime: string;

  @Column({ type: 'varchar', length: 255 })
  announcer: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alternativeST: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alternativeET: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: true,
    default: 'default.webp',
  })
  image: string;

  @ManyToOne(() => User, (user) => user.programs, { eager: true })
  user: User;

  @OneToMany(() => News, (news) => news.program, { cascade: true })
  news: News[];
}
