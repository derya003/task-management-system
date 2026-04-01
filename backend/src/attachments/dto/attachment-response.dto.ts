import { ApiProperty } from '@nestjs/swagger';

export class AttachmentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'task.pdf' })
  originalName: string;

  @ApiProperty({ example: 148152 })
  fileSize: number;

  @ApiProperty({ example: '2025-12-18T20:48:23.541Z' })
  uploadDate: Date;
}
