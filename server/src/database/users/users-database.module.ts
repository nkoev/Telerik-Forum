import { Module } from '@nestjs/common';
import { UsersInMemoryStorage } from './users-in-memory-storage';

@Module({
  providers: [UsersInMemoryStorage],
  exports: [UsersInMemoryStorage],
})
export class UsersDatabaseModule {}
