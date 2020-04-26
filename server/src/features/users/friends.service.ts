import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { UserShowDTO } from '../../models/users/user-show.dto';
// import { AddFriendDTO } from '../../models/users/add-friend.dto';
import { plainToClass } from 'class-transformer';
import { ForumSystemException } from '../../common/exceptions/system-exception';
import { FriendRequest } from '../../database/entities/friend-request.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestsRepository: Repository<FriendRequest>,
  ) {}

  // SEND FRIEND REQUEST
  async sendFriendRequest(
    loggedUser: User,
    friendToAddId: string,
  ): Promise<UserShowDTO> {
    const foundFriend: User = await this.getFriend(friendToAddId);
    await this.checkIfFriends(loggedUser, foundFriend);

    const foundFriendRequest = await this.getFriendRequest(
      loggedUser.id,
      foundFriend.id,
      false,
      true,
    );
    this.validateFriendRequest(foundFriendRequest, false);

    const newFriendRequest = await this.friendRequestsRepository.create();
    newFriendRequest.userA = loggedUser.id;
    newFriendRequest.userB = foundFriend.id;
    await this.friendRequestsRepository.save(newFriendRequest);

    return this.toUserShowDTO(foundFriend);
  }

  // ACCEPT FRIEND REQUEST
  async acceptFriendRequest(
    loggedUser: User,
    friendToAcceptId: string,
  ): Promise<UserShowDTO> {
    const foundFriend: User = await this.getFriend(friendToAcceptId);
    await this.checkIfFriends(loggedUser, foundFriend);

    const foundFriendRequest = await this.getFriendRequest(
      foundFriend.id,
      loggedUser.id,
      true,
      false,
    );
    this.validateFriendRequest(foundFriendRequest, true);
    await this.friendRequestsRepository.save({
      ...foundFriendRequest,
      status: true,
    });

    // Both users are added to their friends lists
    (await loggedUser.friends).push(foundFriend);
    (await foundFriend.friends).push(loggedUser);

    await this.usersRepository.save(loggedUser);
    await this.usersRepository.save(foundFriend);

    return this.toUserShowDTO(foundFriend);
  }

  // DELETE FRIEND REQUEST
  async deleteFriendRequest(
    loggedUser: User,
    friendToDeleteId: string,
  ): Promise<{ msg: string }> {
    const foundFriendRequest = await this.getFriendRequest(
      friendToDeleteId,
      loggedUser.id,
      false,
      false,
    );
    this.validateFriendRequest(foundFriendRequest, true);
    await this.friendRequestsRepository.delete(foundFriendRequest);

    return { msg: 'Request deleted!' };
  }

  // REMOVE FRIEND
  async removeFriend(loggedUser: User, friendId: string): Promise<UserShowDTO> {
    const foundFriend: User = (await loggedUser.friends).filter(
      friend => friend.id === friendId,
    )[0];
    this.validateUser(foundFriend);

    const foundFriendRequest = await this.getFriendRequest(
      loggedUser.id,
      foundFriend.id,
      true,
      true,
    );
    this.validateFriendRequest(foundFriendRequest, true);
    await this.friendRequestsRepository.delete(foundFriendRequest);

    // Both users are removed from their friends lists
    (await loggedUser.friends).splice(
      (await loggedUser.friends).indexOf(foundFriend),
      1,
    );
    (await foundFriend.friends).splice(
      (await foundFriend.friends).indexOf(loggedUser),
      1,
    );

    await this.usersRepository.save(loggedUser);
    await this.usersRepository.save(foundFriend);

    return this.toUserShowDTO(foundFriend);
  }

  // GET ALL RECEIVED FRIEND REQUESTS
  async getReceivedFriendRequests(loggedUser: User): Promise<UserShowDTO[]> {
    const foundFriendRequests: FriendRequest[] = await this.friendRequestsRepository.find(
      {
        userB: loggedUser.id,
        status: false,
      },
    );

    if (foundFriendRequests.length < 1) {
      return [];
    }

    const userIds: string[] = foundFriendRequests.map(request => request.userA);
    const usersFromRequests = await this.usersRepository.find({
      where: {
        id: In(userIds),
      },
    });

    return usersFromRequests.map(this.toUserShowDTO);
  }

  // GET ALL SENT FRIENDS REQUESTS

  async getSentFriendRequests(loggedUser: User): Promise<UserShowDTO[]> {
    const foundFriendRequests: FriendRequest[] = await this.friendRequestsRepository.find(
      {
        userA: loggedUser.id,
        status: false,
      },
    );

    if (foundFriendRequests.length < 1) {
      return [];
    }

    const userIds: string[] = foundFriendRequests.map(request => request.userB);
    const usersFromRequests = await this.usersRepository.find({
      where: {
        id: In(userIds),
      },
    });

    return usersFromRequests.map(this.toUserShowDTO);
  }

  // GET ALL FRIENDS
  async getFriends(loggedUser: User): Promise<UserShowDTO[]> {
    if ((await loggedUser.friends).length < 1) {
      return [];
    }

    const friendIds: string[] = (await loggedUser.friends).map(
      friend => friend.id,
    );

    const foundFriends = await this.usersRepository.find({
      where: {
        id: In(friendIds),
      },
    });

    return foundFriends.map(this.toUserShowDTO);

    // return (await loggedUser.friends).map(this.toUserShowDTO);
  }

  private validateUser(user: User): void {
    if (!user) {
      throw new ForumSystemException('User not found!', 404);
    }
  }

  private async getFriend(userId: string): Promise<User> {
    const foundFriend = await this.usersRepository.findOne({
      id: userId,
      isDeleted: false,
    });

    this.validateUser(foundFriend);

    return foundFriend;
  }

  private async checkIfFriends(user: User, friend: User): Promise<void> {
    (await friend.friends).some(friend => {
      if (friend.id === user.id) {
        throw new ForumSystemException(
          'The user is already added as a friend',
          409,
        );
      }
    });
  }

  private validateFriendRequest(
    request: FriendRequest,
    shouldExist: boolean,
  ): void {
    if (shouldExist === true && request === undefined) {
      throw new ForumSystemException('Friend request does not exist', 404);
    } else if (shouldExist === false && request !== undefined) {
      throw new ForumSystemException('Friend request already exists', 403);
    }
  }

  private async getFriendRequest(
    userAID: string,
    userBID: string,
    status: boolean,
    inBothDirections: boolean,
  ): Promise<FriendRequest> {
    let foundFriendRequest: FriendRequest;

    if (inBothDirections) {
      foundFriendRequest = await this.friendRequestsRepository.findOne({
        where: [
          {
            userA: userAID,
            userB: userBID,
            status: status,
          },
          {
            userA: userBID,
            userB: userAID,
            status: status,
          },
        ],
      });
    } else {
      foundFriendRequest = await this.friendRequestsRepository.findOne({
        where: {
          userA: userAID,
          userB: userBID,
          status: status,
        },
      });
    }

    return foundFriendRequest;
  }

  private toUserShowDTO(user: User): UserShowDTO {
    return plainToClass(UserShowDTO, user, {
      excludeExtraneousValues: true,
    });
  }
}
