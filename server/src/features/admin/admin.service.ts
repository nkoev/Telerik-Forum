import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../database/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>
  ) { }

  async banUsers(userId: string) {
    return 'Iuhuuuuuu'
  }
}