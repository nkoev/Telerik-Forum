import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/users.entity';

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
    async registerUser(user: Partial<User>): Promise<User> {
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

        const foundUser = await this.find(user)
            .then(res => res[0]);

        if (foundUser !== undefined) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'Username taken',
            }, 409);
        }

        return await this.userRepository.save(user);
    }


    // LOGIN
    async loginUser(user: Partial<User>): Promise<User> {
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

        const foundUser = await this.find(user)
            .then(res => res[0]);

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

        return foundUser;
    }


    // LOGOUT
    async logoutUser() {
        return 'logout...';
    }
}
