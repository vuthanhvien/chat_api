import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto, UsersService } from './users.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Endpoint to retrieve all users in the system.',
  })
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
