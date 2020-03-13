import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UserDTO } from './models/user.dto';
import { UsersInMemoryStorage } from 'src/database/users/users-in-memory-storage';

@Injectable()
export class UsersService {
    constructor(private readonly users: UsersInMemoryStorage<UserDTO>) { }

    registerUser(username: string, password: string) {
        if (username === undefined) {
            throw new BadRequestException(
                'Username missing',
            );
        }
        if (password === undefined) {
            throw new BadRequestException(
                'Password missing',
            );
        }

        // // for testing purposes only
        // this.users.add({id: 0, username: 'Test User', password: '12345', isDeleted: false});

        const foundUser = this.users.findByUsername(username);

        if (foundUser) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'Username taken',
            }, 409);
        }

        const registeredUser: UserDTO = {
            id: 0,
            username: username,
            password: password,
            isDeleted: false
        }

        this.users.add(registeredUser);

        return registeredUser;
    }

    loginUser(username: string, password: string) {
        if (username === undefined) {
            throw new BadRequestException(
                'Username missing',
            );
        }
        if (password === undefined) {
            throw new BadRequestException(
                'Password missing',
            );
        }

        // for testing purposes only
        // this.users.add({id: 0, username: 'Test User', password: '12345', isDeleted: false});
        const foundUser = this.users.findByUsername(username);

        if (foundUser === undefined) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'Username not found',
            }, 404);
        }

        if (foundUser.password !== password) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'Wrong password',
            }, 409);
        }

        return foundUser;
    }
}
