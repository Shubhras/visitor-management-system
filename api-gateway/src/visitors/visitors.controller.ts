import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { VisitorsService } from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Visitors')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller('visitors')
export class VisitorsController {
    constructor(private readonly visitorsService: VisitorsService) { }

    // Both admins and residents can create visitor requests.
    // The createdBy field is pulled from the JWT so residents
    // cannot submit requests on behalf of other residents.
    @Post()
    @ApiOperation({ summary: 'Create a new visitor request' })
    create(
        @Body() createVisitorDto: CreateVisitorDto,
        @CurrentUser() user: any,
    ) {
        return this.visitorsService.create({
            ...createVisitorDto,
            createdBy: user.id,
        }, user);
    }

    @Get()
    @ApiOperation({ summary: 'Get paginated visitor list with search and filters' })
    @ApiQuery({ name: 'search', required: false, description: 'Search by visitor name, phone, or unit number' })
    @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED'] })
    @ApiQuery({ name: 'visitDateFrom', required: false, description: 'Filter from date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'visitDateTo', required: false, description: 'Filter to date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'createdBy', required: false, description: 'Filter by resident user ID (admin only)' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    findAll(
        @CurrentUser() user: any,
        @Query('search') search?: string,
        @Query('status') status?: string,
        @Query('visitDateFrom') visitDateFrom?: string,
        @Query('visitDateTo') visitDateTo?: string,
        @Query('createdBy') createdBy?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.visitorsService.findAll({
            role: user.role,
            userId: user.id,
            search,
            status,
            visitDateFrom,
            visitDateTo,
            createdBy: user.role === 'admin' && createdBy ? parseInt(createdBy) : undefined,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single visitor by ID' })
    findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
        return this.visitorsService.findOne({ id, role: user.role, userId: user.id });
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a visitor record' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
        @CurrentUser() user: any,
    ) {
        return this.visitorsService.update({
            id,
            data: body,
            role: user.role,
            userId: user.id,
        });
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a visitor record' })
    remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
        return this.visitorsService.remove({ id, role: user.role, userId: user.id });
    }

    // Only admins can approve. The @Roles decorator enforces this
    // before the request even reaches the service layer.
    @Patch(':id/approve')
    @Roles('admin')
    @ApiOperation({ summary: 'Approve a visitor request (admin only)' })
    approve(@Param('id', ParseIntPipe) id: number) {
        return this.visitorsService.approve({ id });
    }

    @Patch(':id/reject')
    @Roles('admin')
    @ApiOperation({ summary: 'Reject a visitor request (admin only)' })
    reject(@Param('id', ParseIntPipe) id: number) {
        return this.visitorsService.reject({ id });
    }
}