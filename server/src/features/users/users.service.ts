import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { UserRegisterDTO } from '../../models/users/user-register.dto';
import { UserShowDTO } from '../../models/users/user-show.dto';
import { Role } from '../../database/entities/role.entity';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { ShowNotificationDTO } from '../../models/notifications/show-notification.dto';
import { BanStatus } from '../../database/entities/ban-status.entity';
import { BanStatusDTO } from '../../models/users/ban-status.dto';
import { ForumSystemException } from '../../common/exceptions/system-exception';
import { ActivityRecord } from '../../database/entities/activity.entity';
import { ActivityShowDTO } from '../../models/activity/activity-show.dto';
import moment = require('moment');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(BanStatus)
    private readonly banStatusRepository: Repository<BanStatus>,
  ) {}

  // GET ALL USERS
  async getUsers() {
    const users: User[] = await this.usersRepository.find();
    return users.map(this.toUserShowDTO);
  }

  // REGISTER
  async registerUser(user: UserRegisterDTO): Promise<UserShowDTO> {
    const existingUser = await this.usersRepository.findOne({
      where: { username: user.username },
    });

    if (existingUser !== undefined) {
      throw new ForumSystemException('Username taken', 409);
    }

    user.password = await bcrypt.hash(user.password, 10);
    const newUser: User = this.usersRepository.create(user);
    newUser.posts = Promise.resolve([]);
    newUser.comments = Promise.resolve([]);
    newUser.roles = [
      await this.rolesRepository.findOne({
        where: { name: 'Basic' },
      }),
    ];
    newUser.banStatus = await this.banStatusRepository.save(
      this.banStatusRepository.create(),
    );
    await this.usersRepository.save(newUser);

    return this.toUserShowDTO(newUser);
  }

  // BAN USERS
  async updateBanStatus(
    userId: string,
    banStatusUpdate: BanStatusDTO,
  ): Promise<UserShowDTO> {
    const foundUser: User = await this.usersRepository.findOne({
      id: userId,
      isDeleted: false,
    });

    if (!foundUser) {
      throw new ForumSystemException('User does not exist', 404);
    }
    if (foundUser.banStatus.isBanned) {
      throw new ForumSystemException('User is already banned', 400);
    }

    const expiryDate = moment(banStatusUpdate.expires, 'DD-MM-YYYY', true);
    const presentDate = moment();
    const expiryMaxDate = moment().add(90, 'd');

    if (!expiryDate.isValid()) {
      throw new ForumSystemException(
        'Expiry date should be in format DD-MM-YYYY',
        400,
      );
    }
    if (!expiryDate.isBetween(presentDate, expiryMaxDate)) {
      throw new ForumSystemException(
        'Ban expiry date should be within 90 days from current date',
        400,
      );
    }

    await this.banStatusRepository.save({
      ...foundUser.banStatus,
      ...banStatusUpdate,
    });

    return this.toUserShowDTO(foundUser);
  }

  // DELETE USER
  async deleteUser(userId: string): Promise<UserShowDTO> {
    const foundUser: User = await this.usersRepository.findOne({
      id: userId,
      isDeleted: false,
    });

    if (!foundUser) {
      throw new ForumSystemException('User does not exist', 404);
    }

    await this.usersRepository.save({ ...foundUser, isDeleted: true });

    return this.toUserShowDTO(foundUser);
  }

  // GET ALL NOTIFICATIONS
  async getNotifications(loggedUser: User): Promise<ShowNotificationDTO[]> {
    return (await loggedUser.notifications).map(
      notification => new ShowNotificationDTO(notification),
    );
  }

  // GET USER ACTIVITY
  async getUserActivity(
    loggedUser: User,
    userId: string,
  ): Promise<ActivityShowDTO[]> {
    const user = await getConnection().manager.findOne(User, userId);
    const loggedUserRoles = loggedUser.roles.map(role => role.name);

    if (!loggedUserRoles.includes('Admin')) {
      if (loggedUser.id !== user.id) {
        throw new ForumSystemException(
          "Not allowed to read other users' activity log",
          401,
        );
      }
    }
    if (!user) {
      throw new ForumSystemException('User does not exist', 404);
    }

    const records = await getConnection()
      .createQueryBuilder()
      .relation(User, 'activity')
      .of(user)
      .loadMany();

    return records.map(this.toActivityShowDTO);
  }

  private toUserShowDTO(user: User): UserShowDTO {
    return plainToClass(UserShowDTO, user, {
      excludeExtraneousValues: true,
    });
  }

  private toActivityShowDTO(record: ActivityRecord): ActivityShowDTO {
    return plainToClass(ActivityShowDTO, record, {
      excludeExtraneousValues: true,
    });
  }
}
