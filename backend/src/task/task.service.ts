import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import { TaskStatus } from './enum/task-status.enum';

type CurrentUser = { userId: number; role: 'user' | 'admin' };

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // 👤 USER → sadece kendi görevleri (filtreli)
  async findAll(
    userId: number,
    role: 'user' | 'admin',
    category?: string,
    status?: string,
  ) {
    const query = this.taskRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user');

    // 👤 USER → sadece kendi task’ları
    if (role === 'user') {
      query.where('user.id = :userId', { userId });
    }

    // 👑 ADMIN → where yok → herkesin task’ı

    if (category && category.trim() !== '') {
      query.andWhere('task.category = :category', { category });
    }

    if (status && status.trim() !== '') {
      query.andWhere('task.status = :status', { status });
    }

    return query.getMany();
  }

  // 👑 ADMIN → tüm görevler
  async findAllTasksForAdmin() {
    return await this.taskRepo.find({ relations: ['user'] });
  }

  // ✅ TASK CREATE
  async create(
    taskData: Partial<Task> & { assignedUserId?: number },
    current: CurrentUser,
  ) {
    // Default: görevin sahibi login olan user
    let ownerUserId = current.userId;

    // Admin ise ve assignedUserId geldiyse görev o kullanıcıya atanır
    if (current.role === 'admin' && taskData.assignedUserId) {
      ownerUserId = taskData.assignedUserId;
    }

    const owner = await this.userRepo.findOne({ where: { id: ownerUserId } });
    if (!owner) throw new NotFoundException('Kullanıcı bulunamadı');

    const task = this.taskRepo.create({
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      status: taskData.status,
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime,
      user: owner,
    });

    return await this.taskRepo.save(task);
  }

  // ✅ UPDATE (user sadece kendi task'ını)
  async update(id: number, data: Partial<Task>, current: CurrentUser) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) throw new NotFoundException('Görev bulunamadı');

    if (current.role !== 'admin' && task.user.id !== current.userId) {
      throw new ForbiddenException('Bu görevi güncelleme yetkin yok');
    }

    Object.assign(task, data);
    return await this.taskRepo.save(task);
  }

  // ✅ DELETE (user sadece kendi task'ını)
  async delete(id: number, current: CurrentUser) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) throw new NotFoundException('Görev bulunamadı');

    if (current.role !== 'admin' && task.user.id !== current.userId) {
      throw new ForbiddenException('Bu görevi silme yetkin yok');
    }

    return await this.taskRepo.delete(id);
  }

  async getCategories(): Promise<string[]> {
    const result = await this.taskRepo
      .createQueryBuilder('task')
      .select('DISTINCT task.category', 'category')
      .where("task.category IS NOT NULL AND task.category != ''")
      .getRawMany<{ category: string }>();

    return result.map((row) => row.category);
  }

  async getStatsByCategory() {
    const tasks = await this.taskRepo.find();

    const stats: Record<string, { completed: number; incomplete: number }> = {};

    tasks.forEach((task) => {
      const cat = task.category || 'Uncategorized';

      if (!stats[cat]) stats[cat] = { completed: 0, incomplete: 0 };

      if (task.status === TaskStatus.COMPLETED) stats[cat].completed += 1;
      else stats[cat].incomplete += 1;
    });

    return Object.entries(stats).map(([category, data]) => ({
      category,
      ...data,
    }));
  }

  // Kullanıcıya özel istatistik
  async getStatsByUser(userId: number) {
    const tasks = await this.taskRepo
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId }) // userId sütunu otomatik oluşturulur
      .getMany();

    const stats: Record<string, { completed: number; incomplete: number }> = {};

    tasks.forEach((task) => {
      const cat = task.category || 'Uncategorized';
      if (!stats[cat]) stats[cat] = { completed: 0, incomplete: 0 };
      if (task.status === TaskStatus.COMPLETED) stats[cat].completed += 1;
      else stats[cat].incomplete += 1;
    });

    return Object.entries(stats).map(([category, data]) => ({
      category,
      ...data,
    }));
  }
}
