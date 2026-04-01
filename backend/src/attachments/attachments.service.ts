import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './attachment.entity';
import * as fs from 'fs';
import { Task } from 'src/task/task.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,

    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async saveMultipleFiles(
    files: Express.Multer.File[],
    taskId: number,
    userId: number,
  ) {
    if (!files || files.length === 0) {
      throw new NotFoundException('No files uploaded');
    }

    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const attachments = files.map((file) =>
      this.attachmentRepo.create({
        task,
        uploadedBy: user,
        originalName: file.originalname,
        storagePath: file.path,
        fileSize: file.size,
      }),
    );

    return this.attachmentRepo.save(attachments);
  }

  async findByTask(taskId: number) {
    return this.attachmentRepo.find({
      where: { task: { id: taskId } },
      select: ['id', 'originalName', 'fileSize', 'uploadDate'],
    });
  }

  async findById(id: number) {
    const attachment = await this.attachmentRepo.findOne({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    return attachment;
  }

  async deleteFile(attachmentId: number, userId: number) {
    const attachment = await this.attachmentRepo.findOne({
      where: { id: attachmentId },
      relations: ['uploadedBy'],
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    if (attachment.uploadedBy.id !== userId) {
      throw new ForbiddenException('You cannot delete this file');
    }

    if (fs.existsSync(attachment.storagePath)) {
      fs.unlinkSync(attachment.storagePath);
    }

    await this.attachmentRepo.remove(attachment);

    return { message: 'Attachment deleted successfully' };
  }
}
