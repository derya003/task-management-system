import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn() //otomatik artan id her tabloda olması zorunlu
  id: number;

  @Column()
  name: string;

  @Column({ unique: true }) //emaial alanı unique olacak
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: 'user' | 'admin';
}
