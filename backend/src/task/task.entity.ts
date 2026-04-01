import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { TaskStatus } from './enum/task-status.enum';
import { Attachment } from 'src/attachments/attachment.entity';
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  category: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({ type: 'date', nullable: true })
  dueDate: string;

  @Column({ type: 'time', nullable: true })
  dueTime: string;

  // Her görev bir kullanıcıya aittir
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Attachment, (attachment) => attachment.task)
  attachments: Attachment[];
}
