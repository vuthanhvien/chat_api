import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

export class RegisterDto {
  email: string;
  name: string;
  password: string;
}

export class LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (user) {
      throw new Error('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.usersService.create({
      ...dto,
      password: hashedPassword,
    });
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    // Return user info or JWT token here
    return { userId: user.id, email: user.email, name: user.name };
  }
}
