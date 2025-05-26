import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

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
    if (!dto.email || !dto.name || !dto.password) {
      throw new BadRequestException('All fields are required');
    }
    const user = await this.usersService.findByEmail(dto.email);
    if (user) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });
    // Return user info or JWT token here
    const payload = {
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_secret',
      {
        expiresIn: '100y',
      },
    );
    return {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      token: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    // Return user info or JWT token here
    const payload = { sub: user.id, email: user.email, name: user.name };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_secret',
      {
        expiresIn: '100y',
      },
    );
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      token: token,
    };
  }
}
