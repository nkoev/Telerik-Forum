import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { UserRegisterDTO } from '../../models/users/user-register.dto';
import { UserShowDTO } from '../../models/users/user-show.dto';
import { AddFriendDTO } from '../../models/users/add-friend.dto';
import { Role } from '../../database/entities/role.entity';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { ShowNotificationDTO } from '../../models/notifications/show-notification.dto';
import { FriendRequest } from '../../database/entities/friend-request.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @InjectRepository(FriendRequest) private readonly friendRequestsRepository: Repository<FriendRequest>,
    ) { }

    async all(): Promise<User[]> {
        return await this.usersRepository.find({});
    }

    async find(options: Partial<User>): Promise<User[]> {
        return await this.usersRepository.find({
            where: options
        });
    }

    async findOne(options: Partial<User>): Promise<User> {
        return await this.usersRepository.findOne({
            where: options
        });
    }

    // REGISTER
    async registerUser(user: UserRegisterDTO): Promise<UserShowDTO> {

        const existingUser = await this.usersRepository.findOne({
            where: { username: user.username }
        });

        if (existingUser !== undefined) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'Username taken',
            }, 409);
        }

        user.password = await bcrypt.hash(user.password, 10);

        const newUser: User = this.usersRepository.create(user);
        newUser.posts = Promise.resolve([]);
        newUser.comments = Promise.resolve([]);
        newUser.roles = [
            await this.rolesRepository.findOne({
                where: { name: 'Basic' }
            })]

        await this.usersRepository.save(newUser);

        return this.toUserShowDTO(newUser);
    }


    // SEND FRIEND REQUEST
    async sendFriendRequest(userId: string, friendToAdd: AddFriendDTO): Promise<UserShowDTO> {

        const foundFriend: User = await this.usersRepository.findOne({
            id: friendToAdd.id,
            username: friendToAdd.username,
            isDeleted: false
        });

        if (foundFriend === undefined) {
            throw new BadRequestException('User does not exist');
        }

        (await foundFriend.friends).some(friend => {
            if (friend.id === userId) {
                throw new BadRequestException('The user is already added as a friend');
            }
        });

        const foundFriendRequest = await this.friendRequestsRepository.findOne({
            user_a_id: userId,
            user_b_id: friendToAdd.id,
            status: false,
        });

        if (foundFriendRequest !== undefined) {
            throw new BadRequestException('Request already exists');
        }

        const newFriendRequest = await this.friendRequestsRepository.create();
        newFriendRequest.user_a_id = userId;
        newFriendRequest.user_b_id = foundFriend.id;

        await this.friendRequestsRepository.save(newFriendRequest);

        return this.toUserShowDTO(foundFriend);
    }

    // ACCEPT FRIEND REQUEST
    async acceptFriendRequest(userId: string, friendToAccept: AddFriendDTO): Promise<UserShowDTO> {

        const foundUser: User = await this.usersRepository.findOne({
            id: userId,
            isDeleted: false
        });

        if (foundUser === undefined) {
            throw new BadRequestException('User does not exist');
        }

        const foundFriend: User = await this.usersRepository.findOne({
            id: friendToAccept.id,
            username: friendToAccept.username,
            isDeleted: false
        });

        if (foundFriend === undefined) {
            throw new BadRequestException('User does not exist');
        }

        (await foundFriend.friends).some(friend => {
            if (friend.id === userId) {
                throw new BadRequestException('The user is already added as a friend');
            }
        });

        const foundFriendRequest = await this.friendRequestsRepository.findOne({
            user_a_id: friendToAccept.id,
            user_b_id: userId,
            status: false,
        });

        if (foundFriendRequest === undefined) {
            throw new BadRequestException('Request does not exist');
        }

        foundFriendRequest.status = true;

        await this.friendRequestsRepository.save(foundFriendRequest);

        // Both users are added to their friends lists
        (await foundUser.friends).push(foundFriend);
        (await foundFriend.friends).push(foundUser);

        await this.usersRepository.save(foundUser);
        await this.usersRepository.save(foundFriend);

        return this.toUserShowDTO(foundFriend);
    }

    // DELETE FRIEND REQUEST
    async deleteFriendRequest(userId: string, friendToDelete: AddFriendDTO): Promise<{ msg: string }> {

        const foundFriendRequest = await this.friendRequestsRepository.findOne({
            user_a_id: friendToDelete.id,
            user_b_id: userId,
            status: false,
        });

        if (foundFriendRequest === undefined) {
            throw new BadRequestException('Request does not exist');
        }

        await this.friendRequestsRepository.delete(foundFriendRequest);

        return { msg: 'Request deleted!' }
    }

    // REMOVE FRIEND
    async removeFriend(userId: string, friendId: string): Promise<UserShowDTO> {

        const foundUser: User = await this.usersRepository.findOne({
            id: userId,
            isDeleted: false
        });

        if (foundUser === undefined) {
            throw new BadRequestException('User does not exist');
        }

        const foundFriend: User = (await foundUser.friends).filter(friend => friend.id === friendId)[0];

        if (foundFriend === undefined) {
            throw new BadRequestException('User not found in friends list');
        }

        const foundFriendRequestA = await this.friendRequestsRepository.findOne({
            user_a_id: userId,
            user_b_id: friendId,
            status: true,
        });

        const foundFriendRequestB = await this.friendRequestsRepository.findOne({
            user_a_id: friendId,
            user_b_id: userId,
            status: true,
        });

        if (foundFriendRequestA === undefined && foundFriendRequestB === undefined) {
            throw new BadRequestException('Request does not exist');
        }

        if (foundFriendRequestA) {
            await this.friendRequestsRepository.delete(foundFriendRequestA);
        } else if (foundFriendRequestB) {
            await this.friendRequestsRepository.delete(foundFriendRequestB);
        }

        // Both users are removed from their friends lists
        (await foundUser.friends).splice((await foundUser.friends).indexOf(foundFriend), 1);
        (await foundFriend.friends).splice((await foundFriend.friends).indexOf(foundUser), 1);

        await this.usersRepository.save(foundUser);
        await this.usersRepository.save(foundFriend);

        console.log(foundUser.friends);

        return this.toUserShowDTO(foundFriend);
    }

    // GET ALL FRIEND REQUESTS
    async getFriendRequests(userId: string): Promise<UserShowDTO[]> {

        const foundFriendRequests: FriendRequest[] = await this.friendRequestsRepository.find({
            user_b_id: userId,
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

        console.log(usersFromRequests);

        return usersFromRequests.map(this.toUserShowDTO);
    }


    // GET ALL FRIENDS
    async getFriends(userId: string): Promise<UserShowDTO[]> {

        const foundUser: User = await this.usersRepository.findOne({
            id: userId,
            isDeleted: false
        });

        if (foundUser === undefined) {
            throw new BadRequestException('User does not exist');
        }

        console.log(await foundUser.friends);

        return (await foundUser.friends).map(this.toUserShowDTO);
    }

    private toUserShowDTO(user: User): UserShowDTO {
        return plainToClass(
            UserShowDTO,
            user, {
            excludeExtraneousValues: true
        });
    }


    // GET ALL NOTIFICATIONS
    async getNotifications(userId: string): Promise<ShowNotificationDTO[]> {

        const foundUser: User = await this.usersRepository.findOne({
            id: userId,
            isDeleted: false
        });

        if (foundUser === undefined) {
            throw new BadRequestException('User does not exist');
        }

        const foundNotifications = await foundUser.notifications;

        return (foundNotifications).map(notification => new ShowNotificationDTO(notification));
    }

}
