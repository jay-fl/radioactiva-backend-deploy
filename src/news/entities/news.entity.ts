import { User } from '../../users/entities/user.entity';
import { Program } from '../../programs/entities/program.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 110 })
  headline: string;

  @Column({ type: 'varchar', length: 5000 })
  story: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: true,
    default: 'default.webp',
  })
  image: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  date: Date;

  @ManyToOne(() => Program, (program) => program.news)
  program: Program;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
  user: User;

  @Column({ type: 'varchar', length: 120 })
  userEmail: string;
}
