import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USER_PATTERNS } from '../shared/constants/tcp-patterns';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,
  ) {}

  create(data: any) {
    return firstValueFrom(this.userClient.send(USER_PATTERNS.CREATE, data));
  }

  findAll() {
    return firstValueFrom(this.userClient.send(USER_PATTERNS.FIND_ALL, {}));
  }

  findOne(id: number) {
    return firstValueFrom(this.userClient.send(USER_PATTERNS.FIND_ONE, { id }));
  }

  update(id: number, data: any) {
    return firstValueFrom(this.userClient.send(USER_PATTERNS.UPDATE, { id, data }));
  }

  remove(id: number) {
    return firstValueFrom(this.userClient.send(USER_PATTERNS.DELETE, { id }));
  }
}