import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateRoomDto, RoomService } from './rooms.service';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async list(@Query() query) {
    return this.roomService.find(query);
  }

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.roomService.findById(id);
  }

  @Post(':id')
  async update(@Param('id') id: string, @Body() updateRoomDto: CreateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }
}
