import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// 1 JWT'nin içeriğini (payload) tanımlayan tip
interface JwtPayload {
  sub: number;
  email: string;
  role: 'user' | 'admin';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_KEY', // AuthModule'daki secret ile aynı olmalı
    });
  }

  // 2 Artık payload tipi "JwtPayload", yani any değil
  validate(payload: JwtPayload) {
    // 3️⃣ async kaldırıldı çünkü içinde await yoktu
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
