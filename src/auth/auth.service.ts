import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SocketService } from 'src/socket/socket.service';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
  })
  email: string;
  @ApiProperty({
    description: 'User name',
  })
  name: string;
  @ApiProperty({
    description: 'User password',
  })
  password: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
  })
  email: string;
  @ApiProperty({
    description: 'User password',
  })
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly socketService: SocketService,
  ) {}

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
    this.socketService.emitToAll('user:registered', {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });
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

  async getUserInfo(userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
