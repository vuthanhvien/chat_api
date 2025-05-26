import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret', // Đặt biến môi trường JWT_SECRET
    });
  }

  async validate(payload: any) {
    // payload là dữ liệu bạn đã ký khi tạo token
    return { userId: payload.sub, email: payload.email };
  }
}
