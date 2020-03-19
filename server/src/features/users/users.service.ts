import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/users.entity';
import { RegisterUserDTO } from '../../models/users/register-user.dto';
import { ShowUserDTO } from '../../models/users/show-user.dto';
import { LoginUserDTO } from '../../models/users/login-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
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

        await this.userRepository.save(newUser);

        return {
            username: newUser.username
        };
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

        return {
            username: foundUser.username
        };
    }


    // LOGOUT
    async logoutUser() {
        return 'logout...';
    }
}
