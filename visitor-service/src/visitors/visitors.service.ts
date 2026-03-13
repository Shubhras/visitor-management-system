import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Visitor } from './models/visitor.model';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { VisitorStatus } from './enums/visitor-status.enum';

@Injectable()
export class VisitorsService {
    constructor(
        @InjectModel(Visitor)
        private readonly visitorModel: typeof Visitor,
    ) { }

    async create(createVisitorDto: CreateVisitorDto) {
        const visitor = await this.visitorModel.create(createVisitorDto as any);

        return {
            success: true,
            data: visitor,
        };
    }

    async findAll(filters: {
        role: string;
        userId: number;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: any = {};

        if (filters.role === 'resident') {
            where.createdBy = filters.userId;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        // Set sensible defaults so callers do not have to always provide pagination params.
        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? Math.min(filters.limit, 100) : 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await this.visitorModel.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });

        const totalPages = Math.ceil(count / limit);

        return {
            success: true,
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
    }

    async findOne(payload: { id: number; role: string; userId: number }) {
        const visitor = await this.visitorModel.findByPk(payload.id);

        if (!visitor) {
            return { success: false, message: 'Visitor not found' };
        }

        // A resident should not be able to view a visitor record that
        // belongs to a different resident, even if they know the ID.
        if (payload.role === 'resident' && visitor.createdBy !== payload.userId) {
            return { success: false, message: 'You do not have access to this visitor record' };
        }

        return { success: true, data: visitor };
    }

    async update(payload: {
        id: number;
        data: UpdateVisitorDto;
        role: string;
        userId: number;
    }) {
        const visitor = await this.visitorModel.findByPk(payload.id);

        if (!visitor) {
            return { success: false, message: 'Visitor not found' };
        }

        // Residents can only update their own visitor records.
        if (payload.role === 'resident' && visitor.createdBy !== payload.userId) {
            return { success: false, message: 'You can only update your own visitor records' };
        }

        // Once a visitor has been approved or rejected, it should not be editable.
        // This prevents residents from changing details after an admin has already reviewed it.
        if (visitor.status !== VisitorStatus.PENDING) {
            return {
                success: false,
                message: 'Only pending visitor records can be updated',
            };
        }

        await visitor.update(payload.data);

        return { success: true, data: visitor };
    }

    async remove(payload: { id: number; role: string; userId: number }) {
        const visitor = await this.visitorModel.findByPk(payload.id);

        if (!visitor) {
            return { success: false, message: 'Visitor not found' };
        }

        // Residents can only delete their own pending visitors.
        // Admins can delete any visitor record regardless of status.
        if (payload.role === 'resident') {
            if (visitor.createdBy !== payload.userId) {
                return { success: false, message: 'You can only delete your own visitor records' };
            }

            if (visitor.status !== VisitorStatus.PENDING) {
                return {
                    success: false,
                    message: 'You can only delete pending visitor records',
                };
            }
        }

        await visitor.destroy();

        return { success: true, message: 'Visitor record deleted successfully' };
    }

    async approve(payload: { id: number }) {
        // Only admins can call this. Role enforcement happens at the gateway level
        // so by the time we get here we know the caller is an admin.
        const visitor = await this.visitorModel.findByPk(payload.id);

        if (!visitor) {
            return { success: false, message: 'Visitor not found' };
        }

        if (visitor.status === VisitorStatus.APPROVED) {
            return { success: false, message: 'This visitor has already been approved' };
        }

        await visitor.update({ status: VisitorStatus.APPROVED });

        return { success: true, data: visitor };
    }

    async reject(payload: { id: number }) {
        const visitor = await this.visitorModel.findByPk(payload.id);

        if (!visitor) {
            return { success: false, message: 'Visitor not found' };
        }

        if (visitor.status === VisitorStatus.REJECTED) {
            return { success: false, message: 'This visitor has already been rejected' };
        }

        await visitor.update({ status: VisitorStatus.REJECTED });

        return { success: true, data: visitor };
    }
}