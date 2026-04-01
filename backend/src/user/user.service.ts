import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(user: Partial<User>) {
    const newUser = this.repo.create(user);
    return this.repo.save(newUser);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  // ✅ ADMIN için: tüm kullanicilari getir
  async findAll() {
    return this.repo.find({
      select: ['id', 'email', 'role'], // 🔒 password GİTMEZ
    });
  }
}
