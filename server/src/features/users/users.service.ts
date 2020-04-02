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

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
        @InjectRepository(User) private readonly usersRepository: Repository<User>
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


    // ADD FRIEND
    async addFriend(userId: string, user: AddFriendDTO): Promise<UserShowDTO> {

        const foundUser: User = await this.usersRepository.findOne({
            id: userId,
            isDeleted: false
        });

        if (foundUser === undefined) {
            throw new BadRequestException('User does not exist');
        }

        const foundFriend: User = await this.usersRepository.findOne({
            id: user.id,
            username: user.username,
            isDeleted: false
        });

        if (foundFriend === undefined) {
            throw new BadRequestException('User does not exist');
        }

        (await foundFriend.friends).forEach(friend => {
            if (friend.id === foundUser.id) {
                throw new BadRequestException('The user is already added as a friend');
            }
        });

        // Both users are added to their friends lists
        (await foundUser.friends).push(foundFriend);
        (await foundFriend.friends).push(foundUser);

        await this.usersRepository.save(foundUser);
        await this.usersRepository.save(foundFriend);

        return this.toUserShowDTO(foundFriend);
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

        // Both users are removed from their friends lists
        (await foundUser.friends).splice((await foundUser.friends).indexOf(foundFriend), 1);
        (await foundFriend.friends).splice((await foundFriend.friends).indexOf(foundUser), 1);

        await this.usersRepository.save(foundUser);
        await this.usersRepository.save(foundFriend);

        return this.toUserShowDTO(foundFriend);
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

        return (await foundUser.friends).map(this.toUserShowDTO);
    }

    private toUserShowDTO(user: User): UserShowDTO {
        return plainToClass(
            UserShowDTO,
            user, {
            excludeExtraneousValues: true
        });
    }
}
