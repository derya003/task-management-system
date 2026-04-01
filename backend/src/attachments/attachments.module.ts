import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './attachment.entity';
import { User } from 'src/user/user.entity';
import { Task } from 'src/task/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment, User, Task])],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
})
export class AttachmentsModule {}
