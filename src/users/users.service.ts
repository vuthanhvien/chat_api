import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    if (!dto.email || !dto.name || !dto.password) {
      throw new BadRequestException('Email, name, and password are required');
    }
    // Check if user already exists
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    // Create the user

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
      },
    });
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  async find({
    page = 1,
    pageSize = 10,
  }: {
    page?: number;
    pageSize?: number;
  }) {
    const skip = (page - 1) * pageSize;
    const users = await this.prisma.user.findMany({
      skip,
      take: pageSize,
    });
    const total = await this.prisma.user.count();
    return {
      data: users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: CreateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
      },
    });
  }
}
