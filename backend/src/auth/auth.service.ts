import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    //gerekli servisleri enjekte ediyoruz
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Kullanıcı kayıt işlemi
  async register(dto: RegisterDto): Promise<{ message: string; user: any }> {
    //Promise yazmak zorunda değildik zaten async/await bu işi yapıyor ama kod okunabilirliği için promise ile fonksiyonun geri dönüş tipini belirtmiş oluruz
    const { name, email, password } = dto;

    // Aynı e-postayla kayıtlı kullanicivar mi?
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    // Şifreyi hashle!!!
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcıyı oluştur
    const user = await this.userService.create({
      name,
      email,
      password: hashedPassword,
    });

    return { message: 'User registered successfully', user };
  }

  // Kullanıcı giriş işlemi
  async login(
    dto: LoginDto,
  ): Promise<{ message: string; access_token: string }> {
    const { email, password } = dto;

    // Kullanıcıyı eposta ile bul
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    // Şifre eşleşiyor mu kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    // JWT token oluştur
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Login successful',
      access_token: token,
    };
  }
}
