import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserLoginDTO } from '../../models/users/user-login.dto';
import { UserShowDTO } from '../../models/users/user-show.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  private readonly blacklist: string[] = [];

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByUsername(username: string) {
    return await this.userRepository.findOne({ username, isDeleted: false });
  }

  private async validateUser(username: string, plaintextPassword: string) {
    const user = await this.findUserByUsername(username);
    if (!user) {
      return null;
    }
    const isUserValidated = await bcrypt.compare(
      plaintextPassword,
      user.password,
    );
    return isUserValidated ? user : null;
  }

  async login(loginUser: UserLoginDTO): Promise<{ token: string }> {
    const user = await this.validateUser(
      loginUser.username,
      loginUser.password,
    );

    if (!user) {
      throw new UnauthorizedException('Wrong credentials!');
    }

    const payload: UserShowDTO = Object.assign(
      {},
      plainToClass(UserShowDTO, user, {
        excludeExtraneousValues: true,
      }),
    );
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }

  async logout(token: string): Promise<{ msg: string }> {
    this.blacklistToken(token);

    return { msg: 'Successful logout!' };
  }

  public blacklistToken(token: string): void {
    this.blacklist.push(token);
  }

  public isTokenBlacklisted(token: string): boolean {
    return this.blacklist.some(blacklistedToken => blacklistedToken === token);
  }
}
