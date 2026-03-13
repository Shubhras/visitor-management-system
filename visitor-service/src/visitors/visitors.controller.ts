import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VisitorsService } from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { VISITOR_PATTERNS } from '../shared/constants/tcp-patterns';

// All methods listen for TCP messages sent by the API gateway.
// The gateway is responsible for authentication and role checks
// before forwarding the message here.
@Controller()
export class VisitorsController {
    constructor(private readonly visitorsService: VisitorsService) { }

    @MessagePattern(VISITOR_PATTERNS.CREATE)
    create(@Payload() createVisitorDto: CreateVisitorDto) {
        return this.visitorsService.create(createVisitorDto);
    }

    @MessagePattern(VISITOR_PATTERNS.FIND_ALL)
    findAll(
        @Payload() filters: {
            role: string;
            userId: number;
            status?: string;
            page?: number;
            limit?: number;
        },
    ) {
        return this.visitorsService.findAll(filters);
    }

    @MessagePattern(VISITOR_PATTERNS.FIND_ONE)
    findOne(@Payload() payload: { id: number; role: string; userId: number }) {
        return this.visitorsService.findOne(payload);
    }

    @MessagePattern(VISITOR_PATTERNS.UPDATE)
    update(
        @Payload() payload: {
            id: number;
            data: UpdateVisitorDto;
            role: string;
            userId: number;
        },
    ) {
        return this.visitorsService.update(payload);
    }

    @MessagePattern(VISITOR_PATTERNS.DELETE)
    remove(@Payload() payload: { id: number; role: string; userId: number }) {
        return this.visitorsService.remove(payload);
    }

    @MessagePattern(VISITOR_PATTERNS.APPROVE)
    approve(@Payload() payload: { id: number }) {
        return this.visitorsService.approve(payload);
    }

    @MessagePattern(VISITOR_PATTERNS.REJECT)
    reject(@Payload() payload: { id: number }) {
        return this.visitorsService.reject(payload);
    }
}