import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { RegisterUserDTO } from '../../models/users/register-user.dto';
import { ShowUserDTO } from '../../models/users/show-user.dto';
import { LoginUserDTO } from '../../models/users/login-user.dto';
import { AddFriendDTO } from '../../models/users/add-friend.dto';
import { Role } from '../../database/entities/role.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Role) private readonly rolesRepository: Repository<Role>
    ) { }

    async all(): Promise<User[]> {
        return await this.userRepository.find({});
    }

    async find(options: Partial<User>): Promise<User[]> {
        return await this.userRepository.find({
            where: options
        });
    }

    async findOne(options: Partial<User>): Promise<User> {
        return await this.userRepository.findOne({
            where: options
        });
    }

    // REGISTER
    async registerUser(user: RegisterUserDTO): Promise<ShowUserDTO> {
        if (user.username === undefined) {
            throw new BadRequestException(
                'Username missing',
            );
        }
        if (user.password === undefined) {
            throw new BadRequestException(
                'Password missing',
            );
        }

        const foundUser = await this.findOne(user);

        if (foundUser !== undefined) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'Username taken',
            }, 409);
        }

        const newUser: User = this.userRepository.create(user);
        newUser.posts = Promise.resolve([]);
        newUser.comments = Promise.resolve([]);
        newUser.roles = [
            await this.rolesRepository.findOne({
                where: { name: 'Basic' }
            })]

        await this.userRepository.save(newUser);

        return this.toShowUserDTO(newUser);
    }


    // LOGIN
    async loginUser(user: LoginUserDTO): Promise<ShowUserDTO> {
        if (user.username === undefined) {
            throw new BadRequestException(
                'Username missing',
            );
        }
        if (user.password === undefined) {
            throw new BadRequestException(
                'Password missing',
            );
        }

        const foundUser = await this.findOne(user);

        if (foundUser === undefined) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'Username not found',
            }, 404);
        }

        if (foundUser.password !== user.password) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'Wrong password',
            }, 409);
        }

        return this.toShowUserDTO(foundUser);
    }


    // LOGOUT
    async logoutUser() {
        return 'logout...';
    }


    // ADD FRIEND
    async addFriend(userId: string, user: AddFriendDTO): Promise<ShowUserDTO> {

        const foundUser: User = await this.userRepository.findOne({
            id: userId,
            isDeleted: false
        });

        if (foundUser === undefined) {
            throw new BadRequestException('User does not exist');
        }

        const foundFriend: User = await this.userRepository.findOne({
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

        await this.userRepository.save(foundUser);
        await this.userRepository.save(foundFriend);

        return this.toShowUserDTO(foundFriend);
    }

    // REMOVE FRIEND
    async removeFriend(userId: string, friendId: string): Promise<ShowUserDTO> {

        const foundUser: User = await this.userRepository.findOne({
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

        await this.userRepository.save(foundUser);
        await this.userRepository.save(foundFriend);

        return this.toShowUserDTO(foundFriend);
    }


    // GET ALL FRIENDS
    async getFriends(userId: string): Promise<ShowUserDTO[]> {

        const foundUser: User = await this.userRepository.findOne({
            id: userId,
            isDeleted: false
        });

        if (foundUser === undefined) {
            throw new BadRequestException('User does not exist');
        }

        return (await foundUser.friends).map(this.toShowUserDTO);
    }

    private toShowUserDTO(user: User): ShowUserDTO {
        return plainToClass(
            ShowUserDTO,
            user, {
            excludeExtraneousValues: true
        });
    }
}
