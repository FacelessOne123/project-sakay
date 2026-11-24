import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import {
  isDuplicateEntry,
  isRowReferencedError,
} from '../common/utils/database-error.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export type SafeUser = Omit<User, 'passwordHash'>;

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /** Remove the password hash before a user leaves the service layer. */
  toSafeUser(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const email = createUserDto.email.trim().toLowerCase();

    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(
      createUserDto.password,
      BCRYPT_ROUNDS,
    );

    const user = this.usersRepository.create({
      fullName: createUserDto.fullName,
      email,
      passwordHash,
      role: createUserDto.role ?? 'Passenger',
      phoneNumber: createUserDto.phoneNumber ?? null,
    });

    try {
      return this.toSafeUser(await this.usersRepository.save(user));
    } catch (error) {
      if (isDuplicateEntry(error)) {
        throw new ConflictException('A user with this email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.find({ order: { userId: 'ASC' } });
    return users.map((user) => this.toSafeUser(user));
  }

  async findOne(userId: number): Promise<SafeUser> {
    const user = await this.findSafeById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} was not found`);
    }
    return user;
  }

  async findSafeById(userId: number): Promise<SafeUser | null> {
    const user = await this.usersRepository.findOne({
      where: { userId },
    });
    return user ? this.toSafeUser(user) : null;
  }

  /**
   * Login only. The passwordHash column is excluded by default, so it has to be
   * selected explicitly here.
   */
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: email.trim().toLowerCase() })
      .getOne();
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<SafeUser> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} was not found`);
    }

    if (updateUserDto.email !== undefined) {
      const email = updateUserDto.email.trim().toLowerCase();
      if (email !== user.email) {
        const existing = await this.usersRepository.findOne({
          where: { email },
        });
        if (existing) {
          throw new ConflictException('A user with this email already exists');
        }
        user.email = email;
      }
    }

    if (updateUserDto.fullName !== undefined) {
      user.fullName = updateUserDto.fullName;
    }
    if (updateUserDto.role !== undefined) {
      user.role = updateUserDto.role;
    }
    if (updateUserDto.phoneNumber !== undefined) {
      user.phoneNumber = updateUserDto.phoneNumber;
    }
    if (updateUserDto.password !== undefined) {
      user.passwordHash = await bcrypt.hash(
        updateUserDto.password,
        BCRYPT_ROUNDS,
      );
    }

    try {
      return this.toSafeUser(await this.usersRepository.save(user));
    } catch (error) {
      if (isDuplicateEntry(error)) {
        throw new ConflictException('A user with this email already exists');
      }
      throw error;
    }
  }

  async remove(userId: number): Promise<{ deleted: true; userId: number }> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} was not found`);
    }

    try {
      await this.usersRepository.remove(user);
    } catch (error) {
      if (isRowReferencedError(error)) {
        throw new ConflictException(
          'This user is referenced by queues or dispatches and cannot be deleted',
        );
      }
      throw error;
    }

    return { deleted: true, userId };
  }
}
