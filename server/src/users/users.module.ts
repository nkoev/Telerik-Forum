import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersDatabaseModule } from 'src/database/users/users-database.module';

@Module({
  imports: [UsersDatabaseModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
