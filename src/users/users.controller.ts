import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get()
  find(@Query() query) {
    return this.usersService.find(query);
  }

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get(':id')
  findOne(@Body('id') id: string) {
    return this.usersService.findOne(id);
  }
  @Post(':id')
  updateUser(@Body('id') id: string, @Body() dto: CreateUserDto) {
    return this.usersService.update(id, dto);
  }
}
