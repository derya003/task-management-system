import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  Res,
  UploadedFiles,
} from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Response, Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AttachmentResponseDto } from './dto/attachment-response.dto';

//  req.user tipini net tanımlıyoruz
// req.user tipini net tanımlıyoruz
interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@ApiTags('Attachments')
@ApiBearerAuth('jwt') // 🔐 JWT auth
@Controller('tasks')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  // 📌 Dosya yükleme
  @Post(':taskId/attachments')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'docx', 'xlsx'];
        const extension = file.originalname.split('.').pop()?.toLowerCase();

        if (extension && allowedExtensions.includes(extension)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type'), false);
        }
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Task’a birden fazla dosya yükle' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'taskId',
    type: Number,
    description: 'Task ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Dosyalar yüklendi',
    type: [AttachmentResponseDto],
  })
  uploadAttachments(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('taskId') taskId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.attachmentsService.saveMultipleFiles(
      files,
      Number(taskId),
      req.user.userId,
    );
  }

  // 📌 Task’a ait dosyaları listeleme
  @Get(':taskId/attachments')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Task’a ait dosyaları listele' })
  @ApiParam({
    name: 'taskId',
    type: Number,
    description: 'Task ID',
  })
  @ApiResponse({ status: 200, description: 'Dosya listesi döndü' })
  getAttachmentsByTask(@Param('taskId') taskId: string) {
    return this.attachmentsService.findByTask(Number(taskId));
  }

  // 📌 Dosya indirme
  @Get('attachments/:id/download')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Dosya indir' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Attachment ID',
  })
  async downloadAttachment(@Param('id') id: string, @Res() res: Response) {
    const file = await this.attachmentsService.findById(Number(id));
    return res.download(file.storagePath, file.originalName);
  }

  // 📌 Dosya silme
  @Delete('attachments/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Dosya sil' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Attachment ID',
  })
  @ApiResponse({ status: 200, description: 'Dosya silindi' })
  deleteAttachment(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.attachmentsService.deleteFile(Number(id), req.user.userId);
  }
}
