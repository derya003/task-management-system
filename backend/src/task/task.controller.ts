import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  Request,
  Query,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskService } from './task.service';
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
    role: 'user' | 'admin';
  };
}

@ApiBearerAuth('jwt')
@ApiTags('Tasks')
@ApiSecurity('bearer') //  burada 'bearer' ismi main.ts'tekiyle aynı olmalı
@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // 👑 ADMIN → tüm görevler
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  @ApiOperation({ summary: 'Admin: tüm kullanıcıların görevlerini getir' })
  getAllTasksForAdmin(@Request() req: AuthenticatedRequest) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('You are not authorized');
    }
    return this.taskService.findAllTasksForAdmin();
  }

  // 👤 USER → kendi görevleri
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Kullanıcının görevlerini getir (filtreli)' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    return this.taskService.findAll(
      req.user.userId,
      req.user.role, // 👈 role gönderiyoruz
      category,
      status,
    );
  }

  // ✅ CREATE (admin assignedUserId gönderebilir)
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Yeni görev oluştur' })
  @ApiBody({ type: CreateTaskDto })
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreateTaskDto) {
    return this.taskService.create(dto, req.user);
  }

  // ✅ UPDATE
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Görev güncelle' })
  @ApiBody({ type: UpdateTaskDto })
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.update(+id, dto, req.user);
  }

  // ✅ DELETE
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Görev sil' })
  delete(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.taskService.delete(+id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('categories')
  @ApiOperation({ summary: 'Görev kategorilerini getir' })
  getCategories() {
    return this.taskService.getCategories();
  }

  // Kullanıcıya özel istatistik
  // Kullanıcıya özel istatistik
  @Get('stats')
  @ApiOperation({ summary: 'Kullanıcının görev istatistiklerini getir' })
  async getUserStats(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId; // sadece id lazım
    return this.taskService.getStatsByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats/global')
  @ApiOperation({ summary: 'göreve ait istatistikleri getir' })
  getStats() {
    return this.taskService.getStatsByCategory();
  }
}
