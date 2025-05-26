import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateRoomDto, RoomService } from './rooms.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async list(@Query() query, @Req() req) {
    const userId = req.user.userId;
    return this.roomService.find(query, userId);
  }

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto, @Req() req) {
    const userId = req.user.userId;
    return this.roomService.create(createRoomDto, userId);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.roomService.findById(id);
  }

  @Post('add-user')
  async addUser(
    @Body('roomId') roomId: string,
    @Body('userIds') userIds: [string],
  ) {
    return this.roomService.addUsersToRoom(roomId, userIds);
  }
  @Post(':id')
  async update(@Param('id') id: string, @Body() updateRoomDto: CreateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }
}
