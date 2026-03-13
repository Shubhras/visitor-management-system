import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { VISITOR_PATTERNS } from '../shared/constants/tcp-patterns';

@Injectable()
export class VisitorsService {
    constructor(
        @Inject('VISITOR_SERVICE')
        private readonly visitorClient: ClientProxy,
    ) { }

    create(data: any, user: any) {
        return firstValueFrom(
            this.visitorClient.send(VISITOR_PATTERNS.CREATE, data),
        );
    }

    findAll(filters: {
        role: string;
        userId: number;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        return firstValueFrom(
            this.visitorClient.send(VISITOR_PATTERNS.FIND_ALL, filters),
        );
    }

    findOne(payload: { id: number; role: string; userId: number }) {
        return firstValueFrom(
            this.visitorClient.send(VISITOR_PATTERNS.FIND_ONE, payload),
        );
    }

    update(payload: { id: number; data: any; role: string; userId: number }) {
        return firstValueFrom(
            this.visitorClient.send(VISITOR_PATTERNS.UPDATE, payload),
        );
    }

    remove(payload: { id: number; role: string; userId: number }) {
        return firstValueFrom(
            this.visitorClient.send(VISITOR_PATTERNS.DELETE, payload),
        );
    }

    approve(payload: { id: number }) {
        return firstValueFrom(
            this.visitorClient.send(VISITOR_PATTERNS.APPROVE, payload),
        );
    }

    reject(payload: { id: number }) {
        return firstValueFrom(
            this.visitorClient.send(VISITOR_PATTERNS.REJECT, payload),
        );
    }
}