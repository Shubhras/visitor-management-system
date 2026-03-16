import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_PATTERNS } from '../shared/constants/tcp-patterns';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USER_PATTERNS.SYNC_FROM_AUTH)
  syncFromAuth(
    @Payload() data: { id: number; name: string; email: string; role: string },
  ) {
    return this.usersService.syncFromAuth(data);
  }

  @MessagePattern(USER_PATTERNS.FIND_ALL)
  findAll(
    @Payload() filters: {
      search?: string;
      role?: string;
      isActive?: boolean;
      page?: number;
      limit?: number;
    },
  ) {
    return this.usersService.findAll(filters);
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

  @MessagePattern(USER_PATTERNS.TOGGLE_ACTIVE)
  toggleActive(@Payload() payload: { id: number }) {
    return this.usersService.toggleActive(payload.id);
  }
}