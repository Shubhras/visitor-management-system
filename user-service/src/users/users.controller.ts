import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_PATTERNS } from '../shared/constants/tcp-patterns';

// All methods here respond to TCP messages from the API gateway.
// No HTTP exposure — all routing goes through the gateway.
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USER_PATTERNS.CREATE)
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern(USER_PATTERNS.FIND_ALL)
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern(USER_PATTERNS.FIND_ONE)
  findOne(@Payload() payload: { id: number }) {
    return this.usersService.findOne(payload.id);
  }

  @MessagePattern(USER_PATTERNS.FIND_BY_EMAIL)
  findByEmail(@Payload() payload: { email: string }) {
    return this.usersService.findByEmail(payload.email);
  }

  @MessagePattern(USER_PATTERNS.UPDATE)
  update(@Payload() payload: { id: number; data: UpdateUserDto }) {
    return this.usersService.update(payload.id, payload.data);
  }

  @MessagePattern(USER_PATTERNS.DELETE)
  remove(@Payload() payload: { id: number }) {
    return this.usersService.remove(payload.id);
  }
}