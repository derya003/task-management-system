import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../enum/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Yeni görev başlığı' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Görevle ilgili kısa açıklama' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Kişisel', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    description: 'Görevin durumu',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ example: '2025-10-30', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: '16:00', required: false })
  @IsOptional()
  @IsString()
  dueTime?: string;

  // 👑 ADMIN İÇİN EKLENDİ
  @ApiPropertyOptional({
    description: 'Admin için: görevin atanacağı kullanıcı ID',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  assignedUserId?: number;
}
