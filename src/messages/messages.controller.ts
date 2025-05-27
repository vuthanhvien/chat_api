import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateMessageDto,
  MessageService,
  ReadMessageDto,
} from './messages.service';

@UseGuards(AuthGuard('jwt'))
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async list(@Query() query) {
    return this.messageService.find(query.roomId);
  }

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto, @Req() req) {
    const userId = req.user.userId;
    return this.messageService.create(createMessageDto, userId);
  }
  @Post()
  async read(@Body() dto: ReadMessageDto, @Req() req) {
    const userId = req.user.userId;
    return this.messageService.readMessage(dto, userId);
  }

  // @Get(':id')
  // async get(@Param('id') id: string) {
  //   return this.messageService.findById(id);
  // }

  // @Post(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateMessageDto: UpdateMessageDto,
  // ) {
  //   return this.messageService.update(id, updateMessageDto);
  // }
}
