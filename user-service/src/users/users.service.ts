import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Check if a user with this email already exists before trying to insert.
    // This gives a clean error message instead of a raw database constraint error.
    const existingUser = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'A user with this email address already exists',
      };
    }

    const user = await this.userModel.create(createUserDto as any);

    return {
      success: true,
      data: this.sanitize(user),
    };
  }

  async findAll() {
    const users = await this.userModel.findAll({
      // Never return passwords in list responses even though they are hashed.
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });

    return {
      success: true,
      data: users,
    };
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, data: user };
  }

  async findByEmail(email: string) {
    // This method is called by the auth service indirectly through the gateway
    // when it needs to cross-reference a user during token validation.
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

    return {
      success: true,
      data: this.sanitize(user),
    };
  }

  async remove(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    await user.destroy();

    return { success: true, message: 'User deleted successfully' };
  }

  // Strip the password field before returning a user object to the caller.
  // We do this in a helper so we never forget to do it in any method.
  private sanitize(user: User) {
    const { password, ...safeUser } = user.toJSON();
    return safeUser;
  }
}