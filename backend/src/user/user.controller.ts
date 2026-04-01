import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';

@Controller('api/user') //  ÇOK ÖNEMLİ
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 👑 SADECE ADMIN → TÜM KULLANICILAR
  @Get()
  @Roles('admin')
  findAllUsers() {
    return this.userService.findAll();
  }
}
