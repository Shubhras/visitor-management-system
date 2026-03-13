import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    BeforeCreate,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';

@Table({
    tableName: 'users',
    timestamps: true,
})
export class User extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING(150),
        allowNull: false,
        unique: true,
    })
    email: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.ENUM('admin', 'resident'),
        allowNull: false,
        defaultValue: 'resident',
    })
    role: string;

    // The refresh token is stored hashed in the database.
    // When the user logs out or requests a new token, we compare
    // the incoming token against this stored hash.
    @Column({
        type: DataType.TEXT,
        allowNull: true,
        defaultValue: null,
    })
    refreshToken: string | null;

    // This is the token used to reset a forgotten password.
    // It is a short-lived plain token stored temporarily.
    @Column({
        type: DataType.STRING(255),
        allowNull: true,
        defaultValue: null,
    })
    resetPasswordToken: string | null;

    // The expiry timestamp for the reset token so we can
    // invalidate it automatically after a set period.
    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
    })
    resetPasswordExpires: Date | null;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @BeforeCreate
    static async hashPassword(instance: User) {
        if (instance.password) {
            instance.password = await bcrypt.hash(instance.password, 10);
        }
    }
}