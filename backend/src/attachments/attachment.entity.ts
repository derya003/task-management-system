import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Task } from 'src/task/task.entity';
import { User } from 'src/user/user.entity';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.attachments, {
    onDelete: 'CASCADE',
  })
  task: Task;

  @ManyToOne(() => User)
  uploadedBy: User;

  @Column()
  originalName: string;

  @Column()
  storagePath: string;

  @Column()
  fileSize: number;

  @CreateDateColumn()
  uploadDate: Date;
}
