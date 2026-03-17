import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async syncFromAuth(data: {
    id: number;
    name: string;
    email: string;
    role: string;
  }) {

    const existing = await this.userModel.findByPk(data.id);
    if (existing) {
      return { success: true, message: 'User profile already exists' };
    }

    const user = await this.userModel.create({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      isActive: true,
    } as any);

    return {
      success: true,
      data: user,
    };
  }

  async findAll(filters: {
    search?: string;
    role?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};
    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.isActive !== undefined && filters.isActive !== null) {
      where.isActive = filters.isActive;
    }

    if (filters.search) {
      const searchTerm = `%${filters.search}%`;
      where[Op.or] = [
        { name: { [Op.like]: searchTerm } },
        { email: { [Op.like]: searchTerm } },
        { phone: { [Op.like]: searchTerm } },
      ];
    }

    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? Math.min(filters.limit, 100) : 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.userModel.findAndCountAll({
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

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, data: user };
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, data: user };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    await user.update(updateUserDto);

    return { success: true, data: user };
  }

  async remove(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    await user.destroy();

    return { success: true, message: 'User deleted successfully' };
  }

  async toggleActive(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    await user.update({ isActive: !user.isActive });

    return {
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user,
    };
  }
}