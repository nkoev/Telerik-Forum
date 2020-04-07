import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { UserShowDTO } from '../../models/users/user-show.dto';
import { AddFriendDTO } from '../../models/users/add-friend.dto';
import { plainToClass } from 'class-transformer';
import { ForumSystemException } from '../../common/exceptions/system-exception';
import { FriendRequest } from '../../database/entities/friend-request.entity';

@Injectable()
export class FriendsService {

    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @InjectRepository(FriendRequest) private readonly friendRequestsRepository: Repository<FriendRequest>,
    ) { }

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
            userA: loggedUser.id,
            userB: friendToAdd.id,
            status: false,
        });

        if (foundFriendRequest !== undefined) {
            throw new ForumSystemException('Friend request already sent', 403);
        }

        const newFriendRequest = await this.friendRequestsRepository.create();
        newFriendRequest.userA = loggedUser.id;
        newFriendRequest.userB = foundFriend.id;
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
            userA: friendToAccept.id,
            userB: loggedUser.id,
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
            userA: friendToDelete.id,
            userB: loggedUser.id,
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
                userA: loggedUser.id,
                userB: friendId,
                status: true
            }, {
                userA: friendId,
                userB: loggedUser.id,
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
            userB: loggedUser.id,
            status: false
        });

        if (foundFriendRequests.length < 1) {
            return [];
        }

        const userIds: string[] = foundFriendRequests.map(request => request.userA);

        const usersFromRequests = await this.usersRepository.find({
            where: {
                id: In(userIds)
            }
        })

        return usersFromRequests.map(this.toUserShowDTO);
    }


    // GET ALL FRIENDS
    async getFriends(loggedUser: User): Promise<UserShowDTO[]> {
        // if ((await loggedUser.friends).length < 1) {
        //     return [];
        // }

        // const friendIds: string[] = (await loggedUser.friends).map(friend => friend.id);

        // const foundFriends = await this.usersRepository.find({
        //     where: {
        //         id: In(friendIds)
        //     }
        // });

        // return foundFriends.map(this.toUserShowDTO);

        return (await loggedUser.friends).map(this.toUserShowDTO);
    }

    private toUserShowDTO(user: User): UserShowDTO {
        return plainToClass(
            UserShowDTO,
            user, {
            excludeExtraneousValues: true
        });
    }
}
