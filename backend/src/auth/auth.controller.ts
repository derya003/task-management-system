import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Public } from './public.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Yeni kullanıcı kaydı oluştur' })
  @ApiBody({
    description: 'Yeni bir kullanıcı kaydı için gerekli bilgiler',
    required: true,
    schema: {
      example: {
        name: 'Elif',
        email: 'elif@example.com',
        password: '123456',
      },
    },
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Kullanıcı girişi yap ve JWT token al' })
  @ApiBody({
    description: 'Kullanıcı giriş isteği örneği',
    required: true,
    schema: {
      example: {
        email: 'elif@example.com',
        password: '123456',
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
