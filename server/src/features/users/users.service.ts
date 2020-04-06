import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { UserRegisterDTO } from '../../models/users/user-register.dto';
import { UserShowDTO } from '../../models/users/user-show.dto';
import { AddFriendDTO } from '../../models/users/add-friend.dto';
import { Role } from '../../database/entities/role.entity';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { ShowNotificationDTO } from '../../models/notifications/show-notification.dto';
import { BanStatus } from '../../database/entities/ban-status.entity';
import { BanStatusDTO } from '../../models/users/ban-status.dto';
import { ForumSystemException } from '../../common/exceptions/system-exception';
import { FriendRequest } from '../../database/entities/friend-request.entity';
import { ActivityRecord } from '../../database/entities/activity.entity';
import { ActivityShowDTO } from '../../models/activity/activity-show.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @InjectRepository(BanStatus) private readonly banStatusRepository: Repository<BanStatus>,
        @InjectRepository(FriendRequest) private readonly friendRequestsRepository: Repository<FriendRequest>,
    ) { }

    // REGISTER
    async registerUser(user: UserRegisterDTO): Promise<UserShowDTO> {

        const existingUser = await this.usersRepository.findOne({
            where: { username: user.username }
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
                where: { name: 'Basic' }
            })]
        newUser.banStatus =
            await this.banStatusRepository.save(
                this.banStatusRepository.create()
            );
        await this.usersRepository.save(newUser);

        return this.toUserShowDTO(newUser);
    }


    // SEND FRIEND REQUEST
    async sendFriendRequest(loggedUser: User, friendToAdd: AddFriendDTO): Promise<UserShowDTO> {

        const foundFriend: User = await this.usersRepository.findOne({
            id: friendToAdd.id,
            username: friendToAdd.username,
            isDeleted: false
        });

        if (foundFriend === undefined) {
            throw new ForumSystemException('User does not exist', 404);
        }

        (await foundFriend.friends).some(friend => {
            if (friend.id === loggedUser.id) {
                throw new ForumSystemException('The user is already added as a friend', 409);
            }
        });

        const foundFriendRequest = await this.friendRequestsRepository.findOne({
            user_a_id: loggedUser.id,
            user_b_id: friendToAdd.id,
            status: false,
        });

        if (foundFriendRequest !== undefined) {
            throw new ForumSystemException('Friend request already sent', 403);
        }

        const newFriendRequest = await this.friendRequestsRepository.create();
        newFriendRequest.user_a_id = loggedUser.id;
        newFriendRequest.user_b_id = foundFriend.id;
        await this.friendRequestsRepository.save(newFriendRequest);

        return this.toUserShowDTO(foundFriend);
    }

    // ACCEPT FRIEND REQUEST
    async acceptFriendRequest(loggedUser: User, friendToAccept: AddFriendDTO): Promise<UserShowDTO> {

        const foundFriend: User = await this.usersRepository.findOne({
            id: friendToAccept.id,
            username: friendToAccept.username,
            isDeleted: false
        });

        if (foundFriend === undefined) {
            throw new ForumSystemException('User does not exist', 404);
        }

        (await foundFriend.friends).some(friend => {
            if (friend.id === loggedUser.id) {
                throw new ForumSystemException('The user is already added as a friend', 409);
            }
        });

        const foundFriendRequest = await this.friendRequestsRepository.findOne({
            user_a_id: friendToAccept.id,
            user_b_id: loggedUser.id,
            status: false,
        });

        if (foundFriendRequest === undefined) {
            throw new ForumSystemException('Friend request does not exist', 404);
        }

        foundFriendRequest.status = true;
        await this.friendRequestsRepository.save(foundFriendRequest);

        // Both users are added to their friends lists
        (await loggedUser.friends).push(foundFriend);
        (await foundFriend.friends).push(loggedUser);

        await this.usersRepository.save(loggedUser);
        await this.usersRepository.save(foundFriend);

        return this.toUserShowDTO(foundFriend);
    }

    // DELETE FRIEND REQUEST
    async deleteFriendRequest(loggedUser: User, friendToDelete: AddFriendDTO): Promise<{ msg: string }> {

        const foundFriendRequest = await this.friendRequestsRepository.findOne({
            user_a_id: friendToDelete.id,
            user_b_id: loggedUser.id,
            status: false,
        });

        if (foundFriendRequest === undefined) {
            throw new ForumSystemException('Friend request does not exist', 404);
        }

        await this.friendRequestsRepository.delete(foundFriendRequest);

        return { msg: 'Request deleted!' }
    }

    // REMOVE FRIEND
    async removeFriend(loggedUser: User, friendId: string): Promise<UserShowDTO> {

        const foundFriend: User = (await loggedUser.friends).filter(friend => friend.id === friendId)[0];

        if (foundFriend === undefined) {
            throw new ForumSystemException('User not found in friends list', 404);
        }

        const foundFriendRequest = await this.friendRequestsRepository.findOne({
            where: [{
                user_a_id: loggedUser.id,
                user_b_id: friendId,
                status: true
            }, {
                user_a_id: friendId,
                user_b_id: loggedUser.id,
                status: true
            }]
        });

        if (foundFriendRequest === undefined) {
            throw new ForumSystemException('Friend request does not exist', 404);
        }

        await this.friendRequestsRepository.delete(foundFriendRequest);

        // Both users are removed from their friends lists
        (await loggedUser.friends).splice((await loggedUser.friends).indexOf(foundFriend), 1);
        (await foundFriend.friends).splice((await foundFriend.friends).indexOf(loggedUser), 1);

        await this.usersRepository.save(loggedUser);
        await this.usersRepository.save(foundFriend);

        return this.toUserShowDTO(foundFriend);
    }

    // GET ALL FRIEND REQUESTS
    async getFriendRequests(loggedUser: User): Promise<UserShowDTO[]> {

        const foundFriendRequests: FriendRequest[] = await this.friendRequestsRepository.find({
            user_b_id: loggedUser.id,
            status: false,
        });

        if (foundFriendRequests === undefined) {
            return [];
        }

        const userIds: string[] = foundFriendRequests.map(request => request.user_a_id);

        const usersFromRequests = await this.usersRepository
            .createQueryBuilder("user")
            .where("user.id IN (:...ids)", { ids: userIds })
            .getMany()

        return usersFromRequests.map(this.toUserShowDTO);
    }


    // GET ALL FRIENDS
    async getFriends(loggedUser: User): Promise<UserShowDTO[]> {
        return (await loggedUser.friends).map(this.toUserShowDTO);
    }


    // BAN USERS
    async updateBanStatus(userId: string, banStatusUpdate: BanStatusDTO): Promise<UserShowDTO> {
        const foundUser: User = await this.usersRepository.findOne({
            id: userId,
            isDeleted: false,
        })

        if (!foundUser) {
            throw new ForumSystemException('User does not exist', 404);
        }
        if (foundUser.banStatus.isBanned) {
            throw new ForumSystemException('User is already banned', 400);
        }

        await this.banStatusRepository.save({ ...foundUser.banStatus, ...banStatusUpdate })

        return this.toUserShowDTO(foundUser)
    }

    // GET ALL NOTIFICATIONS
    async getNotifications(loggedUser: User): Promise<ShowNotificationDTO[]> {
        return (await loggedUser.notifications).map(notification => new ShowNotificationDTO(notification));
    }

    // GET USER ACTIVITY
    async getUserActivity(loggedUser: User, userId: string): Promise<ActivityShowDTO[]> {
        const user = await getConnection().manager.findOne(User, userId);
        const loggedUserRoles = loggedUser.roles.map(role => role.name)

        if (!loggedUserRoles.includes('Admin')) {
            if (loggedUser.id !== user.id) {
                throw new ForumSystemException('Not allowed to read other users\' activity log', 401);
            }
        }
        if (!user) {
            throw new ForumSystemException('User does not exist', 404);
        }

        const records = await getConnection()
            .createQueryBuilder()
            .relation(User, "activity")
            .of(user)
            .loadMany();

        return records.map(this.toActivityShowDTO)
    }

    private toUserShowDTO(user: User): UserShowDTO {
        return plainToClass(
            UserShowDTO,
            user, {
            excludeExtraneousValues: true
        });
    }

    private toActivityShowDTO(record: ActivityRecord): ActivityShowDTO {
        return plainToClass(
            ActivityShowDTO,
            record, {
            excludeExtraneousValues: true
        });
    }
}
